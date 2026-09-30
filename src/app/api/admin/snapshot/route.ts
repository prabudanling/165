import { NextRequest, NextResponse } from 'next/server'
import { isAuthed } from '@/lib/admin-auth'
import { exportSnapshot } from '@/lib/snapshot-export'
import { db } from '@/lib/db'

// ---------- POST: rebuild the bundled heritage snapshot ----------
// Works when the filesystem is writable (local dev / server with disk).
// On Vercel serverless the FS is read-only: respond with an honest,
// actionable Indonesian message — never a fake success.
export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Tidak diizinkan.' }, { status: 401 })
  try {
    let dbAvailable = true
    try { await db.entity.count() } catch { dbAvailable = false }

    if (!dbAvailable) {
      return NextResponse.json(
        {
          error: 'Database tidak dapat dijangkau, jadi snapshot tidak bisa dibangun ulang. Situs publik tetap menampilkan data dari snapshot terakhir yang terkompilasi.',
          dbAvailable: false,
        },
        { status: 503 },
      )
    }

    const result = await exportSnapshot()
    return NextResponse.json({ ok: true, counts: result.counts })
  } catch (err) {
    console.error('[api/admin/snapshot]', err)
    const readOnly = process.env.VERCEL === '1' || (err instanceof Error && /EROFS|read-only/i.test(err.message))
    return NextResponse.json(
      {
        error: readOnly
          ? 'Serverless Vercel tidak dapat menulis berkas. Snapshot harus dibangun dari komputer lokal: unduh proyek → jalankan `bun run db:export` → commit → push ke GitHub. (Jika nanti database cloud seperti Turso terhubung, langkah ini tidak lagi diperlukan setiap kali — minta saya untuk menghubungkannya.)'
          : 'Gagal mengekspor snapshot.',
        readOnly: !!readOnly,
      },
      { status: 501 },
    )
  }
}
