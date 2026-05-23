import prisma from "@/lib/prisma";
import type { Prisma, WeekDay } from "@prisma/client";
import { randCompanyName, randLocale, randNumber, randPhoneNumber, randText, randTimeZone } from "@ngneat/falso";

function generateRandomHours(): { day: WeekDay; open: string; close: string }[] {
    const days: WeekDay[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // Mix it up: some open early at 6 AM, some late at 10 AM
    const openHour = Math.floor(Math.random() * 5) + 6;
    const closeHour = Math.floor(Math.random() * 6) + 16; // Closes between 4 PM and 10 PM

    const openStr = `${openHour.toString().padStart(2, "0")}:00`;
    const closeStr = `${closeHour.toString().padStart(2, "0")}:00`;

    return days.map((day) => ({ day, open: openStr, close: closeStr }));
}

// Structured blueprint mapping business types to deep contextual categories, services, and realistic imagery
const industryBlueprints = [
    {
        type: "Grooming & Barbershop",
        pool: [
            { name: "Executive Haircut", category: "Haircuts", thumbnail: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70", basePrice: 35 },
            { name: "Beard Sculpting & Trim", category: "Shaves & Beard", thumbnail: "https://images.unsplash.com/photo-1621605815841-aa33c56318d1", basePrice: 20 },
            { name: "Luxury Hot Shave", category: "Shaves & Beard", thumbnail: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1", basePrice: 45 },
            { name: "Scalp Revitalizing Treatment", category: "Hair Treatments", thumbnail: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1", basePrice: 30 },
            { name: "Full Color & Highlights", category: "Coloring", thumbnail: "https://images.unsplash.com/photo-1560869713-7d0a29430803", basePrice: 85 },
            { name: "Nose & Ear Waxing", category: "Add-ons", thumbnail: "https://images.unsplash.com/photo-1515377905703-c4788e51af15", basePrice: 15 },
            { name: "Charcoal Face Mask Peel", category: "Skin Care", thumbnail: "https://images.unsplash.com/photo-1512290923902-8a9f81dc2069", basePrice: 25 },
            { name: "Premium Keratin Straightening", category: "Hair Treatments", thumbnail: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e", basePrice: 120 },
        ],
    },
    {
        type: "Health & Luxury Spa",
        pool: [
            { name: "Deep Tissue Muscle Release", category: "Massages", thumbnail: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874", basePrice: 95 },
            { name: "Signature Swedish Massage", category: "Massages", thumbnail: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2", basePrice: 85 },
            { name: "Volcanic Hot Stone Therapy", category: "Therapies", thumbnail: "https://images.unsplash.com/photo-1519415510271-433ad6102628", basePrice: 110 },
            { name: "Hydrating Botanical Facial", category: "Skin Care", thumbnail: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881", basePrice: 65 },
            { name: "Detoxifying Dead Sea Mud Bath", category: "Therapies", thumbnail: "https://images.unsplash.com/photo-1515377905703-c4788e51af15", basePrice: 75 },
            { name: "Zen Aromatherapy Head Spa", category: "Hair Treatments", thumbnail: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1", basePrice: 50 },
            { name: "Anti-Aging Glow Treatment", category: "Skin Care", thumbnail: "https://images.unsplash.com/photo-1512290923902-8a9f81dc2069", basePrice: 130 },
            { name: "Epsom Salt Floatation Therapy", category: "Therapies", thumbnail: "https://images.unsplash.com/photo-1531853121101-da94cfa6433a", basePrice: 90 },
        ],
    },
    {
        type: "Fitness & Performance Center",
        pool: [
            { name: "1-on-1 Personal Training Session", category: "Private Coaching", thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b", basePrice: 60 },
            { name: "High-Intensity Interval Circuit (HIIT)", category: "Group Classes", thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd", basePrice: 25 },
            { name: "Vinyasa Flow Yoga Class", category: "Mind & Body", thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b", basePrice: 20 },
            { name: "Sports Nutrition Consultation", category: "Consultations", thumbnail: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71", basePrice: 80 },
            { name: "Body Composition & MetCheck", category: "Consultations", thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd", basePrice: 40 },
            { name: "Advanced Olympic Weightlifting", category: "Private Coaching", thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd", basePrice: 75 },
            { name: "Guided Power Meditation", category: "Mind & Body", thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773", basePrice: 15 },
        ],
    },
    {
        type: "Automotive Care Clinic",
        pool: [
            { name: "Full Synthetic Oil Exchange", category: "Maintenance", thumbnail: "https://images.unsplash.com/photo-1486006920555-c77dce18193b", basePrice: 45 },
            { name: "Ceramic Coating Paint Shield", category: "Detailing", thumbnail: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7", basePrice: 250 },
            { name: "Advanced Brake Pad Replacement", category: "Repairs", thumbnail: "https://images.unsplash.com/photo-1486006920555-c77dce18193b", basePrice: 120 },
            { name: "4-Wheel Computerized Alignment", category: "Maintenance", thumbnail: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e", basePrice: 89 },
            { name: "Interior Deep Steam Clean", category: "Detailing", thumbnail: "https://images.unsplash.com/photo-1563720223185-11003d516935", basePrice: 75 },
            { name: "Engine OBD-II Diagnostic Scan", category: "Repairs", thumbnail: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc", basePrice: 50 },
        ],
    },
];

const ownerId = "user_3E5W2yM0VRFJDehasNi1tVti2a2";
const TOTAL_BUSINESSES = 24; // Scale this up as much as you need!

async function main() {
    console.log("🧹 Flushing existing collection pipelines...");
    await prisma.service.deleteMany({});
    await prisma.business.deleteMany({});

    console.log(`🌱 Seeding ${TOTAL_BUSINESSES} cross-industry businesses...`);
    const createdBusinesses = [];

    for (let i = 0; i < TOTAL_BUSINESSES; i++) {
        // Uniformly distribute industries down the creation line
        const blueprint = industryBlueprints[i % industryBlueprints.length]!;

        const biz = await prisma.business.create({
            data: {
                ownerId,
                location: randLocale(),
                // Inject the industry into the name context so your app screens look phenomenal
                name: `${randCompanyName()} (${blueprint.type})`,
                description: randText(),
                phone: randPhoneNumber(),
                timeZone: randTimeZone(),
                hours: {
                    create: generateRandomHours(),
                },
            },
        });

        // Retain the blueprint reference index to target correct services downstream
        createdBusinesses.push({ id: biz.id, industryIndex: i % industryBlueprints.length });
    }

    console.log(`✅ Successfully established ${createdBusinesses.length} operational business fronts.`);
    console.log("🌱 Injecting high-density category services for each node...");

    const allServicesToCreate: Prisma.ServiceCreateManyInput[] = [];

    for (const item of createdBusinesses) {
        const blueprint = industryBlueprints[item.industryIndex]!;

        // Loop through the entire pool of services for this industry type
        // This ensures every category within the blueprint gets hit cleanly
        blueprint.pool.forEach((service) => {
            allServicesToCreate.push({
                name: service.name,
                category: service.category,
                thumbnail: service.thumbnail,
                businessId: item.id,
                durationInMinutes: randNumber({ min: 30, max: 120, precision: 15 }),
                price: service.basePrice + randNumber({ min: -5, max: 20 }), // Varied prices per storefront
            });
        });
    }

    // High performance bulk insertion
    await prisma.service.createMany({
        data: allServicesToCreate,
        skipDuplicates: true,
    });

    console.log(`\n🎉 Seed Execution Finished!`);
    console.log(`⚡ Inserted Businesses: ${createdBusinesses.length}`);
    console.log(`⚡ Total Services Distributed: ${allServicesToCreate.length}`);
}

main()
    .catch((e) => {
        console.error("🔴 Seeding failed with error:", e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
