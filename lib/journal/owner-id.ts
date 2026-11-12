// Resolves the journal owner from the eve session so each caller only ever
// reads and writes their own entries.
type SessionAuth = {
  readonly session: {
    readonly auth: {
      readonly current?: { readonly principalId: string } | null;
    };
  };
};

export function requireJournalOwner(ctx: SessionAuth) {
  const principalId = ctx.session.auth.current?.principalId;

  if (!principalId) {
    throw new Error("Journal indisponible : aucune session authentifiée.");
  }

  return principalId;
}
