import express from "express";
import { authMiddleware } from "@/middleware/authMiddleware.ts";
import { 
  createReport, 
  downloadReport, 
  listReports, 
  deleteReport,
  getStorageStats,
  cleanupReports 
} from "@/modules/report/report.controller.ts";


const router = express.Router();
router.use(authMiddleware);

router.post("/generate", createReport);
router.get("/", listReports);
router.get("/stats", getStorageStats);
router.post("/cleanup", cleanupReports);
router.get("/:id/download", downloadReport);
router.delete("/:id", deleteReport);

export default router;
