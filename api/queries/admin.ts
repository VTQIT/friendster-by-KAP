import { eq } from "drizzle-orm";
import { getDb } from "./connection";
import { adminSettings } from "@db/schema";

export async function getAdminSettings() {
  const rows = await getDb().select().from(adminSettings).limit(1);
  return rows.at(0);
}

export async function updateAdminPin(newPinHash: string) {
  const settings = await getAdminSettings();
  if (!settings) return null;

  await getDb()
    .update(adminSettings)
    .set({ adminPinHash: newPinHash })
    .where(eq(adminSettings.id, settings.id));

  return true;
}
