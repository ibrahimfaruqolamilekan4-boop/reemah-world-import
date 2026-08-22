const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
code = code.replace(/const \[reviewsMap, setReviewsMap\] = useState<.*?>\(\{(.|\n)*?\}\);/, 'const [reviewsMap, setReviewsMap] = useState<Record<string, Array<{ id: string; user: string; rating: number; text: string; date: string; verified: boolean }>>>({});');
fs.writeFileSync('src/App.tsx', code);
