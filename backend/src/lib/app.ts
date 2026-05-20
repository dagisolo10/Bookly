import cors from "cors";
import env from "@/utils/env";
import express from "express";
import userRoutes from "@/routes/user";
import { clerkMiddleware } from "@clerk/express";
import errorMiddleWare from "@/middlewares/error";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: env.FRONTEND_URL || "http://localhost:3001", credentials: true }));

app.use(clerkMiddleware());

app.get("/api/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.use("/api/user", userRoutes);

app.use(errorMiddleWare);

export default app;
