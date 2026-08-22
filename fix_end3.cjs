const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');
code = code.replace("    app.use(express.static(distPath));          \n  }", "    app.use(express.static(distPath));\n    app.get('*', (req, res) => {\n      res.sendFile(path.join(distPath, 'index.html'));\n    });\n  }");
fs.writeFileSync('server.ts', code);
