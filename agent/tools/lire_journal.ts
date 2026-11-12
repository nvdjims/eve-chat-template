import { defineTool } from "eve/tools";
import { z } from "zod";
import { listJournalEntries } from "@/lib/journal/store";
import { requireJournalOwner } from "@/lib/journal/owner-id";

export default defineTool({
  description:
    "Lit les entrées les plus récentes du journal privé de l'utilisateur, pour repérer des schémas récurrents ou s'appuyer sur des faits.",
  inputSchema: z.object({
    limite: z.number().int().min(1).max(100).default(30).describe("Nombre d'entrées à lire."),
    tag: z.string().optional().describe("Ne garder que les entrées avec ce mot-clé."),
  }),
  async execute({ limite, tag }, ctx) {
    const entries = await listJournalEntries(requireJournalOwner(ctx), limite);
    const needle = tag?.trim().toLowerCase();
    const filtered = needle
      ? entries.filter((entry) => entry.tags?.some((t) => t.toLowerCase() === needle))
      : entries;

    return { nombre: filtered.length, entrees: filtered };
  },
});
