const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// replace PRODUCTS
code = code.replace(/const PRODUCTS = \[(.|\n)*?\];/, 'const PRODUCTS: any[] = [];');

// replace seedPosts
code = code.replace(/const seedPosts = \(\) => \[(.|\n)*?\];/g, 'const seedPosts = () => [];');

fs.writeFileSync('src/App.tsx', code);
