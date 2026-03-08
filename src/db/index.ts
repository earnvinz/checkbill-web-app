import { BusinessDataSource } from "./data-source";

let initialized = false;

export async function initializeDatabase() {
  if (!initialized) {
    try {
      await BusinessDataSource.initialize();
      initialized = true;
      console.log("✅ Business database connected successfully");
    } catch (error) {
      console.error("❌ Business database connection failed:", error);
      throw error;
    }
  }
  return BusinessDataSource;
}

export { BusinessDataSource };
