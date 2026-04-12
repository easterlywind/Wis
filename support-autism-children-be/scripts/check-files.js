const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  // adjust baseDir if your files live elsewhere (e.g. path.join(__dirname, '..', 'public'))
  const baseDir = process.cwd(); // project root
  const emotions = await prisma.emotion.findMany({ select: { id: true, name: true, iconUrl: true } });

  let allGood = true;
  for (const e of emotions) {
    if (!e.iconUrl) {
      console.log(`[WARN] emotion ${e.id} (${e.name}) has no iconUrl`);
      allGood = false;
      continue;
    }
    const resolved = path.resolve(baseDir, e.iconUrl);
    try {
      await fs.access(resolved); // throws if not accessible
      console.log(`[OK] ${e.id} ${e.name} -> exists at ${resolved}`);
    } catch (err) {
      console.log(`[MISSING] ${e.id} ${e.name} -> ${resolved} (not found or permission denied)`);
      allGood = false;
    }
  }

  if (allGood) {
    console.log('All files exist.');
  } else {
    console.log('Some files are missing — please check the messages above.');
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
