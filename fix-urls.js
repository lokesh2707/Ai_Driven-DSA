const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'frontend', 'src', 'pages');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Example of replacing string concatenation for the base URL:
    // 'http://localhost:5000/api/...' -> `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/...`
    content = content.replace(/'http:\/\/localhost:5000(.*?)'/g, '`${import.meta.env.VITE_API_URL || "http://localhost:5000"}$1`');
    content = content.replace(/`http:\/\/localhost:5000(.*?)`/g, '`${import.meta.env.VITE_API_URL || "http://localhost:5000"}$1`');

    fs.writeFileSync(filePath, content);
});

console.log('Successfully updated frontend API endpoints to use environment variables!');
