# Carnet : guide rapide

Carnet est un conseiller privé pour ta relation, relié à Claude. Une seule
personne peut s'en servir : toi.

## Ce qu'il fait

- **Conversation** avec un conseiller direct et sans sermon, qui prend ton parti.
- **Compétences** chargées automatiquement selon ce que tu demandes :
  - `preparer_conversation` : fiche prête à l'emploi pour une discussion difficile ;
  - `poser_limites` : formuler une limite et la tenir ;
  - `analyser_situation` : comprendre une dispute, repérer si tu te fais manipuler ;
  - `rester_ou_partir` : faire le bilan, donner une dernière chance cadrée ou préparer une rupture.
- **Journal chiffré** : « note ça dans le journal », « relis mon journal »,
  « efface l'entrée … » ou « efface tout le journal » (la suppression demande ta
  confirmation).

Ce qu'il ne fait pas : fournir des techniques pour manipuler, surveiller ou
contrôler ta partenaire. Il te propose à la place la stratégie honnête la plus
efficace pour obtenir ce que tu veux.

## Confidentialité

| Protection | Comment |
| --- | --- |
| Un seul compte | `OWNER_EMAIL` : tout autre compte est refusé à l'inscription, à la lecture des sessions et sur l'API de l'agent. |
| Journal chiffré | AES-256-GCM avant écriture en base ; la base ne contient que du texte illisible. |
| Nom neutre | L'onglet affiche « Carnet » / « Notes personnelles ». |
| Pas d'indexation | `robots.txt` bloque tout, balises `noindex`, pas d'aperçu de lien. |
| Pas d'analytics | Vercel Analytics et Speed Insights retirés. |

Ce qui reste à ta charge :

- Les **conversations** sont stockées en base (non chiffrées, mais accessibles
  à toi seul). Supprime-les depuis la barre latérale si besoin.
- Choisis une **URL neutre** sur Vercel (ex. `notes-xxxx.vercel.app`), ne
  l'enregistre pas en favori sur un appareil partagé et déconnecte-toi après usage.
- Protège ton **compte Vercel** (mot de passe fort + double authentification) :
  c'est lui qui donne accès à l'app.

## Mise en route

1. Suivre `docs/setup-and-deploy.md` (Neon, Upstash, Sign in with Vercel).
2. Ajouter dans les variables d'environnement Vercel :
   - `OWNER_EMAIL` = l'email de ton compte Vercel ;
   - `JOURNAL_ENCRYPTION_KEY` (optionnel) = une longue chaîne aléatoire
     (`openssl rand -base64 32`). Si tu la changes plus tard, les anciennes
     entrées deviennent illisibles.
3. Appliquer les migrations : `pnpm db:migrate:production` (crée la table
   `journal_entry`).
4. Déployer.

## Où modifier

- Comportement du conseiller : `agent/instructions.md`
- Compétences : `agent/skills/*.md`
- Outils du journal : `agent/tools/*_journal.ts`, logique dans `lib/journal/`
- Verrou propriétaire : `lib/owner.ts`
