import React from 'react';
import { GitBranch, Flag, Database, ChevronLeft, ChevronRight, Search, Filter, CalendarRange } from 'lucide-react';
import { useTaskStore, type Priority, type Status } from '../hooks/useTaskStore';
import { useProjectStore } from '../hooks/useProjectStore';

type TimelineView = 'day' | 'week' | 'month';

const DAY_WIDTH = 72;
const WEEK_WIDTH = 120;
const MONTH_WIDTH = 160;
const TASK_TREE_WIDTH = 320;

const STATUS_OPTIONS: Array<{ label: string; value: Status | 'all' }> = [
  { label: 'All Statuses', value: 'all' },
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Review', value: 'review' },
  { label: 'Completed', value: 'completed' },
];

const PRIORITY_OPTIONS: Array<{ label: string; value: Priority | 'all' }> = [
  { label: 'All Priorities', value: 'all' },
  { label: 'High', value: 'High' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Low', value: 'Low' },
];

const startOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const startOfWeek = (date: Date) => {
  const next = startOfDay(date);
  const day = next.getDay() || 7;
  next.setDate(next.getDate() - (day - 1));
  return next;
};

const startOfMonth = (date: Date) => {
  const next = startOfDay(date);
  next.setDate(1);
  return next;
};

const addDays = (date: Date, amount: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

const addMonths = (date: Date, amount: number) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + amount);
  return next;
};

const getRangeStart = (view: TimelineView, baseDate = new Date()) => {
  if (view === 'day') return startOfDay(baseDate);
  if (view === 'month') return startOfMonth(baseDate);
  return startOfWeek(baseDate);
};

const getColumnCount = (view: TimelineView) => {
  if (view === 'day') return 14;
  if (view === 'month') return 6;
  return 8;
};

const getColumnWidth = (view: TimelineView) => {
  if (view === 'day') return DAY_WIDTH;
  if (view === 'month') return MONTH_WIDTH;
  return WEEK_WIDTH;
};

const getRangeEnd = (rangeStart: Date, view: TimelineView) => {
  if (view === 'day') return addDays(rangeStart, getColumnCount(view));
  if (view === 'month') return addMonths(rangeStart, getColumnCount(view));
  return addDays(rangeStart, getColumnCount(view) * 7);
};

const shiftRange = (rangeStart: Date, view: TimelineView, direction: -1 | 1) => {
  if (view === 'day') return addDays(rangeStart, direction * getColumnCount(view));
  if (view === 'month') return addMonths(rangeStart, direction * getColumnCount(view));
  return addDays(rangeStart, direction * getColumnCount(view) * 7);
};

const formatHeaderLabel = (rangeStart: Date, rangeEnd: Date, view: TimelineView) => {
  if (view === 'day') {
    return `${rangeStart.toLocaleString('default', { month: 'short', day: 'numeric' })} - ${addDays(rangeEnd, -1).toLocaleString('default', { month: 'short', day: 'numeric' })}`;
  }
  if (view === 'month') {
    return `${rangeStart.toLocaleString('default', { month: 'short', year: 'numeric' })} - ${addMonths(rangeEnd, -1).toLocaleString('default', { month: 'short', year: 'numeric' })}`;
  }
  return `${rangeStart.toLocaleString('default', { month: 'short', day: 'numeric' })} - ${addDays(rangeEnd, -1).toLocaleString('default', { month: 'short', day: 'numeric' })}`;
};

const getColumns = (rangeStart: Date, view: TimelineView) => {
  const count = getColumnCount(view);
  return Array.from({ length: count }).map((_, index) => {
    if (view === 'day') {
      const start = addDays(rangeStart, index);
      const end = addDays(start, 1);
      return {
        key: start.toISOString(),
        label: `${start.toLocaleString('default', { month: 'short' }).toUpperCase()} ${start.getDate().toString().padStart(2, '0')}`,
        start,
        end,
      };
    }

    if (view === 'month') {
      const start = addMonths(rangeStart, index);
      const end = addMonths(start, 1);
      return {
        key: start.toISOString(),
        label: start.toLocaleString('default', { month: 'short', year: '2-digit' }).toUpperCase(),
        start,
        end,
      };
    }

    const start = addDays(rangeStart, index * 7);
    const end = addDays(start, 7);
    return {
      key: start.toISOString(),
      label: `${start.toLocaleString('default', { month: 'short' }).toUpperCase()} ${start.getDate().toString().padStart(2, '0')}`,
      start,
      end,
    };
  });
};

const getTaskDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const GanttTimeline: React.FC = () => {
  const { tasks, fetchTasks } = useTaskStore();
  const { currentProject } = useProjectStore();
  const [timelineView, setTimelineView] = React.useState<TimelineView>('week');
  const [rangeStart, setRangeStart] = React.useState<Date>(() => getRangeStart('week'));
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<Status | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = React.useState<Priority | 'all'>('all');
  const [includeUnscheduled, setIncludeUnscheduled] = React.useState(true);

  React.useEffect(() => {
    void fetchTasks(currentProject?.projectId);
  }, [currentProject, fetchTasks]);

  React.useEffect(() => {
    setRangeStart((current) => getRangeStart(timelineView, current));
  }, [timelineView]);

  const columns = React.useMemo(() => getColumns(rangeStart, timelineView), [rangeStart, timelineView]);
  const rangeEnd = React.useMemo(() => getRangeEnd(rangeStart, timelineView), [rangeStart, timelineView]);
  const columnWidth = getColumnWidth(timelineView);
  const timelineWidth = columns.length * columnWidth;

  const filteredTasks = React.useMemo(() => {
    const loweredSearch = searchTerm.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !loweredSearch ||
        task.title.toLowerCase().includes(loweredSearch) ||
        task.description?.toLowerCase().includes(loweredSearch) ||
        task.assigneeName?.toLowerCase().includes(loweredSearch) ||
        task.tags.some((tag) => tag.toLowerCase().includes(loweredSearch));

      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

      const startDate = getTaskDate(task.startDate);
      const dueDate = getTaskDate(task.dueDate);
      const isUnscheduled = !startDate;

      if (isUnscheduled) {
        return matchesSearch && matchesStatus && matchesPriority && includeUnscheduled;
      }

      const effectiveEnd = dueDate ?? startDate;
      const intersectsRange = Boolean(effectiveEnd) && startDate < rangeEnd && effectiveEnd >= rangeStart;

      return matchesSearch && matchesStatus && matchesPriority && intersectsRange;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter, includeUnscheduled, rangeStart, rangeEnd]);

  const getPixels = React.useCallback((date: Date) => {
    if (timelineView === 'month') {
      return (
        (date.getFullYear() - rangeStart.getFullYear()) * 12 * columnWidth +
        (date.getMonth() - rangeStart.getMonth()) * columnWidth
      );
    }

    const dayDifference = (startOfDay(date).getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24);
    return timelineView === 'day' ? dayDifference * columnWidth : (dayDifference / 7) * columnWidth;
  }, [columnWidth, rangeStart, timelineView]);

  const visibleKpis = React.useMemo(() => ([
    { label: 'Visible Streams', value: String(filteredTasks.length), sub: 'In current filters', accent: 'text-[var(--color-primary)]' },
    { label: 'Scheduled', value: String(filteredTasks.filter((task) => task.startDate).length), sub: 'With start date', accent: 'text-emerald-500' },
    { label: 'Pending', value: String(filteredTasks.filter((task) => !task.startDate).length), sub: 'Need planning', accent: 'text-orange-500' },
    { label: 'Completed', value: String(filteredTasks.filter((task) => task.status === 'completed').length), sub: 'Closed tasks', accent: 'text-[var(--color-on-surface)]' },
  ]), [filteredTasks]);

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
            <button
              type="button"
              onClick={() => setRangeStart((current) => shiftRange(current, timelineView, -1))}
              className="rounded-lg p-2 text-[var(--color-on-surface-variant)] transition-all hover:bg-[var(--color-surface-container-lowest)] hover:text-[var(--color-on-surface)]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-on-surface)] md:px-4 md:text-xs">
              {formatHeaderLabel(rangeStart, rangeEnd, timelineView)}
            </div>
            <button
              type="button"
              onClick={() => setRangeStart((current) => shiftRange(current, timelineView, 1))}
              className="rounded-lg p-2 text-[var(--color-on-surface-variant)] transition-all hover:bg-[var(--color-surface-container-lowest)] hover:text-[var(--color-on-surface)]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="hidden items-center rounded-xl bg-[var(--color-surface-container-low)] p-1 sm:flex">
            {(['day', 'week', 'month'] as TimelineView[]).map((view) => (
              <button
                key={view}
                type="button"
                onClick={() => setTimelineView(view)}
                className={`rounded-lg px-3 py-2 text-[10px] font-black tracking-wider transition-all duration-300 md:px-5 md:text-xs ${
                  timelineView === view ? 'bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] shadow-sm' : 'text-[var(--color-on-surface-variant)]'
                }`}
              >
                {view.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="mb-8 rounded-[2rem] bg-[var(--color-surface-container-low)] p-5 shadow-[0_20px_40px_rgba(28,27,27,0.04)] md:p-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(180px,0.7fr))_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search tasks, assignees, or tags"
              className="w-full rounded-2xl bg-white px-12 py-4 text-sm font-semibold text-slate-700 outline-none transition-all placeholder:text-slate-300 focus-visible:ring-4 focus-visible:ring-indigo-500/10"
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4">
            <Filter className="h-4 w-4 text-slate-300" />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as Status | 'all')}
              className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4">
            <CalendarRange className="h-4 w-4 text-slate-300" />
            <select
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value as Priority | 'all')}
              className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none"
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="flex items-center justify-between rounded-2xl bg-white px-4 py-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Include Pending</span>
            <input
              type="checkbox"
              checked={includeUnscheduled}
              onChange={(event) => setIncludeUnscheduled(event.target.checked)}
              className="h-4 w-4 accent-[var(--color-primary)]"
            />
          </label>
        </div>
      </section>

      <div className="px-4 md:mx-0 md:px-0">
        <div className="overflow-hidden rounded-3xl bg-[var(--color-surface-container-lowest)] shadow-[0_40px_80px_rgba(28,27,27,0.04)]">
          <div className="overflow-x-auto">
            <div style={{ width: `${TASK_TREE_WIDTH + timelineWidth}px`, minWidth: `${TASK_TREE_WIDTH + timelineWidth}px` }}>
              <div className="flex h-12 bg-[var(--color-surface-container-low)]/60 backdrop-blur-md md:h-16">
                <div className="flex flex-shrink-0 items-center px-6 md:px-8" style={{ width: `${TASK_TREE_WIDTH}px` }}>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)] md:text-[10px]">Task Tree</span>
                </div>
                <div
                  className="relative flex flex-shrink-0"
                  style={{ width: `${timelineWidth}px`, backgroundImage: 'linear-gradient(to right, var(--color-outline-variant) 1px, transparent 1px)', backgroundSize: `${columnWidth}px 100%` }}
                >
                  {columns.map((column) => (
                    <div key={column.key} className="flex flex-shrink-0 items-center justify-center bg-white/20 text-[9px] font-black tracking-widest text-[var(--color-on-surface-variant)]/60 md:text-[10px]" style={{ width: `${columnWidth}px` }}>
                      {column.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col">
                {filteredTasks.map((task) => {
                  const Icon = task.metadata?.icon === 'history' ? Database : task.metadata?.icon === 'chat_bubble' ? Flag : GitBranch;
                  const isCompleted = task.status === 'completed';
                  const startDate = getTaskDate(task.startDate);
                  const dueDate = getTaskDate(task.dueDate);
                  const isPending = !startDate;

                  let left = 0;
                  let width = columnWidth;

                  if (startDate) {
                    const rawLeft = getPixels(startDate);
                    const rawEnd = getPixels(dueDate ?? startDate) + columnWidth;
                    left = Math.max(0, rawLeft);
                    width = Math.max(32, rawEnd - left);
                  }

                  return (
                    <div key={task.id} className={`group flex min-h-[84px] transition-all duration-300 hover:bg-[var(--color-surface-container-low)] md:min-h-[96px] ${isCompleted ? 'grayscale opacity-60 hover:opacity-100 hover:grayscale-0' : ''}`}>
                      <div className="flex flex-shrink-0 items-center px-6 py-3 md:px-8 md:py-4" style={{ width: `${TASK_TREE_WIDTH}px` }}>
                        <div className="flex min-w-0 items-start gap-2 md:gap-4">
                          <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl md:h-10 md:w-10 ${isCompleted ? 'bg-slate-300 text-slate-600' : task.priority === 'High' ? 'bg-orange-500/10 text-orange-600' : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'}`}>
                            <Icon className="h-4 w-4 md:h-5 md:w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span
                              className="block overflow-hidden text-xs font-black leading-tight tracking-tight text-[var(--color-on-surface)] md:text-sm"
                              style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflowWrap: 'anywhere',
                              }}
                            >
                              {task.title}
                            </span>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              <span className="rounded-full bg-[var(--color-surface-container-low)] px-2 py-1 text-[9px] font-black uppercase leading-none tracking-[0.14em] text-[var(--color-on-surface-variant)] md:text-[10px]">
                                {task.priority}
                              </span>
                              <span className="rounded-full bg-[var(--color-surface-container-low)] px-2 py-1 text-[9px] font-black uppercase leading-none tracking-[0.14em] text-[var(--color-on-surface-variant)] md:text-[10px]">
                                {task.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="relative flex-shrink-0 overflow-hidden"
                        style={{ width: `${timelineWidth}px`, backgroundImage: 'linear-gradient(to right, var(--color-outline-variant) 1px, transparent 1px)', backgroundSize: `${columnWidth}px 100%` }}
                      >
                        {isPending ? (
                          <div className="absolute left-[10px] top-4 flex h-7 items-center rounded-full bg-[var(--color-surface-container-highest)] px-4 text-[9px] font-bold text-[var(--color-on-surface-variant)] shadow-sm md:top-6 md:h-8">
                            Pending scheduling
                          </div>
                        ) : (
                          <div
                            className={`absolute top-4 h-7 overflow-hidden rounded-full shadow-inner transition-all md:top-6 md:h-8 ${isCompleted ? 'bg-slate-100' : 'bg-[var(--color-surface-container-low)]'}`}
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

                {filteredTasks.length === 0 && (
                  <div className="flex h-32 items-center justify-center text-sm font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] md:h-48">
                    No tasks match the current timeline filters
                  </div>
                )}

                <div className="flex h-16 bg-slate-50/30 md:h-20">
                  <div style={{ width: `${TASK_TREE_WIDTH}px` }}></div>
                  <div style={{ width: `${timelineWidth}px`, backgroundImage: 'linear-gradient(to right, var(--color-outline-variant) 2px, transparent 2px)', backgroundSize: `${columnWidth}px 100%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:mt-12 md:grid-cols-4 md:gap-8">
        {visibleKpis.map((kpi) => (
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
