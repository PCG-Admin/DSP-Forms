import { kv } from '@vercel/kv';

const SUBMISSIONS_KEY = 'submissions:ids';

async function migrate() {
  console.log('Starting migration: adding brand field to submissions...');

  // Get all submission IDs
  const ids = await kv.zrange(SUBMISSIONS_KEY, 0, -1);
  const idsArray = (ids as string[]).filter(id => typeof id === 'string');

  if (idsArray.length === 0) {
    console.log('No submissions found.');
    return;
  }

  console.log(`Found ${idsArray.length} submissions.`);

  let updatedCount = 0;

  for (const id of idsArray) {
    const submission = await kv.get(`submission:${id}`);
    if (submission && !(submission as any).brand) {
      (submission as any).brand = 'ringomode';
      await kv.set(`submission:${id}`, submission);
      updatedCount++;
      console.log(`Updated submission ${id}`);
    }
  }

  console.log(`Migration complete. Updated ${updatedCount} submissions.`);
}

migrate().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});