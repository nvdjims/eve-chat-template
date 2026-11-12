import { randomUUID } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { journalEntry } from "@/lib/db/schema";
import { decryptText, encryptText } from "@/lib/journal/crypto";

export type JournalContent = {
  readonly situation: string;
  readonly ressenti?: string;
  readonly reaction?: string;
  readonly besoin?: string;
  readonly tags?: readonly string[];
};

export type JournalRecord = JournalContent & {
  readonly id: string;
  readonly date: string;
};

export async function addJournalEntry(ownerId: string, content: JournalContent) {
  const id = randomUUID();
  const createdAt = new Date();

  await db.insert(journalEntry).values({
    id,
    ownerId,
    payload: encryptText(JSON.stringify(content)),
    createdAt,
  });

  return { id, date: createdAt.toISOString() };
}

export async function listJournalEntries(ownerId: string, limit: number) {
  const rows = await db
    .select()
    .from(journalEntry)
    .where(eq(journalEntry.ownerId, ownerId))
    .orderBy(desc(journalEntry.createdAt))
    .limit(limit);

  return rows.map((row): JournalRecord => {
    const content = JSON.parse(decryptText(row.payload)) as JournalContent;

    return { ...content, id: row.id, date: row.createdAt.toISOString() };
  });
}

export async function deleteJournalEntry(ownerId: string, id: string) {
  const deleted = await db
    .delete(journalEntry)
    .where(and(eq(journalEntry.ownerId, ownerId), eq(journalEntry.id, id)))
    .returning({ id: journalEntry.id });

  return deleted.length > 0;
}

export async function deleteAllJournalEntries(ownerId: string) {
  const deleted = await db
    .delete(journalEntry)
    .where(eq(journalEntry.ownerId, ownerId))
    .returning({ id: journalEntry.id });

  return deleted.length;
}
