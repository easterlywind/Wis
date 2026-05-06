const fs = require('fs');

const html = fs.readFileSync('/tmp/landing.html', 'utf8');

const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (!bodyMatch) {
  console.log("No body found");
  process.exit(1);
}

let content = bodyMatch[1];

// Remove the radial mesh overlay since we have the app-bg class
content = content.replace(/<!-- Radial Mesh Background Overlay -->[\s\S]*?<\/div>/i, '');

// Convert class to className
content = content.replace(/class="/g, 'className="');

// Fix self-closing tags
content = content.replace(/<img([^>]+)>/g, (match, p1) => {
  if (p1.endsWith('/')) return match;
  return `<img${p1} />`;
});

// Fix style="background: radial-gradient(...);" to style={{...}}
content = content.replace(/style="([^"]+)"/g, (match, p1) => {
  const cssObj = p1.split(';').filter(s => s.trim()).reduce((acc, rule) => {
    const [key, val] = rule.split(':').map(s => s.trim());
    if (key && val) {
      const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
      acc.push(`${camelKey}: '${val}'`);
    }
    return acc;
  }, []);
  return `style={{ ${cssObj.join(', ')} }}`;
});

// Replace <a href="#"> with Link
content = content.replace(/<a([^>]*)href="#"([^>]*)>(.*?)<\/a>/gi, '<Link$1to="/"$2>$3</Link>');

const reactComponent = `
import { Link } from "react-router-dom";
import mascot from "@/assets/mascot.png";

const LandingPage = () => {
  return (
    <div className="bg-background text-on-surface font-body min-h-screen overflow-x-hidden app-bg">
      <style>{\`
        .clay-card {
            box-shadow: 
                0 10px 20px -5px rgba(0, 0, 0, 0.1),
                inset 0 4px 6px -2px rgba(255, 255, 255, 0.8),
                inset 0 -4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .clay-button-primary {
            box-shadow: 0 8px 0 0 #493598;
        }
        .clay-button-primary:active {
            box-shadow: 0 0px 0 0 #493598;
            transform: translateY(8px);
        }
        .clay-button-secondary {
            box-shadow: 0 8px 0 0 #c9c4d4;
        }
        .clay-button-secondary:active {
            box-shadow: 0 0px 0 0 #c9c4d4;
            transform: translateY(8px);
        }
        .font-display-lg { font-family: 'Fredoka', sans-serif; font-size: 3rem; line-height: 1.1; letter-spacing: -0.025em; font-weight: 800; }
        .text-display-lg { font-size: 3rem; line-height: 1.1; letter-spacing: -0.025em; font-weight: 800; }
        .font-headline-lg { font-family: 'Fredoka', sans-serif; font-size: 2.25rem; line-height: 1.2; letter-spacing: -0.025em; font-weight: 800; }
        .text-headline-lg { font-size: 2.25rem; line-height: 1.2; letter-spacing: -0.025em; font-weight: 800; }
        .font-headline-md { font-family: 'Fredoka', sans-serif; font-size: 1.875rem; line-height: 1.2; font-weight: 700; }
        .text-headline-md { font-size: 1.875rem; line-height: 1.2; font-weight: 700; }
        .font-body-lg { font-family: 'Nunito', sans-serif; font-size: 1.125rem; line-height: 1.5; font-weight: 700; }
        .text-body-lg { font-size: 1.125rem; line-height: 1.5; font-weight: 700; }
        .font-body-md { font-family: 'Nunito', sans-serif; font-size: 1rem; line-height: 1.5; font-weight: 600; }
        .text-body-md { font-size: 1rem; line-height: 1.5; font-weight: 600; }
      \`}</style>
      ${content}
    </div>
  );
};

export default LandingPage;
`;

fs.writeFileSync('./smile-sprout/src/pages/LandingPage.tsx', reactComponent);
console.log("Converted and saved LandingPage.tsx");
