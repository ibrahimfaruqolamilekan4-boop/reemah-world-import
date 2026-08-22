const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');
code = code.replace(/app\.use\(express\.static\(distPath\)\);[\s]*\}/, 
`app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }`);
fs.writeFileSync('server.ts', code);
