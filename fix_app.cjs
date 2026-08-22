const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  'const [userName, setUserName] = useState("");',
  'const [userName, setUserName] = useState("");\n  const [userEmail, setUserEmail] = useState("");'
);

code = code.replace(
  'const handleLogin = (name, email) => {',
  'const handleLogin = (name, email) => {\n    setUserEmail(email.trim().toLowerCase());'
);

code = code.replace(
  'adminId: "admin-1"',
  'adminId: ADMIN_PROFILES.find(a => a.email === userEmail)?.id || ADMIN_PROFILES[0].id'
);

fs.writeFileSync('src/App.tsx', code);
