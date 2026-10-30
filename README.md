# jodiesposito.com

Static portfolio site for Jodi Esposito, served by Cloudflare Workers static assets.

## Local preview

```sh
npx wrangler dev
```

## Deploy

```sh
npx wrangler deploy
```

Pushes to `main` also deploy automatically once the repo is connected in Cloudflare (Workers & Pages → jodiesposito → Settings → Builds).
