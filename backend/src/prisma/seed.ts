import prisma from "@/lib/prisma";
import { randAddress, randNumber, randPhoneNumber, randProductName, randText } from "@ngneat/falso";
import { Prisma, WeekDay } from "@prisma/client";

function generateRandomHours(): { day: WeekDay; open: string; close: string }[] {
    const allDays: WeekDay[] = [WeekDay.Monday, WeekDay.Tuesday, WeekDay.Wednesday, WeekDay.Thursday, WeekDay.Friday, WeekDay.Saturday];

    const workingDays = allDays.slice(0, randNumber({ min: 4, max: 6 }));

    return workingDays.map((day) => {
        const openHour = randNumber({ min: 7, max: 10 });
        const closeHour = randNumber({ min: 17, max: 22 });

        return {
            day,
            open: `${openHour.toString().padStart(2, "0")}:00`,
            close: `${closeHour.toString().padStart(2, "0")}:00`,
        };
    });
}

const industryBlueprints = [
    {
        type: "Grooming & Barbershop",
        pool: [
            {
                name: "Executive Haircut",
                category: "Haircuts",
                thumbnail: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1200&auto=format&fit=crop",
                basePrice: 35,
            },
            {
                name: "Beard Sculpting",
                category: "Beard Care",
                thumbnail: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=1200&auto=format&fit=crop",
                basePrice: 20,
            },
            {
                name: "Luxury Hot Towel Shave",
                category: "Shaves",
                thumbnail: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200&auto=format&fit=crop",
                basePrice: 40,
            },
            {
                name: "Hair Coloring",
                category: "Coloring",
                thumbnail: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1200&auto=format&fit=crop",
                basePrice: 75,
            },
            {
                name: "Keratin Treatment",
                category: "Treatments",
                thumbnail: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop",
                basePrice: 110,
            },
        ],
    },

    {
        type: "Health & Luxury Spa",
        pool: [
            {
                name: "Swedish Massage",
                category: "Massage",
                thumbnail: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1200&auto=format&fit=crop",
                basePrice: 90,
            },
            {
                name: "Hot Stone Therapy",
                category: "Therapy",
                thumbnail: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1200&auto=format&fit=crop",
                basePrice: 120,
            },
            {
                name: "Hydrating Facial",
                category: "Facials",
                thumbnail: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop",
                basePrice: 65,
            },
            {
                name: "Body Scrub Detox",
                category: "Body Care",
                thumbnail: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop",
                basePrice: 85,
            },
            {
                name: "Aromatherapy Session",
                category: "Relaxation",
                thumbnail: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=1200&auto=format&fit=crop",
                basePrice: 55,
            },
        ],
    },

    {
        type: "Fitness & Performance Center",
        pool: [
            {
                name: "Personal Training",
                category: "Coaching",
                thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
                basePrice: 60,
            },
            {
                name: "HIIT Group Session",
                category: "Group Classes",
                thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
                basePrice: 25,
            },
            {
                name: "Yoga Flow",
                category: "Yoga",
                thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
                basePrice: 18,
            },
            {
                name: "Nutrition Consultation",
                category: "Consultation",
                thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop",
                basePrice: 70,
            },
            {
                name: "Olympic Weightlifting",
                category: "Strength",
                thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
                basePrice: 80,
            },
        ],
    },

    {
        type: "Automotive Care Clinic",
        pool: [
            {
                name: "Oil Change",
                category: "Maintenance",
                thumbnail: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=1200&auto=format&fit=crop",
                basePrice: 45,
            },
            {
                name: "Ceramic Coating",
                category: "Detailing",
                thumbnail: "https://images.unsplash.com/photo-1607861716497-e65ab29fc7ac?q=80&w=1200&auto=format&fit=crop",
                basePrice: 250,
            },
            {
                name: "Brake Replacement",
                category: "Repair",
                thumbnail: "https://images.unsplash.com/photo-1613214150384-a24ebf8d8fdf?q=80&w=1200&auto=format&fit=crop",
                basePrice: 130,
            },
            {
                name: "Interior Deep Cleaning",
                category: "Detailing",
                thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
                basePrice: 75,
            },
            {
                name: "Engine Diagnostics",
                category: "Diagnostics",
                thumbnail: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop",
                basePrice: 55,
            },
        ],
    },
];

const bannerPools: Record<string, string[]> = {
    "Grooming & Barbershop": [
        "https://images.unsplash.com/photo-1512690459411-b0fd1c86b8a8?q=80&w=1400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?q=80&w=1400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?q=80&w=1400&auto=format&fit=crop",
    ],

    "Health & Luxury Spa": [
        "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=1400&auto=format&fit=crop",
    ],

    "Fitness & Performance Center": [
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?q=80&w=1400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1400&auto=format&fit=crop",
    ],

    "Automotive Care Clinic": [
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1400&auto=format&fit=crop",
    ],
};

const ownerId = "user_3E5W2yM0VRFJDehasNi1tVti2a2";
const TOTAL_BUSINESSES = 24;

async function main() {
    if (process.env["ALLOW_DESTRUCTIVE_SEED"] !== "true") {
        throw new Error("Set ALLOW_DESTRUCTIVE_SEED=true before seeding.");
    }

    console.log("🧹 Clearing database...");

    await prisma.booking.deleteMany({});
    await prisma.service.deleteMany({});
    await prisma.businessHour.deleteMany({});
    await prisma.business.deleteMany({});

    console.log("👤 Creating owner...");

    await prisma.user.upsert({
        where: { id: ownerId },
        update: {},
        create: {
            id: ownerId,
            name: "Seed Business Owner",
            phone: "+251911234567",
            roles: ["Business"],
        },
    });

    console.log(`🌱 Creating ${TOTAL_BUSINESSES} businesses...`);

    const createdBusinesses: {
        id: string;
        industryIndex: number;
    }[] = [];

    for (let i = 0; i < TOTAL_BUSINESSES; i++) {
        const blueprint = industryBlueprints[i % industryBlueprints.length];

        if (!blueprint) continue;

        const business = await prisma.business.create({
            data: {
                ownerId,
                name: `${randProductName()} ${blueprint.type}`,
                description: randText({ charCount: 180 }),
                location: randAddress().street,
                phone: randPhoneNumber(),
                bannerImages: bannerPools[blueprint.type] ?? [],
                hours: {
                    create: generateRandomHours(),
                },
            },
        });

        createdBusinesses.push({
            id: business.id,
            industryIndex: i % industryBlueprints.length,
        });
    }

    console.log("⚡ Creating services...");

    const services: Prisma.ServiceCreateManyInput[] = [];

    for (const business of createdBusinesses) {
        const blueprint = industryBlueprints[business.industryIndex];

        if (!blueprint) continue;

        for (const service of blueprint.pool) {
            services.push({
                businessId: business.id,
                name: service.name,
                category: service.category,
                thumbnail: service.thumbnail,
                durationInMinutes: randNumber({
                    min: 30,
                    max: 120,
                    precision: 15,
                }),
                price: service.basePrice + randNumber({ min: 0, max: 30 }),
            });
        }
    }

    await prisma.service.createMany({
        data: services,
    });

    console.log("✅ Seed complete");
    console.log(`🏢 Businesses: ${createdBusinesses.length}`);
    console.log(`🛠 Services: ${services.length}`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
