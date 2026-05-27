import errorMiddleWare from "@/middlewares/error";
import customerBookingRoutes from "@/routes/customer-booking";
import customerBusinessRoutes from "@/routes/customer-business";
import customerServiceRoutes from "@/routes/customer-service";
import ownerBookingRoutes from "@/routes/owner-booking";
import ownerBusinessRoutes from "@/routes/owner-business";
import ownerServiceRoutes from "@/routes/owner-service";
import userRoutes from "@/routes/user";
import env from "@/utils/env";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: env.FRONTEND_URL || "http://localhost:3001", credentials: true }));

app.use(clerkMiddleware({ clockSkewInMs: 60000 }));

app.get("/api/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.use("/api/user", userRoutes);

app.use("/api/owner/service", ownerServiceRoutes);
app.use("/api/owner/bookings", ownerBookingRoutes);
app.use("/api/owner/business", ownerBusinessRoutes);

app.use("/api/customer/service", customerServiceRoutes);
app.use("/api/customer/bookings", customerBookingRoutes);
app.use("/api/customer/business", customerBusinessRoutes);

app.use(errorMiddleWare);

export default app;
