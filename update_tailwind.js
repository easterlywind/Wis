const fs = require('fs');

const tailwindConfigPath = './smile-sprout/tailwind.config.ts';
let content = fs.readFileSync(tailwindConfigPath, 'utf8');

const stitchColors = {
  "on-primary-fixed": "#1c0062",
  "inverse-primary": "#cabeff",
  "on-tertiary-fixed-variant": "#574400",
  "foreground": "#2c3152",
  "tertiary-fixed-dim": "#e9c34d",
  "on-error": "#ffffff",
  "tertiary-container": "#cba734",
  "on-primary-fixed-variant": "#493598",
  "on-error-container": "#93000a",
  "tertiary": "#745b00",
  "surface-bright": "#fdf8ff",
  "on-tertiary-container": "#4e3d00",
  "inverse-on-surface": "#f4eff8",
  "error-container": "#ffdad6",
  "surface-container": "#f1ecf5",
  "surface": "#fdf8ff",
  "primary-fixed-dim": "#cabeff",
  "on-primary-container": "#fffbff",
  "inverse-surface": "#312f36",
  "surface-tint": "#614fb1",
  "on-tertiary": "#ffffff",
  "surface-container-lowest": "#ffffff",
  "on-secondary": "#ffffff",
  "on-tertiary-fixed": "#241a00",
  "surface-container-low": "#f7f2fb",
  "on-primary": "#ffffff",
  "surface-variant": "#e6e1ea",
  "secondary-container": "#9cf4d3",
  "primary-fixed": "#e6deff",
  "secondary-fixed-dim": "#80d7b8",
  "on-background": "#1c1b21",
  "secondary-fixed": "#9cf4d3",
  "surface-container-highest": "#e6e1ea",
  "outline": "#797583",
  "on-secondary-fixed-variant": "#00513e",
  "outline-variant": "#c9c4d4",
  "on-secondary-container": "#087258",
  "on-surface-variant": "#484552",
  "surface-container-high": "#ebe6ef",
  "surface-dim": "#ddd8e1",
  "on-surface": "#1c1b21",
  "on-secondary-fixed": "#002117"
};

const spacing = {
  "card-gap": "24px",
  "bento-padding": "32px",
  "unit": "8px",
  "container-padding": "24px"
};

const colorsStr = Object.entries(stitchColors).map(([k, v]) => `        "${k}": "${v}",`).join('\n');
const spacingStr = Object.entries(spacing).map(([k, v]) => `        "${k}": "${v}",`).join('\n');

content = content.replace('colors: {', `colors: {\n${colorsStr}`);
if (!content.includes('spacing: {')) {
    content = content.replace('extend: {', `extend: {\n      spacing: {\n${spacingStr}\n      },`);
}

fs.writeFileSync(tailwindConfigPath, content);
console.log('Updated tailwind.config.ts');
