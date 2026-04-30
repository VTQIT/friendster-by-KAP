import { eq } from "drizzle-orm";
import { getDb } from "../api/queries/connection";
import { adminSettings } from "./schema";
import { hashPin } from "../api/lib/local-auth";

async function seed() {
  const db = getDb();

  // Check if admin settings already exist
  const existing = await db.select().from(adminSettings).limit(1);

  if (existing.length === 0) {
    const pinHash = await hashPin("888967");
    await db.insert(adminSettings).values({
      adminPinHash: pinHash,
      connectionFadeDays: 30,
      maintenanceMode: "false",
    });
    console.log("Admin settings seeded with default PIN: 888967");
  } else {
    console.log("Admin settings already exist, skipping seed.");
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
