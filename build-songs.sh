#!/bin/bash
cd sssongs
npm install
npm run build:deploy
cd ..
mkdir -p songs
cp -r sssongs/dist/* songs/
cp -r sssongs/public/* public/
