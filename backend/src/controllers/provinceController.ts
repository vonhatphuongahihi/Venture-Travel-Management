import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ResponseUtils } from '@/utils';

const prisma = new PrismaClient();

export class ProvinceController {
    // Get all provinces
    static async getProvinces(req: Request, res: Response): Promise<void> {
        try {
            const provinces = await prisma.province.findMany({
                orderBy: {
                    name: 'asc',
                },
            });

            // Transform to frontend format
            const formattedProvinces = provinces.map((province) => ({
                id: province.provinceId,
                name: province.name,
                slug: province.provinceId.toLowerCase().replace(/\s+/g, '-'), // Generate slug from provinceId or name
                image: province.images && province.images.length > 0 ? province.images[0] : '/placeholder.svg',
                images: province.images,
                region: province.region,
                description: '', // Add description field if needed in database
                point: {
                    long: 0, // Add coordinates if needed in database
                    lat: 0,
                },
            }));

            res.status(200).json(ResponseUtils.success('Lấy danh sách tỉnh thành thành công', formattedProvinces));
        } catch (error) {
            console.error('🔴 [ProvinceController] Get provinces error:', error);
            res.status(500).json(ResponseUtils.error(
                'Không thể lấy danh sách tỉnh thành',
                error instanceof Error ? error.message : 'Lỗi không xác định'
            ));
        }
    }

    // Get province by slug or ID
    static async getProvinceBySlug(req: Request, res: Response): Promise<void> {
        try {
            const { slug } = req.params;

            // Try to find by provinceId first
            let province = await prisma.province.findUnique({
                where: { provinceId: slug },
            });

            // If not found, try to find by name (case-insensitive)
            if (!province) {
                province = await prisma.province.findFirst({
                    where: {
                        name: {
                            equals: slug,
                            mode: 'insensitive',
                        },
                    },
                });
            }

            if (!province) {
                res.status(404).json(ResponseUtils.error('Không tìm thấy tỉnh thành'));
                return;
            }

            // Transform to frontend format
            const formattedProvince = {
                id: province.provinceId,
                name: province.name,
                slug: province.provinceId.toLowerCase().replace(/\s+/g, '-'),
                image: province.images && province.images.length > 0 ? province.images[0] : '/placeholder.svg',
                images: province.images,
                region: province.region,
                description: '',
                point: {
                    long: 0,
                    lat: 0,
                },
            };

            res.status(200).json(ResponseUtils.success('Lấy thông tin tỉnh thành thành công', formattedProvince));
        } catch (error) {
            console.error('🔴 [ProvinceController] Get province by slug error:', error);
            res.status(500).json(ResponseUtils.error(
                'Không thể lấy thông tin tỉnh thành',
                error instanceof Error ? error.message : 'Lỗi không xác định'
            ));
        }
    }
}

