import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Start seeding price categories...");

    const priceCategories = [
        {
            name: "Người lớn",
            description: "Từ 12 tuổi trở lên",
        },
        {
            name: "Người lớn",
            description: "Trên 140cm",
        },
        {
            name: "Trẻ em",
            description: "Từ 5 tuổi đến dưới 12 tuổi",
        },
        {
            name: "Trẻ em",
            description: "Dưới 140cm",
        },
        {
            name: "Trẻ nhỏ",
            description: "Từ 2 tuổi đến dưới 5 tuổi",
        },
        {
            name: "Người cao tuổi",
            description: "Từ 60 tuổi trở lên",
        },
    ];

    try {
        await prisma.priceCategory.createMany({
            data: priceCategories,
            skipDuplicates: true,
        });
    } catch (error) {
        console.log(error);
    }
    console.log("Seeding finished!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
