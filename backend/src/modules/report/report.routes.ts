import express from "express";
import { authMiddleware } from "@/middleware/authMiddleware.ts";
import { createReport, downloadReport, listReports } from "@/modules/report/report.controller.ts";


const router = express.Router();
// router.use(authMiddleware);

router.post("/generate", createReport);
router.get("/", listReports);
router.get("/:id/download", downloadReport);

export default router;
