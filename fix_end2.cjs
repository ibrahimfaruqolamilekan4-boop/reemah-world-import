const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');
code = code.replace(/app\.get\('\*', \(req, res\) => \{\s+res\.sendFile\(path\.join\(distPath, 'index\.html'\)\);\s*\}\);/g, "");
fs.writeFileSync('server.ts', code);
