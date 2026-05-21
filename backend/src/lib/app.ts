import cors from "cors";
import env from "@/utils/env";
import express from "express";
import userRoutes from "@/routes/user";
import { clerkMiddleware } from "@clerk/express";
import errorMiddleWare from "@/middlewares/error";
import ownerBookingRoutes from "@/routes/owner-booking";
import ownerServiceRoutes from "@/routes/owner-service";
import ownerBusinessRoutes from "@/routes/owner-business";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: env.FRONTEND_URL || "http://localhost:3001", credentials: true }));

app.use(clerkMiddleware());

app.get("/api/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.use("/api/user", userRoutes);
app.use("/api/owner/service", ownerServiceRoutes);
app.use("/api/owner/bookings", ownerBookingRoutes);
app.use("/api/owner/business", ownerBusinessRoutes);

app.use(errorMiddleWare);

export default app;
