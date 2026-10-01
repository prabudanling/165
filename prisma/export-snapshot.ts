// CLI wrapper — see src/lib/snapshot-export.ts
import { exportSnapshot } from '../src/lib/snapshot-export'
import { db } from '../src/lib/db'

exportSnapshot()
  .then((res) => console.log('[snapshot] exported:', JSON.stringify(res.counts)))
  .catch((err) => { console.error('[snapshot] export failed:', err); process.exitCode = 1 })
  .finally(() => db.$disconnect().finally(() => process.exit(process.exitCode ?? 0)))
