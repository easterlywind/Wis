const fs = require('fs');

const html = fs.readFileSync('/tmp/landing.html', 'utf8');
const match = html.match(/"colors":\s*({[\s\S]*?}),/);
if (!match) {
  console.log("No colors found");
  process.exit(1);
}

const stitchColors = JSON.parse(match[1]);

let tailwind = fs.readFileSync('./smile-sprout/tailwind.config.ts', 'utf8');

// We will construct the new colors object
let newColors = Object.entries(stitchColors).map(([k, v]) => `        "${k}": "${v}",`).join('\n');

// For Shadcn compatibility, we also add the required object forms if they are overwritten
newColors += `
        primary: {
          DEFAULT: "${stitchColors.primary || '#5e4caf'}",
          foreground: "${stitchColors['on-primary'] || '#ffffff'}",
        },
        secondary: {
          DEFAULT: "${stitchColors.secondary || '#006c53'}",
          foreground: "${stitchColors['on-secondary'] || '#ffffff'}",
        },
        destructive: {
          DEFAULT: "${stitchColors.error || '#ba1a1a'}",
          foreground: "${stitchColors['on-error'] || '#ffffff'}",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "${stitchColors.accent || '#8fcbe9'}",
          foreground: "hsl(var(--accent-foreground))",
        },
        success: {
          DEFAULT: "${stitchColors.success || '#5eb98f'}",
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "${stitchColors.surface || '#fdf8ff'}",
          foreground: "${stitchColors['on-surface'] || '#1c1b21'}",
        },
        card: {
          DEFAULT: "${stitchColors.card || '#ffffff'}",
          foreground: "${stitchColors['on-surface'] || '#1c1b21'}",
        },
        emotion: {
          happy: "${stitchColors['emotion-happy'] || '#f2df79'}",
          sad: "${stitchColors['emotion-sad'] || '#90a7da'}",
          angry: "${stitchColors['emotion-angry'] || '#e57f7f'}",
          surprised: "${stitchColors['emotion-surprised'] || '#ce9edc'}",
          scared: "${stitchColors['emotion-scared'] || '#b48fd3'}",
          excited: "${stitchColors['emotion-excited'] || '#ebbb7a'}",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "${stitchColors.primary || '#5e4caf'}",
          "primary-foreground": "${stitchColors['on-primary'] || '#ffffff'}",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "${stitchColors.primary || '#5e4caf'}",
        },
`;

// Replace everything inside `colors: { ... }` in tailwind.config.ts
const newTailwind = tailwind.replace(/colors:\s*\{[\s\S]*?\},\n\s*borderRadius:/, `colors: {\n${newColors}\n      },\n      borderRadius:`);

fs.writeFileSync('./smile-sprout/tailwind.config.ts', newTailwind);
console.log("Updated tailwind.config.ts with all colors");
