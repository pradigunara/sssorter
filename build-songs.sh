#!/bin/bash

# Write .env from Cloudflare Pages environment variables
echo "Writing .env for Vite..."
cat >.env <<ENVEOF
VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}
ENVEOF

# Build main bias sorter
echo "Building main bias sorter..."
npm install
npm run build

# Build song sorter sub-app
echo "Building song sorter..."
cd sssongs
npm install
npm run build:deploy
cd ..

# Copy song sorter files into dist (Cloudflare serves from dist/)
# Song sorter's built app goes under /songs/
mkdir -p dist/songs
cp -r sssongs/dist/* dist/songs/
# Song sorter's public files (favicon, robots.txt, etc.) go to root
cp -r sssongs/public/* dist/

echo "Build complete!"
