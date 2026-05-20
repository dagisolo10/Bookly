import app from "@/lib/app";
import env from "@/utils/env";
import prisma from "@/lib/prisma";
import { createServer } from "http";

const server = createServer(app);

async function start() {
    try {
        await prisma.$connect();
        console.log("✅ Database connected");

        server.listen(env.PORT, () => console.log("🚀 Backend running on port", env.PORT));
    } catch (err) {
        console.error("❌ Database failed", err);
        process.exit(1);
    }
}

start();
