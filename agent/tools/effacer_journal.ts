import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";
import { deleteAllJournalEntries, deleteJournalEntry } from "@/lib/journal/store";
import { requireJournalOwner } from "@/lib/journal/owner-id";

export default defineTool({
  description:
    "Supprime définitivement une entrée du journal (par son id) ou tout le journal. Uniquement sur demande explicite de l'utilisateur.",
  inputSchema: z.object({
    id: z.string().optional().describe("Id de l'entrée à supprimer. Omettre avec tout=true."),
    tout: z.boolean().default(false).describe("true pour effacer tout le journal."),
  }),
  needsApproval: always(),
  async execute({ id, tout }, ctx) {
    const ownerId = requireJournalOwner(ctx);

    if (tout) {
      return { supprimees: await deleteAllJournalEntries(ownerId) };
    }

    if (!id) {
      return { erreur: "Indique un id ou tout=true." };
    }

    return { supprimees: (await deleteJournalEntry(ownerId, id)) ? 1 : 0 };
  },
});
