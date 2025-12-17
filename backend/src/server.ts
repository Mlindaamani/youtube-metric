import app from "@/app.ts";
import { config } from "@/config/index.ts";
import Database from "@/config/db.ts";
import { jobService } from "@/modules/job/job.service.ts";

async function startServer() {
  try {
    await Database.instance;

    // Initialize scheduled jobs
    await jobService.initializeJobs();

    // Start the Express server
    const server = app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("\nShutting down...");
      server.close();
      await Database.disconnect();
      process.exit(0);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
