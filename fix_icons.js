const fs = require('fs');

let content = fs.readFileSync('./smile-sprout/src/pages/Auth.tsx', 'utf8');

// Add Lucide imports
const lucideImport = `import { Smile, Star, Badge, User, Calendar, Lock, Rocket, Puzzle, Brain, Users } from "lucide-react";\n`;
if (!content.includes('lucide-react')) {
    content = content.replace('import { useState } from "react";', `import { useState } from "react";\n${lucideImport}`);
}

// Replace each material symbol with the corresponding Lucide component
content = content.replace(/<span className="material-symbols-outlined[^>]*>face<\/span>/g, '<Smile className="text-secondary w-16 h-16" strokeWidth={1.5} />');
content = content.replace(/<span className="material-symbols-outlined[^>]*>star<\/span>/g, '<Star className="text-on-tertiary-container w-6 h-6" fill="currentColor" />');
content = content.replace(/<span className="material-symbols-outlined[^>]*>badge<\/span>/g, '<User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-6 h-6" />');
content = content.replace(/<span className="material-symbols-outlined[^>]*>person<\/span>/g, '<User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-6 h-6" />');
content = content.replace(/<span className="material-symbols-outlined[^>]*>calendar_today<\/span>/g, '<Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-6 h-6" />');
content = content.replace(/<span className="material-symbols-outlined[^>]*>lock<\/span>/g, '<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-6 h-6" />');
content = content.replace(/<span className="material-symbols-outlined[^>]*>rocket_launch<\/span>/g, '<Rocket className="w-10 h-10" />');
content = content.replace(/<span className="material-symbols-outlined[^>]*>extension<\/span>/g, '<Puzzle className="text-on-tertiary-fixed w-8 h-8" />');
content = content.replace(/<span className="material-symbols-outlined[^>]*>psychiatry<\/span>/g, '<Brain className="text-on-tertiary-fixed w-8 h-8" />');
content = content.replace(/<span className="material-symbols-outlined[^>]*>group<\/span>/g, '<Users className="text-on-primary-fixed w-8 h-8" />');

fs.writeFileSync('./smile-sprout/src/pages/Auth.tsx', content);
console.log("Replaced material symbols with Lucide React icons in Auth.tsx");
