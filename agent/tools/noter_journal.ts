import { defineTool } from "eve/tools";
import { z } from "zod";
import { addJournalEntry } from "@/lib/journal/store";
import { requireJournalOwner } from "@/lib/journal/owner-id";

export default defineTool({
  description:
    "Enregistre une situation dans le journal privé et chiffré de l'utilisateur. À utiliser quand il raconte un épisode marquant de sa relation et accepte de le noter.",
  inputSchema: z.object({
    situation: z.string().min(1).describe("Ce qui s'est passé, factuellement, en quelques phrases."),
    ressenti: z.string().optional().describe("Ce que l'utilisateur a ressenti."),
    reaction: z.string().optional().describe("Ce que l'utilisateur a dit ou fait."),
    besoin: z.string().optional().describe("Ce dont il avait besoin et n'a pas eu."),
    tags: z
      .array(z.string().min(1))
      .max(8)
      .optional()
      .describe("Mots-clés courts, ex. dispute, limite franchie, effort, reproche."),
  }),
  async execute(input, ctx) {
    const saved = await addJournalEntry(requireJournalOwner(ctx), input);

    return { enregistre: true, ...saved };
  },
});
