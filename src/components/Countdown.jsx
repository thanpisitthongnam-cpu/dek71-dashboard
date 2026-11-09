import { useState } from 'react';
import useNow from '../hooks/useNow';
import { TYPE_STYLES } from '../data/defaults';
import { thaiDateTime } from '../utils/format';

function pad(n) {
  return String(n).padStart(2, '0');
}

function splitParts(diff) {
  const d = Math.max(0, diff);
  return [
    { value: Math.floor(d / 86_400_000), label: 'วัน' },
    { value: Math.floor(d / 3_600_000) % 24, label: 'ชั่วโมง' },
    { value: Math.floor(d / 60_000) % 60, label: 'นาที' },
    { value: Math.floor(d / 1000) % 60, label: 'วินาที' },
  ];
}

function Digit({ value, label }) {
  return (
    <div className="group relative flex-1 overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/80 p-3 text-center shadow-lg shadow-black/30 sm:p-4">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent" />
      <p className="font-mono text-4xl font-bold tabular-nums text-emerald-300 sm:text-5xl md:text-6xl">
        {value >= 1000 ? value.toLocaleString() : pad(value)}
      </p>
      <p className="mt-1 text-xs font-medium text-slate-400 sm:text-sm">{label}</p>
    </div>
  );
}

/** ฟอร์มเพิ่มวันสอบของฉัน */
function AddExamForm({ onAdd }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !date) return;
    onAdd({
      id: `custom-${Date.now()}`,
      type: 'CUSTOM',
      name: name.trim(),
      date: new Date(date).toISOString(),
      note: 'วันสอบที่กำหนดเอง',
    });
    setName('');
    setDate('');
  };

  return (
    <form onSubmit={submit} className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <p className="mb-3 text-sm font-semibold text-slate-300">➕ เพิ่มวันสอบเป้าหมายของฉัน</p>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <input
          className="input"
          placeholder="ชื่อวันสอบ เช่น สอบวิชาคณิต ของโรงเรียน"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
        />
        <div className="flex gap-2">
          <input
            type="datetime-local"
            className="input sm:w-56"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button type="submit" className="btn-primary whitespace-nowrap">เพิ่ม</button>
        </div>
      </div>
    </form>
  );
}

export default function Countdown({ exams, setExams, targetId, setTargetId }) {
  const now = useNow(1000);

  const upcoming = exams
    .filter((ex) => new Date(ex.date).getTime() > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const target =
    exams.find((ex) => ex.id === targetId && new Date(ex.date).getTime() > now) || upcoming[0];

  const diff = target ? new Date(target.date).getTime() - now : 0;
  const parts = splitParts(diff);
  const isSameDay =
    target && new Date(target.date).toDateString() === new Date(now).toDateString();

  const addExam = (exam) => {
    setExams((prev) => [...prev, exam]);
    setTargetId(exam.id);
  };

  const removeExam = (id) => {
    setExams((prev) => prev.filter((ex) => ex.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="card p-5 sm:p-8">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="chip border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
            <span className="animate-pulse-soft h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {isSameDay && diff > 0 ? 'TODAY IS THE DAY' : 'เป้าหมายถัดไป'}
          </span>
          {target && (
            <span className={`chip ${TYPE_STYLES[target.type]?.chip ?? TYPE_STYLES.CUSTOM.chip}`}>
              {TYPE_STYLES[target.type]?.label ?? 'วันสอบของฉัน'}
            </span>
          )}
        </div>

        <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
          {target ? target.name : 'ยินดีด้วย — วันสอบทั้งหมดผ่านไปแล้ว 🎓'}
        </h2>
        {target && (
          <p className="mb-6 text-sm text-slate-400">
            📅 {thaiDateTime(target.date)}{target.note ? ` · ${target.note}` : ''}
          </p>
        )}

        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {parts.map((p) => (
            <Digit key={p.label} value={p.value} label={p.label} />
          ))}
        </div>

        {target && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              className={`btn-ghost text-xs ${target.id === targetId ? 'border-emerald-500/60 text-emerald-300' : ''}`}
              onClick={() => setTargetId(null)}
              title="เอาเป้าหมายกลับไปเป็นวันสอบนัดถัดไปอัตโนมัติ"
            >
              ⎘ ใช้วันสอบถัดไปอัตโนมัติ
            </button>
          </div>
        )}
      </div>

      <AddExamForm onAdd={addExam} />

      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">ตั้งเป้าเป็นตัวนับหลัก</h3>
          <span className="text-xs text-slate-500">เลือกข้อมูลมากกว่าหนึ่งรายการได้</span>
        </div>
        <ul className="divide-y divide-slate-800">
          {exams
            .slice()
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((ex) => {
              const passed = new Date(ex.date).getTime() <= now;
              return (
                <li
                  key={ex.id}
                  className={`flex items-center gap-3 rounded-lg px-2 py-3 transition ${
                    ex.id === target?.id ? 'bg-emerald-500/5' : ''
                  }`}
                >
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${TYPE_STYLES[ex.type]?.dot ?? 'bg-amber-400'}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-medium ${passed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                      {ex.name}
                    </p>
                    <p className="text-xs text-slate-500">{thaiDateTime(ex.date)}</p>
                  </div>
                  <button
                    onClick={() => setTargetId(ex.id)}
                    disabled={passed}
                    className={`btn-ghost px-3 py-1 text-xs ${ex.id === target?.id ? 'border-emerald-500/60 text-emerald-300' : ''}`}
                  >
                    {passed ? 'ผ่านแล้ว' : ex.id === target?.id ? '★ ตั้งเป้าแล้ว' : 'ตั้งเป้า'}
                  </button>
                  <button
                    onClick={() => removeExam(ex.id)}
                    className="rounded-lg px-2 py-1 text-slate-500 transition hover:text-rose-400"
                    title="ลบรายการนี้"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
        </ul>
        <p className="mt-3 text-xs text-slate-500">
          * วันสอบเริ่มต้นเป็นค่าโดยประมาณ ลบแล้วเพิ่มใหม่ด้วยวันที่จริงจากประกาศ สทศ./ทปอ.
        </p>
      </div>
    </div>
  );
}
