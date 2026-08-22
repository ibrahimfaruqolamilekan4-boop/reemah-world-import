const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace("    app.get('*', (req, res) => {      res.sendFile(path.join(distPath, 'index.html'));});\n    app.get('*', (req, res) => {\n      res.sendFile(path.join(distPath, 'index.html'));\n    });", 
`    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });`);

fs.writeFileSync('server.ts', code);
