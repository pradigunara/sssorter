#!/bin/bash

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

# Copy song sorter files
mkdir -p songs
cp -r sssongs/dist/* songs/
cp -r sssongs/public/* public/

echo "Build complete!"
