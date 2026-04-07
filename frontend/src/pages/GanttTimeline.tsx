import React from 'react';
import { GitBranch, Flag, Database, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { useTaskStore } from '../hooks/useTaskStore';
import { useProjectStore } from '../hooks/useProjectStore';

const TIMELINE_WIDTH = 120;

export const GanttTimeline: React.FC = () => {
  const { tasks, fetchTasks } = useTaskStore();
  const { currentProject } = useProjectStore();

  React.useEffect(() => {
    void fetchTasks(currentProject?.projectId);
  }, [currentProject, fetchTasks]);

  const startOfTimeline = new Date();
  startOfTimeline.setHours(0, 0, 0, 0);
  const startDayOfWeek = startOfTimeline.getDay() || 7;
  startOfTimeline.setDate(startOfTimeline.getDate() - (startDayOfWeek - 1));

  const weekColumns = Array.from({ length: 8 }).map((_, index) => {
    const date = new Date(startOfTimeline);
    date.setDate(date.getDate() + index * 7);
    return date;
  });

  const getPixels = (dateString?: string): number | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const diffDays = (date.getTime() - startOfTimeline.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays * (TIMELINE_WIDTH / 7);
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] animate-fade-in-up pb-10">
      <div className="mb-8 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div className="animate-fade-in-up">
          <div className="mb-3 flex flex-wrap items-center gap-2 md:mb-4 md:gap-3">
            <div className="rounded-md bg-[var(--color-primary)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-[var(--color-primary)]/20">
              {currentProject?.projectName || 'Project Timeline'}
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-[var(--color-surface-container-low)] px-3 py-1 text-[10px] font-black shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></span>
              <span className="uppercase tracking-wider text-[var(--color-on-surface-variant)]">Operational</span>
            </div>
          </div>
          <h1 className="mb-1 text-3xl font-display font-black italic tracking-tighter text-[var(--color-on-surface)] md:mb-2 md:text-5xl">Timeline.</h1>
          <p className="text-sm font-medium text-[var(--color-on-surface-variant)] opacity-70 md:text-base">
            Strategic roadmap for the currently selected project.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <div className="flex items-center rounded-xl bg-[var(--color-surface-container-low)] p-1">
            <button type="button" disabled title="Range navigation is not available yet" className="cursor-not-allowed rounded-lg p-2 text-[var(--color-on-surface-variant)]/40">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-on-surface)] md:px-4 md:text-xs">
              {startOfTimeline.toLocaleString('default', { month: 'short' })} - {weekColumns[7].toLocaleString('default', { month: 'short' })}
            </div>
            <button type="button" disabled title="Range navigation is not available yet" className="cursor-not-allowed rounded-lg p-2 text-[var(--color-on-surface-variant)]/40">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="hidden items-center rounded-xl bg-[var(--color-surface-container-low)] p-1 sm:flex">
            {['Day', 'Week', 'Month'].map((view, index) => (
              <button
                key={view}
                type="button"
                className={`rounded-lg px-3 py-2 text-[10px] font-black tracking-wider transition-all duration-300 md:px-5 md:text-xs ${
                  index === 1 ? 'bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] shadow-sm' : 'text-[var(--color-on-surface-variant)]'
                }`}
              >
                {view.toUpperCase()}
              </button>
            ))}
          </div>

          <button type="button" disabled title="Sharing is not available yet" className="cursor-not-allowed rounded-xl bg-[var(--color-surface-container-lowest)] p-3 text-[var(--color-on-surface)]/45 shadow-sm">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto px-4 md:mx-0 md:px-0">
        <div className="min-w-[800px] overflow-hidden rounded-3xl bg-[var(--color-surface-container-lowest)] shadow-[0_40px_80px_rgba(28,27,27,0.04)]">
          <div className="flex h-12 bg-[var(--color-surface-container-low)]/60 backdrop-blur-md md:h-16">
            <div className="flex w-48 flex-shrink-0 items-center px-4 md:w-72 md:px-8 lg:w-96">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)] md:text-[10px]">Task Tree</span>
            </div>
            <div
              className="relative flex flex-grow overflow-x-auto"
              style={{ backgroundImage: 'linear-gradient(to right, var(--color-outline-variant) 1px, transparent 1px)', backgroundSize: `${TIMELINE_WIDTH}px 100%` }}
            >
              {weekColumns.map((date) => (
                <div key={date.toISOString()} className="flex w-[120px] flex-shrink-0 items-center justify-center bg-white/20 text-[9px] font-black tracking-widest text-[var(--color-on-surface-variant)]/60 md:text-[10px]">
                  {date.toLocaleString('default', { month: 'short' }).toUpperCase()} {date.getDate().toString().padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            {tasks.map((task) => {
              const Icon = task.metadata?.icon === 'history' ? Database : task.metadata?.icon === 'chat_bubble' ? Flag : GitBranch;
              const isCompleted = task.status === 'completed';

              let left = getPixels(task.startDate) || 0;
              let width = getPixels(task.dueDate) ? getPixels(task.dueDate)! - left : TIMELINE_WIDTH;

              if (width < 30) width = 30;
              if (left < 0) {
                width += left;
                left = 0;
              }

              const isPending = !task.startDate;

              return (
                <div key={task.id} className={`group flex h-16 transition-all duration-300 hover:bg-[var(--color-surface-container-low)] md:h-20 ${isCompleted ? 'grayscale opacity-60 hover:opacity-100 hover:grayscale-0' : ''}`}>
                  <div className="flex w-48 flex-shrink-0 items-center justify-between px-4 md:w-72 md:px-8 lg:w-96">
                    <div className="flex items-center gap-2 md:gap-4">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-xl md:h-10 md:w-10 ${isCompleted ? 'bg-slate-300 text-slate-600' : task.priority === 'High' ? 'bg-orange-500/10 text-orange-600' : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'}`}>
                        <Icon className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="block truncate text-xs font-black tracking-tight text-[var(--color-on-surface)] md:text-sm">{task.title}</span>
                        <p className="text-[9px] font-bold uppercase opacity-60 text-[var(--color-on-surface-variant)] md:text-[10px]">
                          {task.priority} • {task.status.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="relative flex-grow overflow-hidden"
                    style={{ backgroundImage: 'linear-gradient(to right, var(--color-outline-variant) 1px, transparent 1px)', backgroundSize: `${TIMELINE_WIDTH}px 100%` }}
                  >
                    {isPending ? (
                      <div className="absolute left-[10px] top-4 flex h-7 items-center rounded-full bg-[var(--color-surface-container-highest)] px-4 text-[9px] font-bold text-[var(--color-on-surface-variant)] shadow-sm md:top-6 md:h-8">
                        Pending scheduling
                      </div>
                    ) : (
                      <div
                        className={`absolute top-4 h-7 cursor-pointer overflow-hidden rounded-full shadow-inner transition-all md:top-6 md:h-8 ${isCompleted ? 'bg-slate-100' : 'bg-[var(--color-surface-container-low)]'}`}
                        style={{ left: `${left}px`, width: `${width}px` }}
                      >
                        <div className={`relative h-full rounded-full ${isCompleted ? 'w-full bg-slate-400 opacity-40' : 'w-full bg-kinetic-animate shadow-[0_0_20px_rgba(53,37,205,0.18)]'}`}>
                          {!isCompleted && <div className="absolute inset-0 animate-pulse bg-white/20"></div>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {tasks.length === 0 && (
              <div className="flex h-32 items-center justify-center text-sm font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] md:h-48">
                No active tasks found for this project
              </div>
            )}

            <div className="flex h-16 bg-slate-50/30 md:h-20">
              <div className="w-48 md:w-72 lg:w-96"></div>
              <div className="flex-grow" style={{ backgroundImage: 'linear-gradient(to right, var(--color-outline-variant) 2px, transparent 2px)', backgroundSize: `${TIMELINE_WIDTH}px 100%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:mt-12 md:grid-cols-4 md:gap-8">
        {[
          { label: 'Active Streams', value: String(tasks.length), sub: 'Current tasks', accent: 'text-[var(--color-primary)]' },
          { label: 'Scheduled', value: String(tasks.filter((task) => task.startDate).length), sub: 'With start date', accent: 'text-emerald-500' },
          { label: 'Pending', value: String(tasks.filter((task) => !task.startDate).length), sub: 'Need planning', accent: 'text-orange-500' },
          { label: 'Completed', value: String(tasks.filter((task) => task.status === 'completed').length), sub: 'Closed tasks', accent: 'text-[var(--color-on-surface)]' },
        ].map((kpi) => (
          <div key={kpi.label} className="relative overflow-hidden rounded-3xl bg-[var(--color-surface-container-lowest)] p-5 shadow-[0_10px_30px_rgba(28,27,27,0.02)] md:p-8">
            <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)] md:mb-3 md:text-[10px]">{kpi.label}</p>
            <div className="flex items-end gap-3">
              <span className="text-2xl font-display font-black tracking-tighter md:text-4xl">{kpi.value}</span>
              <span className={`mb-1 text-[10px] font-black uppercase md:text-[11px] ${kpi.accent}`}>{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
