const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

// Replace __dirname block with something robust for esbuild bundling
const replacement = `const _dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));`;

code = code.replace("const __dirname = path.dirname(fileURLToPath(import.meta.url));", replacement);
code = code.replace(/__dirname/g, '_dirname');

fs.writeFileSync('server.ts', code);
