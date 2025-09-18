#!/usr/bin/env node
// helper to update devvit.json with deployed origin
const fs = require('fs');
const path = require('path');
if(process.argv.length < 3){ console.error('Usage: node set_origin.js https://your-domain'); process.exit(1); }
const origin = process.argv[2];
const file = path.join(__dirname, 'devvit.json');
const j = JSON.parse(fs.readFileSync(file, 'utf8'));
j.webview = j.webview || {};
j.webview.origin = origin;
fs.writeFileSync(file, JSON.stringify(j, null, 2));
console.log('Updated devvit.json webview.origin to', origin);
