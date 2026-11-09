import { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import useNow from './hooks/useNow';
import { DEFAULT_EXAMS, DEFAULT_SUBJECTS, DEFAULT_TASKS } from './data/defaults';
import Dashboard from './components/Dashboard';
import Countdown from './components/Countdown';
import Timeline from './components/Timeline';
import StudyPlanner from './components/StudyPlanner';
import Strategy from './components/Strategy';

const TABS = [
  { id: 'overview', label: 'ภาพรวม', icon: '⌂' },
  { id: 'countdown', label: 'นับถอยหลัง', icon: '⏱' },
  { id: 'timeline', label: 'ไทม์ไลน์ TCAS', icon: '📅' },
  { id: 'planner', label: 'แผนการอ่าน', icon: '✅' },
  { id: 'strategy', label: 'กลยุทธ์', icon: '💡' },
];

export default function App() {
  const [tab, setTab] = useState('overview');
  const [exams, setExams] = useLocalStorage('dek71:exams', DEFAULT_EXAMS);
  const [subjects, setSubjects] = useLocalStorage('dek71:subjects', DEFAULT_SUBJECTS);
  const [tasks, setTasks] = useLocalStorage('dek71:tasks', DEFAULT_TASKS);
  const [targetId, setTargetId] = useLocalStorage('dek71:targetId', null);

  const now = useNow(60_000);
  const hasUpcoming = exams.some((ex) => new Date(ex.date).getTime() > now);

  // ถ้าไม่มีวันสอบที่อยู่ข้างหน้าเหลืออยู่เลย ใช้ไทม์ไลน์ว่างได้ตามจริง
  useEffect(() => {
    document.title =
      tab === 'overview'
        ? 'Dek 71 · แดชบอร์ดวางแผนชีวิต'
        : `Dek 71 · ${TABS.find((t) => t.id === tab)?.label ?? ''}`;
  }, [tab]);

  const resetAll = () => {
    if (!window.confirm('รีเซ็ตข้อมูลทั้งหมด (วันสอบ / เช็คลิสต์ / แผนอ่าน) กลับค่าเริ่มต้น?')) return;
    setExams(DEFAULT_EXAMS);
    setSubjects(DEFAULT_SUBJECTS);
    setTasks(DEFAULT_TASKS);
    setTargetId(null);
  };

  const navigate = (t) => {
    setTab(t);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 text-lg font-black text-slate-950 shadow-glow">
              71
            </span>
            <div>
              <h1 className="font-bold tracking-tight text-white">Dek&nbsp;71 Dashboard</h1>
              <p className="text-[11px] text-slate-400">วางแผนชีวิต & เตรียมสอบเข้ามหาวิทยาลัย</p>
            </div>
          </div>

          {/* Tabs — desktop */}
          <nav className="hidden items-center gap-1 md:flex">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => navigate(t.id)}
                className={`rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                  tab === t.id
                    ? 'bg-emerald-500/15 text-emerald-300'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <span className="mr-1.5">{t.icon}</span>
                {t.label}
              </button>
            ))}
            <button
              onClick={resetAll}
              title="รีเซ็ตข้อมูลทั้งหมด"
              className="ml-2 rounded-xl px-3 py-2 text-sm text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-400"
            >
              ⟲
            </button>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div key={tab} className="animate-fade-up">
          {tab === 'overview' && (
            <Dashboard
              exams={exams}
              subjects={subjects}
              tasks={tasks}
              targetId={targetId}
              setTargetId={setTargetId}
              onNavigate={navigate}
            />
          )}
          {tab === 'countdown' && (
            <Countdown exams={exams} setExams={setExams} targetId={targetId} setTargetId={setTargetId} />
          )}
          {tab === 'timeline' && <Timeline exams={exams} />}
          {tab === 'planner' && (
            <StudyPlanner subjects={subjects} setSubjects={setSubjects} tasks={tasks} setTasks={setTasks} />
          )}
          {tab === 'strategy' && <Strategy />}
          {!hasUpcoming && tab !== 'strategy' && (
            <p className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center text-sm text-emerald-300">
              🎉 ปฏิทินไม่มีกิจกรรมที่รออยู่แล้ว — เพิ่มวันสอบใหม่ในแท็บ "นับถอยหลัง" ได้เสมอ
            </p>
          )}
        </div>

        <footer className="mt-10 border-t border-slate-800/60 pt-4 text-center text-xs text-slate-600">
          เด็ก 71 · วันที่ในปฏิทินเป็นค่าโดยประมาณจากรุ่นก่อน — โปรดตรวจสอบประกาศจาก สทศ. / ทปอ. ทุกครั้ง
          <span className="mx-2">·</span>
          ข้อมูลถูกบันทึกไว้ในเครื่องของคุณเอง
        </footer>
      </main>

      {/* Bottom nav — mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-950/90 backdrop-blur-lg md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => navigate(t.id)}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition ${
                tab === t.id ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              <span className="text-lg leading-none">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
