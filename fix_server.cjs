const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');
code = code.replace("    app.get('*', (req, res) => {\n      res.sendFile(path.join(distPath, 'index.html'));});app.listen(PORT, '0.0.0.0', () => {", 
`    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {`);
fs.writeFileSync('server.ts', code);
