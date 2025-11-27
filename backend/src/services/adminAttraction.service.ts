import { PrismaClient } from "@prisma/client";
import cloudinaryService from "./cloudinaryService";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export class AdminAttractionService {
  // 🟦 GET LIST + FILTER
 static async getAttractions(query: any) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (query.provinceId) where.provinceId = query.provinceId;
  if (query.category) where.category = query.category;

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { address: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.attraction.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        province: true,          // Lấy tên tỉnh
        reviews: {
          include: {
            user: true,          // Nếu muốn lấy thông tin user review
          },
        },
      },
    }),
    prisma.attraction.count({ where }),
  ]);

  return { items, total, page, limit };
}

// 🟦 GET PROVINCES inside attraction module
 static async getProvinces() {
    return prisma.province.findMany({
      orderBy: { name: "asc" },
    });
  }

  // 🟩 GET DETAIL
  static async getAttractionById(attractionId: string) {
    const data = await prisma.attraction.findUnique({
      where: { attractionId },
    });

    if (!data) throw new Error("Attraction not found");
    return data;
  }

  // 🟧 CREATE
static async createAttraction(req: any) {
    const files = req.files as Express.Multer.File[];
    const body = req.body;

    if (!body.lat || !body.lng) {
  throw new Error("Latitude and longitude are required");
}

    // 1️⃣ Tạo Point
    const point = await prisma.point.create({
      data: {
        latitude: parseFloat(body.lat),
        longitude: parseFloat(body.lng),
      },
    });

    // 2️⃣ Upload ảnh
    const imageUrls: string[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const uploaded = await cloudinaryService.uploadImage(
          file.buffer,
          `attraction_${Date.now()}`,
          "venture-travel/attractions"
        );
        imageUrls.push(uploaded.secure_url);
      }
    }

    // 3️⃣ Tạo Attraction
    const newAttraction = await prisma.attraction.create({
      data: {
        attractionId: uuidv4(), // tạo id mới
        name: body.name,
        address: body.address,
        description: body.description,
        provinceId: body.provinceId,
        category: body.category,
        images: imageUrls,
        geom: point.pointId, // liên kết point
      },
    });

    return newAttraction;
  }


  // 🟨 UPDATE
  static async updateAttraction(attractionId: string, payload: any) {
    return await prisma.attraction.update({
      where: { attractionId },
      data: payload,
    });
  }

  // 🟥 DELETE
  static async deleteAttraction(attractionId: string) {
    await prisma.attraction.delete({
      where: { attractionId },
    });
    return true;
  }
}
