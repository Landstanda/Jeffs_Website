# WordPress on Fly.io (separate from Next.js app)

This folder defines two Fly apps using Machines:
- `jeff-edgewise-wp-db`: MariaDB/MySQL with a persistent volume
- `jeff-edgewise-wp`: WordPress (Apache + PHP) with a persistent volume for uploads

Volumes (initial recommendation):
- DB volume size: 2 GB (sufficient for text-heavy blogs; grow later)
- WP uploads volume size: 1 GB (media will live in Cloudinary after sync)

Provisioning: run `scripts/provision-wordpress.ps1` from the repo root.

After deploy:
- Visit the WP app URL to complete the initial setup wizard (site title/admin user)
- Install and activate plugins: WPGraphQL, Cloudinary, Substack Importer (or use WP-CLI)
- Set permalinks to “Post name”
- Configure Cloudinary plugin and run bulk sync
- Import Substack ZIP via Tools → Import → Substack Importer
