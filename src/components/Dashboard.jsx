import useNow from '../hooks/useNow';
import { TYPE_STYLES } from '../data/defaults';
import { thaiDateTime } from '../utils/format';

function splitDiff(diff) {
  const d = Math.max(0, diff);
  return {
    days: Math.floor(d / 86_400_000),
    hours: Math.floor(d / 3_600_000) % 24,
  };
}

export default function Dashboard({
  exams,
  subjects,
  tasks,
  targetId,
  setTargetId,
  onNavigate,
}) {
  const now = useNow(1000);

  const upcoming = exams
    .filter((ex) => new Date(ex.date).getTime() > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const target =
    exams.find((ex) => ex.id === targetId && new Date(ex.date).getTime() > now) || upcoming[0];
  const diff = target ? new Date(target.date).getTime() - now : 0;
  const { days, hours } = splitDiff(diff);

  const allTopics = subjects.flatMap((s) => s.topics);
  const doneTopics = allTopics.filter((t) => t.done).length;
  const overallPct = allTopics.length ? Math.round((doneTopics / allTopics.length) * 100) : 0;

  const todayStr = new Date().toLocaleDateString('sv-SE');
  const todayTasks = tasks.filter((t) => !t.date || t.date === todayStr);
  const todayDone = todayTasks.filter((t) => t.done).length;

  const stat = (label, value, sub, chip) => (
    <div className="card p-4 sm:p-5">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className={`mt-1 font-mono text-2xl font-bold sm:text-3xl ${chip}`}>{value}</p>
      <p className="mt-0.5 text-xs text-slate-500">{sub}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Hero countdown */}
      <div className="card relative overflow-hidden p-5 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="chip border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
              <span className="animate-pulse-soft h-1.5 w-1.5 rounded-full bg-emerald-400" />
              เป้าหมายถัดไป
            </span>
            {target && (
              <span className={`chip ${TYPE_STYLES[target.type]?.chip ?? TYPE_STYLES.CUSTOM.chip}`}>
                {TYPE_STYLES[target.type]?.label ?? 'วันสอบของฉัน'}
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">
            {target ? target.name : 'เตรียมตัวสำเร็จ! 🎓'}
          </h1>
          {target && (
            <>
              <p className="mt-1 text-sm text-slate-400">📅 {thaiDateTime(target.date)}</p>
              <div className="mt-5 flex flex-wrap items-end gap-x-6 gap-y-2">
                <p className="font-mono text-5xl font-bold tabular-nums text-emerald-300 sm:text-7xl">
                  {days.toLocaleString()}
                  <span className="ml-2 text-2xl font-medium text-slate-500 sm:text-3xl">วัน</span>
                </p>
                <p className="font-mono text-3xl font-bold tabular-nums text-sky-300 sm:text-5xl">
                  {String(hours).padStart(2, '0')}
                  <span className="ml-1.5 text-lg font-medium text-slate-500 sm:text-2xl">ชั่วโมง</span>
                </p>
              </div>
              <button onClick={() => onNavigate('countdown')} className="btn-ghost mt-5 text-xs">
                ⏱ ดูนับถอยหลังแบบเรียลไทม์ เปิดหัวข้อเพิ่มวันสอบเอง
              </button>
            </>
          )}
        </div>
      </div>

      {/* สถิติรวม */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        {stat('เนื้อหาที่เคลียร์แล้ว', `${overallPct}%`, `${doneTopics}/${allTopics.length} หัวข้อ`, 'text-emerald-300')}
        {stat('งานวันนี้', todayTasks.length ? `${todayDone}/${todayTasks.length}` : '—', 'เสร็จแล้ว / แผนทั้งหมด', 'text-sky-300')}
        {stat('กิจกรรมสอบที่รออยู่', upcoming.length, 'จากปฏิทิน TCAS + วันสอบของฉัน', 'text-violet-300')}
        {stat('สอบภายใน 100 วัน', upcoming.filter((ex) => new Date(ex.date) - now <= 100 * 86_400_000).length, 'กิจกรรมที่ต้องเตรียมตัวเร่ง', 'text-amber-300')}
      </div>

      {/* Progress รวม */}
      <div className="card p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-white">ความคืบหน้ารวมการเคลียร์เนื้อหา</h3>
          <button onClick={() => onNavigate('planner')} className="text-xs text-emerald-400 hover:text-emerald-300">
            ไปที่แผนการอ่าน →
          </button>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-400 transition-all duration-700"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => {
            const d = s.topics.filter((t) => t.done).length;
            const p = s.topics.length ? Math.round((d / s.topics.length) * 100) : 0;
            return (
              <div key={s.id} className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-800/30 px-3 py-2">
                <span className="text-sm">{s.icon}</span>
                <span className="flex-1 truncate text-xs text-slate-300">{s.name}</span>
                <span className="font-mono text-xs text-slate-400">{p}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* สองคอลัมน์: กิจกรรมถัดไป + งานวันนี้ */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-white">📅 ปฏิทินรอบสอบ TCAS</h3>
            <button onClick={() => onNavigate('timeline')} className="text-xs text-emerald-400 hover:text-emerald-300">
              ดูไทม์ไลน์ →
            </button>
          </div>
          <ul className="space-y-2">
            {upcoming.slice(0, 5).map((ex) => {
              const d = Math.ceil((new Date(ex.date) - now) / 86_400_000);
              return (
                <li
                  key={ex.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-800/30 px-3 py-2.5"
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${TYPE_STYLES[ex.type]?.dot ?? 'bg-amber-400'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-200">{ex.name}</p>
                    <p className="text-xs text-slate-500">{thaiDateTime(ex.date)}</p>
                  </div>
                  <span className="font-mono text-xs text-slate-400">อีก {d} วัน</span>
                </li>
              );
            })}
            {upcoming.length === 0 && (
              <li className="py-6 text-center text-sm text-slate-500">ทุกกิจกรรมผ่านไปแล้ว 🎉</li>
            )}
          </ul>
        </div>

        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-white">✅ แผนอ่านของวันนี้</h3>
            <button onClick={() => onNavigate('planner')} className="text-xs text-emerald-400 hover:text-emerald-300">
              จัดการงาน →
            </button>
          </div>
          <ul className="space-y-2">
            {todayTasks.slice(0, 5).map((t) => (
              <li key={t.id} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-800/30 px-3 py-2.5">
                <input type="checkbox" checked={t.done} readOnly className="h-4 w-4 accent-emerald-500" />
                <p className={`flex-1 truncate text-sm ${t.done ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                  {t.title}
                </p>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">{t.subject}</span>
              </li>
            ))}
            {todayTasks.length === 0 && (
              <li className="py-6 text-center text-sm text-slate-500">
                วันนี้ยังไม่มีแผน — เพิ่มงานแรกเลย 💪
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
