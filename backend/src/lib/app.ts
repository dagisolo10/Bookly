import errorMiddleWare from "@/middlewares/error";
import ownerBusinessRoutes from "@/routes/owner-business.js";
import userRoutes from "@/routes/user";
import env from "@/utils/env";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: env.FRONTEND_URL || "http://localhost:3001", credentials: true }));

app.use(clerkMiddleware());

app.get("/api/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.use("/api/user", userRoutes);
app.use("/api/owner/business", ownerBusinessRoutes);

app.use(errorMiddleWare);

export default app;
