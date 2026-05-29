import prisma from "@/lib/prisma";

async function main() {
    if (process.env["ALLOW_DESTRUCTIVE_SEED"] !== "true") {
        throw new Error("Refusing destructive seed. Set ALLOW_DESTRUCTIVE_SEED=true to continue.");
    }

    console.log("🧹 Flushing existing collection pipelines...");
    await prisma.booking.deleteMany({});
    await prisma.service.deleteMany({});
    await prisma.businessHour.deleteMany({});
    await prisma.business.deleteMany({});
}

main()
    .catch((e) => {
        console.error("🔴 Seeding failed with error:", e);
        process.exitCode = 1;
    })
    .finally(async () => await prisma.$disconnect());
