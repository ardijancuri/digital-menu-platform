# Image egress rollout

The image pipeline uses 30-day browser caching and unique object paths. JPEG,
PNG and static WebP/GIF uploads are decoded, auto-oriented and fitted inside
800px (products), 1200px (banners), or 256px (logos). Smaller originals within
the size bounds are retained; animations remain unchanged. Uploads are limited
to 2 MiB. Node 20.9+ is required by the pinned Sharp dependency (Node 22 recommended).

## Validation

From `backend`, run `npm ci` and `npm test`. Migration tests run actual PostgreSQL
SQL in an isolated in-memory PGlite database; they never contact production.
From `frontend`, run `npm ci` and `npm run build`.

For browser checks without a database, run `node scripts/preview-images.js` from
`backend`, then start Vite from `frontend` with `VITE_API_URL=http://127.0.0.1:5190`
and `npm run dev -- --host 127.0.0.1 --port 5191`. Open
`http://127.0.0.1:5191/menu`. `http://127.0.0.1:5190/__stats` counts real image
requests, so browser caching, deferred slides, offscreen cards and closed
categories can be checked without DevTools disabling the cache.

## Production prerequisites

Production uses the `main` branch of `ardijancuri/digital-menu-platform`.
The Vercel backend project is `digital-menu-platform`; the frontend project is
`digital-menu-platform-k2s4`, serving `https://www.onipos.com/`.
The separate `ardijancuri/divina-pos-menu` repository does not deploy this site.

Configure `backend/.env` locally (never commit or paste credentials into chat):

```dotenv
SUPABASE_URL=https://pehgukoqdkbbdjelmqky.supabase.co
SUPABASE_BUCKET=menu-assets
SUPABASE_SERVICE_ROLE_KEY=<existing backend key>
DATABASE_URL=<existing production database connection with appropriate SSL settings>
```

The tool also supports `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
instead of `DATABASE_URL`. Use normal pg TLS configuration for remote databases;
the migration does not disable certificate verification. No schema changes,
new public permissions, cache flushing or object deletion are required.

## Inventory and migration

Run all commands from `backend`. Dry run reads references and storage metadata
and writes an ignored local manifest; it does not download or mutate assets.

```powershell
npm run images:migrate -- --dry-run --manifest image-migrations/production.json
```

Optional: export the Supabase Logs Explorer **Storage Egress Requests** results
as a JSON array with `filepath`, `cached`, `num_requests`, and pass the file with
`--request-counts counts.json` when creating the inventory. The script ranks
cached request count × original object size; without counts it ranks by size.
Record the log window separately; this is an estimate, not billing reconciliation.

Inspect `assets`, `references`, `unreferenced`, and `skipped` in the manifest.
Only canonical public URLs from the configured project/bucket are migrated.
External URLs remain unchanged. Missing referenced files stop apply.
Unreferenced files are reported but never deleted. An existing manifest cannot
be overwritten by a new inventory. Keep it private and backed up for rollback.

Deploy the application changes first and verify both Vercel deployments succeed.
Then use one owner ID printed by the inventory for the pilot:

```powershell
npm run images:migrate -- --apply --manifest image-migrations/production.json --owner-id 1
```

The script uploads new objects, verifies their GET response hash, content type
and 30-day cache header, then conditionally replaces complete database fields.
Animated assets are reported in the manifest. Old objects remain available.
Check the pilot menu on mobile, banners, product modal and dashboard previews,
then migrate the remainder using the same manifest:

```powershell
npm run images:migrate -- --apply --manifest image-migrations/production.json
```

Rerun the same apply command after recoverable failures. Paths are persisted
before uploads and updates are idempotent. A concurrent database edit yields
`conflict` and exit code 2 rather than overwriting the user's change. Review
conflicts; create a new inventory for those current references. Do not manually
edit the recorded before/after values.

Only one process may use a manifest at a time. If a process is killed, confirm
it has stopped before removing its `.lock` file and rerunning. Never delete the
manifest to resolve a lock. A manifest that has been rolled back is not reusable
for apply; create a fresh inventory instead.

## Rollback

```powershell
npm run images:migrate -- --rollback --manifest image-migrations/production.json --owner-id 1
```

Omit `--owner-id` to roll back all migrated references. Rollback changes only
fields that still match the recorded migrated values, preserving subsequent
user edits. Retain original objects and the manifest for the entire rollout;
confirm originals are still available before rollback. New objects are retained
too. Redeploy the previous application commit separately if necessary.

## Monitoring

### Production rollout completed 23 September 2026 (Europe/Skopje)

PR #1 deployed commit `f5af07f2df2c15a09ef4cfd496cc20ce7047004d` to both
Vercel production projects. The Papilon pilot migrated successfully before the
remaining references. All 97 assets passed GET hash, MIME and 30-day cache
verification. Their total size fell from 26,419,520 to 2,805,067 bytes (89.4%).
There were no animated assets in this inventory. All original objects and the
35 initially unreferenced objects were retained.

Read-back verification matched all 141 database fields: 93 changed and 48 stayed
unchanged, with zero conflicts. All six public menu APIs returned HTTP 200.
Backend tests passed (13), the frontend production build passed, and browser
checks covered mobile layout, product modal, banner loading, collapsed categories,
offscreen loading and repeat-visit caching. Full-project lint still reports
pre-existing issues; the new carousel passes its targeted lint check.

The resumable private manifest is
`backend/image-migrations/production-prioritized.json`; the final read-back report
is `backend/image-migrations/rollout-verification.json`. Both are ignored by Git.
Use this manifest filename for any resume or rollback command above.

File-size savings do not establish billed egress savings. The first complete
24-hour observation is due on 24 September 2026; continue daily through
30 September. No recurring monitoring job is installed.

Baseline (23 Aug–23 Sep 2026): organization cached egress 5.796 GB; Menu POS
5.51 GB; allowance 5 GB. Grace period displayed: 22 Oct 2026.

Check usage 24 hours after production migration and daily for seven days. Record
organization/project cached and uncached egress, completed days in the billing
cycle, and the last day's change. Usage can lag by an hour. Track both quotas;
a reduction caused only by moving traffic to uncached egress is not a success.

Compare equivalent menu visits (cold browser, repeat visit, long browse) before
and after deployment. Target 50% lower Menu POS cached egress at comparable
traffic and a projected organization total below 4 GB per billing cycle.
Use elapsed completed days and the actual cycle length for the projection;
do not extrapolate from a partial first day. Longer caching helps repeat visits;
new visitors still download assets. Revisit request rankings if the projection
exceeds 4 GB. Historical usage cannot be reduced or reset by this migration.

No recurring monitoring job is installed by these scripts.
