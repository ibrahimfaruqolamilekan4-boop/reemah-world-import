const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

// strip everything from line 7 to line 15 that I injected
code = code.replace(/let _dirname;[\s\S]*?}\n/, 'const _dirname = process.cwd();\n');
fs.writeFileSync('server.ts', code);
