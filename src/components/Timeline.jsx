import { useMemo } from 'react';
import useNow from '../hooks/useNow';
import { TYPE_STYLES } from '../data/defaults';
import { thaiDateTime, thaiDate } from '../utils/format';

function statusOf(exam, now) {
  const t = new Date(exam.date).getTime();
  if (t <= now) return 'past';
  const days = Math.ceil((t - now) / 86_400_000);
  if (days <= 30) return 'soon';
  return 'upcoming';
}

const STATUS_META = {
  past: { chip: 'border-slate-700 bg-slate-800/60 text-slate-400', label: 'ผ่านแล้ว', ring: 'ring-slate-800' },
  soon: { chip: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 animate-pulse-soft', label: '🎉 ใกล้เข้ามาแล้ว', ring: 'ring-emerald-500/40' },
  upcoming: { chip: 'border-sky-500/30 bg-sky-500/10 text-sky-300', label: 'อยู่ระหว่างเตรียมตัว', ring: 'ring-sky-500/20' },
};

export default function Timeline({ exams }) {
  const now = useNow(60_000);

  const sorted = useMemo(
    () => exams.slice().sort((a, b) => new Date(a.date) - new Date(b.date)),
    [exams]
  );

  const nextUpcoming = sorted.find((ex) => new Date(ex.date).getTime() > now);

  const grouped = useMemo(() => {
    const groups = {};
    sorted.forEach((ex) => {
      const key = ex.type in TYPE_STYLES ? TYPE_STYLES[ex.type].label : 'วันสอบของฉัน';
      (groups[key] ||= []).push(ex);
    });
    return groups;
  }, [sorted]);

  return (
    <div className="space-y-6">
      {/* แถบตัวช่วยสถานะ */}
      <div className="card flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          {Object.entries(TYPE_STYLES).map(([key, s]) => (
            <span key={key} className={`chip ${s.chip}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} /> {s.label}
            </span>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          * วันที่โดยประมาณจากรุ่นก่อน ๆ — แก้ไขได้ที่แท็บ "นับถอยหลัง"
        </p>
      </div>

      {/* ตัวนับถึงกิจกรรมถัดไป */}
      {nextUpcoming && (
        <div className="card border-emerald-500/25 bg-gradient-to-r from-emerald-500/10 to-transparent p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">กิจกรรมถัดไป</p>
          <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-lg font-bold text-white sm:text-xl">{nextUpcoming.name}</h3>
            <p className="text-sm text-slate-400">{thaiDateTime(nextUpcoming.date)}</p>
          </div>
        </div>
      )}

      {/* ไทม์ไลน์ */}
      {Object.entries(grouped).map(([groupLabel, items]) => (
        <section key={groupLabel} className="card p-5 sm:p-6">
          <h3 className="mb-5 flex items-center gap-2 text-base font-semibold text-white">
            <span
              className={`h-2 w-2 rounded-full ${
                Object.values(TYPE_STYLES).find((s) => s.label === groupLabel)?.dot ?? 'bg-amber-400'
              }`}
            />
            {groupLabel}
            <span className="ml-auto text-xs font-normal text-slate-500">{items.length} กิจกรรม</span>
          </h3>

          <ol className="relative space-y-4 border-l-2 border-slate-800 pl-5 ml-2">
            {items.map((ex) => {
              const st = statusOf(ex, now);
              const days = Math.ceil((new Date(ex.date).getTime() - now) / 86_400_000);
              const meta = STATUS_META[st];
              return (
                <li key={ex.id} className="relative">
                  <span
                    className={`absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-slate-950 ${
                      ex.type in TYPE_STYLES ? TYPE_STYLES[ex.type].dot : 'bg-amber-400'
                    } ${st === 'past' ? 'opacity-40' : ''} ${
                      nextUpcoming?.id === ex.id ? 'ring-4 ring-emerald-500/30' : ''
                    }`}
                  />
                  <div
                    className={`rounded-xl border border-slate-800 bg-slate-900/60 p-3 ring-1 ring-inset transition hover:border-slate-700 sm:p-4 ${meta.ring}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className={`font-semibold ${st === 'past' ? 'text-slate-500' : 'text-slate-100'}`}>
                          {ex.name}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          📅 {thaiDate(ex.date)} · {thaiDateTime(ex.date).split('· ')[1] ?? ''}
                          {ex.note ? ` — ${ex.note}` : ''}
                        </p>
                      </div>
                      <span className={`chip shrink-0 ${meta.chip}`}>
                        {st === 'past' ? 'ผ่านแล้ว' : st === 'soon' ? `อีก ${days} วัน · ใกล้แล้ว` : `อีก ${days} วัน`}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
