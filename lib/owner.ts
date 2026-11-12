// Single-owner lock: only the email in OWNER_EMAIL can sign in or use the app.
// Every other account is rejected at sign-up, at session lookup, and at the
// eve channel, so nobody else can see the chats or the journal.

function normalize(email: string | null | undefined) {
  return email?.trim().toLowerCase() ?? "";
}

export function getOwnerEmail() {
  return normalize(process.env.OWNER_EMAIL);
}

export function isOwnerEmail(email: string | null | undefined) {
  const owner = getOwnerEmail();

  return Boolean(owner) && normalize(email) === owner;
}
