import { useState, useMemo } from 'react';
import { thaiDateShort } from '../utils/format';

function ProgressBar({ pct, color = 'emerald', className = '' }) {
  const colors = {
    emerald: 'from-emerald-500 to-teal-400',
    sky: 'from-sky-500 to-cyan-400',
    violet: 'from-violet-500 to-fuchsia-400',
    amber: 'from-amber-500 to-orange-400',
    rose: 'from-rose-500 to-pink-400',
    lime: 'from-lime-500 to-green-400',
    cyan: 'from-cyan-500 to-blue-400',
  };
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-slate-800 ${className}`}>
      <div
        className={`h-full rounded-full bg-gradient-to-r ${colors[color] ?? colors.emerald} transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

const subjectColorMap = {
  emerald: { dot: 'bg-emerald-400', chip: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
  sky: { dot: 'bg-sky-400', chip: 'bg-sky-500/10 text-sky-300 border-sky-500/30' },
  violet: { dot: 'bg-violet-400', chip: 'bg-violet-500/10 text-violet-300 border-violet-500/30' },
  amber: { dot: 'bg-amber-400', chip: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
  rose: { dot: 'bg-rose-400', chip: 'bg-rose-500/10 text-rose-300 border-rose-500/30' },
  lime: { dot: 'bg-lime-400', chip: 'bg-lime-500/10 text-lime-300 border-lime-500/30' },
  cyan: { dot: 'bg-cyan-400', chip: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' },
};

/* ---------- เช็คลิสต์วิชา ---------- */
function SubjectChecklist({ subjects, setSubjects }) {
  const [openId, setOpenId] = useState(null);
  const [newTopic, setNewTopic] = useState('');

  const overall = useMemo(() => {
    const all = subjects.flatMap((s) => s.topics);
    const done = all.filter((t) => t.done).length;
    return { done, total: all.length, pct: all.length ? Math.round((done / all.length) * 100) : 0 };
  }, [subjects]);

  const toggleTopic = (sid, tid) => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === sid
          ? { ...s, topics: s.topics.map((t) => (t.id === tid ? { ...t, done: !t.done } : t)) }
          : s
      )
    );
  };

  const addTopic = (sid) => {
    if (!newTopic.trim()) return;
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === sid
          ? {
              ...s,
              topics: [...s.topics, { id: `${sid}-${Date.now()}`, t: newTopic.trim(), done: false }],
            }
          : s
      )
    );
    setNewTopic('');
  };

  const removeTopic = (sid, tid) => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === sid ? { ...s, topics: s.topics.filter((t) => t.id !== tid) } : s
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* แถบรวม */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-lg font-semibold text-white">ความคืบหน้าเนื้อหารวม</h3>
          <p className="font-mono text-2xl font-bold text-emerald-300">
            {overall.pct}% <span className="text-sm font-normal text-slate-500">({overall.done}/{overall.total} หัวข้อ)</span>
          </p>
        </div>
        <ProgressBar pct={overall.pct} color="emerald" className="mt-3 h-3" />
        <p className="mt-2 text-xs text-slate-500">
          ติ๊กหัวข้อที่เคลียร์ได้แล้ว — ข้อมูลถูกเก็บไว้ในเครื่องของคุณเอง (localStorage)
        </p>
      </div>

      {/* รายวิชา */}
      {subjects.map((s) => {
        const done = s.topics.filter((t) => t.done).length;
        const pct = s.topics.length ? Math.round((done / s.topics.length) * 100) : 0;
        const color = subjectColorMap[s.color] ?? subjectColorMap.emerald;
        const open = openId === s.id;
        return (
          <div key={s.id} className="card p-4 sm:p-5">
            <button
              onClick={() => setOpenId(open ? null : s.id)}
              className="flex w-full items-center gap-3 text-left"
            >
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg ${color.chip} border`}>
                {s.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-semibold text-slate-100">{s.name}</p>
                  <span className="font-mono text-sm text-slate-400">{pct}%</span>
                </div>
                <ProgressBar pct={pct} color={s.color} className="mt-1.5" />
              </div>
              <span className={`text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
            </button>

            {open && (
              <div className="mt-4 space-y-1.5 border-t border-slate-800 pt-4">
                {s.topics.map((t) => (
                  <div key={t.id} className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-800/50">
                    <input
                      id={`${s.id}-${t.id}`}
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggleTopic(s.id, t.id)}
                      className="h-4 w-4 shrink-0 cursor-pointer rounded accent-emerald-500"
                    />
                    <label
                      htmlFor={`${s.id}-${t.id}`}
                      className={`flex-1 cursor-pointer text-sm ${t.done ? 'text-slate-500 line-through' : 'text-slate-300'}`}
                    >
                      {t.t}
                    </label>
                    <button
                      onClick={() => removeTopic(s.id, t.id)}
                      className="text-xs text-slate-600 opacity-0 transition group-hover:opacity-100 hover:text-rose-400"
                      title="ลบหัวข้อ"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <input
                    className="input"
                    placeholder="เพิ่มหัวข้อที่ต้องอ่าน (เช่น ทำโจทย์อนุกรมชุด 10)"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTopic(s.id)}
                  />
                  <button onClick={() => addTopic(s.id)} className="btn-primary px-4">➕</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- แผนการอ่านรายวัน / รายสัปดาห์ ---------- */
function DailyPlanner({ tasks, setTasks, subjects }) {
  const [filter, setFilter] = useState('today'); // today | week | all
  const [form, setForm] = useState({ title: '', subject: subjects[0]?.name ?? '', date: '' });

  const todayStr = new Date().toLocaleDateString('sv-SE');
  const weekAgo = new Date(Date.now() + 7 * 86_400_000).toLocaleDateString('sv-SE');

  const filtered = tasks
    .filter((t) => {
      if (filter === 'today') return !t.date || t.date === todayStr;
      if (filter === 'week') return !t.date || (t.date >= todayStr && t.date <= weekAgo);
      return true;
    })
    .sort(
      (a, b) =>
        (a.date || '9999-12-31').localeCompare(b.date || '9999-12-31') || a.done - b.done
    );

  const todayDone = tasks.filter((t) => t.done && (!t.date || t.date === todayStr)).length;
  const todayAll = tasks.filter((t) => !t.date || t.date === todayStr).length;
  const weekDone = tasks.filter((t) => t.done && (!t.date || (t.date >= todayStr && t.date <= weekAgo))).length;
  const weekAll = tasks.filter((t) => !t.date || (t.date >= todayStr && t.date <= weekAgo)).length;

  const add = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setTasks((prev) => [
      { id: `task-${Date.now()}`, ...form, title: form.title.trim(), done: false },
      ...prev,
    ]);
    setForm((f) => ({ ...f, title: '', date: '' }));
  };

  const toggle = (id) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const FILTERS = [
    { id: 'today', label: 'วันนี้' },
    { id: 'week', label: 'สัปดาห์นี้' },
    { id: 'all', label: 'ทั้งหมด' },
  ];

  return (
    <div className="space-y-4">
      <div className="card p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-white">แผนการอ่านตามจังหวะ</h3>
          <div className="flex rounded-xl bg-slate-800/70 p-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  filter === f.id ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-3">
            <p className="text-xs text-slate-400">โปรเกรสวันนี้</p>
            <p className="font-mono text-xl font-bold text-emerald-300">
              {todayAll ? `${Math.round((todayDone / todayAll) * 100)}%` : '—'}
              <span className="ml-1 text-xs font-normal text-slate-500">({todayDone}/{todayAll} งาน)</span>
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-3">
            <p className="text-xs text-slate-400">โปรเกรสสัปดาห์นี้</p>
            <p className="font-mono text-xl font-bold text-sky-300">
              {weekAll ? `${Math.round((weekDone / weekAll) * 100)}%` : '—'}
              <span className="ml-1 text-xs font-normal text-slate-500">({weekDone}/{weekAll} งาน)</span>
            </p>
          </div>
        </div>

        {/* ฟอร์มเพิ่มงาน */}
        <form onSubmit={add} className="grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
          <input
            className="input"
            placeholder="งานวันนี้ เช่น ทำโจทย์ตรีโกณมิติ 10 ข้อ"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <select
            className="input sm:w-40"
            value={form.subject}
            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
          <input
            type="date"
            className="input sm:w-40"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          />
          <button type="submit" className="btn-primary">เพิ่มงาน</button>
        </form>
      </div>

      {/* รายการงาน */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">
            ยังไม่มีงานในช่วงนี้ — เพิ่มงานแรกของคุณด้านบนได้เลย 💪
          </p>
        ) : (
          <ul className="divide-y divide-slate-800">
            {filtered.map((t) => (
              <li key={t.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/30">
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggle(t.id)}
                  className="h-4 w-4 shrink-0 cursor-pointer rounded accent-emerald-500"
                />
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-medium ${t.done ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                    {t.title}
                  </p>
                  <p className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                    <span className="rounded bg-slate-800 px-1.5 py-0.5">{t.subject}</span>
                    {t.date && <span>📅 {thaiDateShort(t.date)}</span>}
                    {!t.date && <span>ไม่กำหนดวัน</span>}
                  </p>
                </div>
                <button
                  onClick={() => remove(t.id)}
                  className="rounded-lg px-2 py-1 text-slate-600 transition hover:text-rose-400"
                  title="ลบงาน"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ---------- แท็บหลัก ---------- */
export default function StudyPlanner({ subjects, setSubjects, tasks, setTasks }) {
  const [mode, setMode] = useState('checklist'); // checklist | planner

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {[
          { id: 'checklist', label: '✅ เช็คลิสต์เนื้อหา' },
          { id: 'planner', label: '🗓️ แผนอ่านรายวัน' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
              mode === m.id
                ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'checklist' ? (
        <SubjectChecklist subjects={subjects} setSubjects={setSubjects} />
      ) : (
        <DailyPlanner tasks={tasks} setTasks={setTasks} subjects={subjects} />
      )}
    </div>
  );
}
