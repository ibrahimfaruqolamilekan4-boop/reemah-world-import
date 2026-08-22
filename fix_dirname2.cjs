const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const replacement = `const path = require('path');`; // We can't do this easily because it's ESM in dev.

// Actually, in ESM dev, __dirname is not defined.
// In CJS build, __dirname IS defined.
const betterReplacement = `
let _dirname;
try {
  _dirname = __dirname;
} catch (e) {
  _dirname = path.dirname(fileURLToPath(import.meta.url || 'file://' + process.cwd() + '/server.ts'));
}
`;

code = code.replace("const _dirname = typeof _dirname !== 'undefined' ? _dirname : path.dirname(fileURLToPath(import.meta.url));", betterReplacement);

fs.writeFileSync('server.ts', code);
