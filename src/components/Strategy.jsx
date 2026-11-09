import { TECHNIQUES, HEALTH_TIPS, MOTIVATIONS } from '../data/defaults';
import { dailyIndex } from '../utils/format';

function PomodoroTimer() {
  return (
    <div className="card overflow-hidden p-5 sm:p-6">
      <h3 className="mb-1 text-lg font-semibold text-white">🍅 Pomodoro Coach</h3>
      <p className="text-sm text-slate-400">
        สูตรแนะนำสำหรับเด็ก 71: <span className="font-mono text-emerald-300">25–5 × 4</span> แล้วพักยาว
        <span className="font-mono text-sky-300"> 30 นาที</span>
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { n: 1, t: 'อ่านจริงจัง 25 นาที', cls: 'text-emerald-300' },
          { n: 2, t: 'พักสายตา 5 นาที อย่าหยิบมือถือ', cls: 'text-sky-300' },
          { n: 3, t: 'ทำครบ 4 รอบ แล้วพักยาว 30 นาที', cls: 'text-violet-300' },
          { n: 4, t: 'ทำ 3–4 ชุดต่อวัน = 8–12 รอบ', cls: 'text-amber-300' },
        ].map((s) => (
          <div key={s.n} className="rounded-xl border border-slate-800 bg-slate-800/40 p-3">
            <p className={`font-mono text-xs font-bold ${s.cls}`}>รอบ {s.n}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">{s.t}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs leading-relaxed text-emerald-200">
        💡 เทคนิค: เปิดโหมดโฟกัสบนมือถือแล้ววางห่างตัว 2 เมตร สัปดาห์ละ 60–80 รอบ
        จะทำผลได้ตรงแผนดีที่สุด ไม่ต้องเครียดอ่านทั้งคืน
      </p>
    </div>
  );
}

export default function Strategy() {
  const quote = MOTIVATIONS[dailyIndex(MOTIVATIONS.length)];

  return (
    <div className="space-y-6">
      {/* คำคมประจำวัน */}
      <div className="card relative overflow-hidden bg-gradient-to-r from-emerald-500/10 via-slate-900/50 to-sky-500/10 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">คำคมประจำวัน</p>
        <blockquote className="mt-2 text-lg font-medium leading-relaxed text-white sm:text-xl">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <p className="mt-3 text-sm text-slate-400">— แดชบอร์ดเด็ก 71 (เปลี่ยนข้อความทุกวัน)</p>
      </div>

      {/* เทคนิคการเรียน 2 คอลัมน์ */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">🧠 เทคนิคการเตรียมตัว</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {TECHNIQUES.map((t) => (
            <div key={t.title} className="card group p-5 transition hover:border-emerald-500/30">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xl">
                  {t.icon}
                </span>
                <h3 className="font-semibold text-slate-100">{t.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">{t.desc}</p>
              <ul className="mt-3 space-y-2">
                {t.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-sm text-slate-300">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <PomodoroTimer />

      {/* สุขภาพกายและใจ */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">🌿 สุขภาพกายและใจช่วงใกล้สอบ</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {HEALTH_TIPS.map((h) => (
            <div
              key={h.title}
              className="card p-4 transition hover:border-sky-500/30"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xl">{h.icon}</span>
                <h3 className="font-semibold text-slate-100">{h.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">{h.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ลำดับเวลาแนะนำ (roadmap) */}
      <div className="card p-5 sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-white">🗺️ Roadmap สั้น ๆ จนถึงวันสอบ</h2>
        <ol className="space-y-3">
          {[
            ['ม.5 — เก็บพื้นฐาน', 'โฟกัสเนื้อหาชั้น ม.5 ให้แน่ เพราะ 80% ของข้อสอบ A-Level ปูพื้นจากระดับนี้'],
            ['ปิดเทอม ม.5 — เคลียร์ใหญ่', 'เคลียร์เนื้อหา ทำข้อสอบเก่ารายวิชา กำหนดคณะ + สอบวัด TPAT ที่ต้องสอบ'],
            ['เปิดเทอม ม.6 — รอบแรก', 'ลงสนาม A-Level ครั้งที่ 1 ให้ได้ เป็น "ตัวจริง" ของสถาปนา หนึ่งครั้ง'],
            ['เดือนพฤศจิกายน–มกราคม', 'สอบ TGAT/TPAT ทั้งสองครั้ง และยื่นสมัครรอบ 1–2 ขนานกัน'],
            ['ก่อนยื่นรอบ 3 — คิดกลยุทธ์', 'รวมคะแนน คำนวณโอกาส 60–70% แล้วเลือกคณะที่รอบ 3 อย่างสมเหตุผล'],
            ['หลังสอบครั้งสุดท้าย — พักจริง', 'นอนให้พอ กลับมาเหนื่อยน้อยลง แล้วเงียบรอผลพร้อมทางเลือกสำรองทุกขั้น'],
          ].map(([phase, detail], i) => (
            <li key={phase} className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-violet-500/40 bg-violet-500/10 font-mono text-xs font-bold text-violet-300">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-slate-200">{phase}</p>
                <p className="text-sm text-slate-400">{detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
