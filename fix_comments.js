const fs = require('fs');
let content = fs.readFileSync('./smile-sprout/src/pages/LandingPage.tsx', 'utf8');
content = content.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
fs.writeFileSync('./smile-sprout/src/pages/LandingPage.tsx', content);
