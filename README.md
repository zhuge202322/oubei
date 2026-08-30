This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Oubei admin and VPS deployment

The site includes a single-administrator SQLite CMS. Runtime state is kept outside the repository: `${OUBEI_DATA_DIR}/site.db` and `${OUBEI_DATA_DIR}/media/` (default `.oubei-data` in development). Copy `.env.example` to `.env` and set a random `SESSION_SECRET` (32+ characters) and initial password before the first production start.

Build and run with `npm ci && npm run build && npm run start`. Put a reverse proxy (Nginx/Caddy) in front of the Node process and persist the data directory on the VPS. Uploaded files are served by `/media/<storage-name>`.

Back up both database and media together: `OUBEI_DATA_DIR=/var/lib/oubei ./scripts/backup-oubei.sh /var/backups/oubei`. On Windows run `./scripts/backup-oubei.ps1 -DataDir C:\ProgramData\oubei`. To restore, stop the service, replace `site.db` and `media/` from one timestamped backup, then start the service again. Never commit `.env`, `.oubei-data`, SQLite files, or `.next` output.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
