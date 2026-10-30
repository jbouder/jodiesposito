# jodiesposito.com

Static portfolio site for Jodi Esposito, served by Cloudflare Workers static assets. There is no build step.

## Local preview

```sh
npx wrangler dev
```

Opens at http://localhost:8787.

## Deploy

The repo is connected to Cloudflare Workers Builds (Workers & Pages → jodiesposito → Settings → Build).

- **Production:** merging to `main` deploys to [jodiesposito.com](https://jodiesposito.com) and www.jodiesposito.com, and to https://jodiesposito.vibeproject.workers.dev.
- **Previews:** every push to another branch builds a preview with `npx wrangler preview`. The result shows as a "Workers Builds" check on the PR; open its details to find the preview URL in the Cloudflare dashboard. This needs the `previews` block in `wrangler.jsonc`, so don't remove it.

To deploy by hand:

```sh
npx wrangler deploy                                  # production
npx wrangler versions upload --preview-alias <name>  # preview at <name>-jodiesposito.vibeproject.workers.dev
```

## Domain

jodiesposito.com uses Cloudflare nameservers, and the Worker's `routes` in `wrangler.jsonc` attach it as a custom domain for both the bare domain and `www`.
