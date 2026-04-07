import React, { useEffect, useState } from 'react';
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, closestCorners, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Clock, GripVertical, MessageCircle, Pencil, PlusCircle, Search } from 'lucide-react';
import { TaskEditorModal } from '../components/TaskEditorModal';
import { useTaskStore, type Status, type Task } from '../hooks/useTaskStore';
import { useProjectStore } from '../hooks/useProjectStore';

const columns: { id: Status; title: string; badgeColor?: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress', badgeColor: 'bg-[var(--color-primary)] text-white shadow-[0_4px_12px_rgba(53,37,205,0.3)]' },
  { id: 'review', title: 'Review' },
  { id: 'completed', title: 'Completed', badgeColor: 'bg-[#b6b4ff] text-[#454386]' },
];

const ColumnHeader: React.FC<{ title: string; count: number; badgeColor?: string; onCreate: () => void }> = ({ title, count, badgeColor = 'bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)]', onCreate }) => (
  <div className="flex justify-between items-center px-4 py-2">
    <div className="flex items-center gap-4">
      <div className={`w-2.5 h-2.5 rounded-full ${title === 'In Progress' ? 'bg-[var(--color-primary)] animate-pulse shadow-[0_0_8px_var(--color-primary)]' : 'bg-[var(--color-outline-variant)]'}`}></div>
      <span className="font-display font-black text-xl tracking-tighter text-[var(--color-on-surface)] uppercase">{title}</span>
      <span className={`${badgeColor} px-3 py-1 rounded-xl text-[10px] font-black tracking-widest shadow-sm border border-white/10`}>{count}</span>
    </div>
    <div className="flex items-center gap-2">
      <button onClick={onCreate} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 shadow-sm group">
        <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
      </button>
    </div>
  </div>
);

const DroppableColumn: React.FC<{ id: Status; children: React.ReactNode }> = ({ id, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[560px] min-w-[310px] flex-col gap-4 rounded-[2rem] p-4 transition-all duration-500 ${
        isOver
          ? 'bg-[rgba(79,70,229,0.08)] shadow-[0_0_0_1px_rgba(79,70,229,0.08),0_18px_38px_rgba(53,37,205,0.08)]'
          : 'bg-[var(--color-surface-container-low)] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]'
      }`}
    >
      {children}
    </div>
  );
};

const priorityClasses: Record<string, string> = {
  High: 'bg-rose-50 text-rose-600',
  Medium: 'bg-indigo-50 text-indigo-600',
  Low: 'bg-slate-100 text-slate-500',
};

const KanbanCard: React.FC<{ task: Task; index: number; isOverlay?: boolean; onEdit?: (task: Task) => void }> = ({ task, index, isOverlay, onEdit }) => {
  const isCompleted = task.status === 'completed';
  const isHighPriority = task.priority === 'High';
  const Icon = task.metadata.icon === 'history' ? Clock : task.metadata.icon === 'chat_bubble' ? MessageCircle : Calendar;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id, data: { status: task.status, task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const statusColor = task.status === 'todo' ? 'var(--status-todo)' : 
                      task.status === 'in_progress' ? 'var(--status-progress)' : 
                      task.status === 'review' ? 'var(--status-review)' : 
                      'var(--status-completed)';
  const visibleTags = task.tags.slice(0, 2);
  const extraTagCount = Math.max(task.tags.length - visibleTags.length, 0);
  const dueLabel = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'Flexible';

  return (
    <div
      ref={setNodeRef}
      className={`
        relative overflow-hidden rounded-[1.75rem] p-5 md:p-6 transition-all duration-500 group hover-card
        ${isOverlay ? 'shadow-2xl scale-105 z-50 ring-4 ring-[var(--color-primary)]/20 bg-white' : ''}
        ${isCompleted ? 'bg-[rgba(255,255,255,0.75)] opacity-70 hover:opacity-100' : 'bg-[var(--color-surface-container-lowest)] shadow-[0_18px_40px_rgba(28,27,27,0.05)]'}
        ${isHighPriority && !isCompleted ? 'animate-glow' : ''}
      `}
      style={isOverlay ? style : { animationDelay: `${index * 100}ms`, ...style }}
    >
      {/* Dynamic Accent Bar */}
      <div 
        className="absolute top-0 left-0 bottom-0 w-1.5 transition-all duration-500" 
        style={{ backgroundColor: `hsl(${statusColor})` }}
      ></div>

      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
            <span className={`
                ${priorityClasses[task.priority]} 
                rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em]
            `}>
                {task.priority}
            </span>
            {task.isEditing && (
                <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(53,37,205,0.08)] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-[var(--color-primary)]">
                  <span className="flex h-2 w-2 rounded-full bg-[var(--color-primary)] animate-ping"></span>
                  Live
                </span>
            )}
        </div>
        
        <div className="flex shrink-0 gap-2 opacity-100 md:opacity-0 transition-all duration-500 md:translate-x-4 group-hover:translate-x-0 group-hover:opacity-100">
          <button type="button" onClick={() => onEdit?.(task)} className="p-2.5 rounded-xl bg-[var(--color-surface-container-low)] hover:bg-[var(--color-on-surface)] hover:text-white text-[var(--color-on-surface-variant)] transition-all">
            <Pencil className="w-4 h-4" />
          </button>
          {!isCompleted && (
            <button {...attributes} {...listeners} className="p-2.5 rounded-xl bg-[var(--color-surface-container-low)] hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-on-surface-variant)] cursor-grab active:cursor-grabbing transition-all">
              <GripVertical className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <h4 className={`mb-3 font-display text-lg font-black leading-tight tracking-tight md:text-[1.35rem] ${isCompleted ? 'text-[var(--color-on-surface-variant)] line-through opacity-50' : 'text-[var(--color-on-surface)]'}`}>
        {task.title}
      </h4>

      {task.description && (
        <p className="mb-5 line-clamp-3 text-sm font-medium leading-relaxed text-[var(--color-on-surface-variant)]/78">
          {task.description}
        </p>
      )}

      <div className="mb-6 flex min-h-7 flex-wrap gap-2">
        {visibleTags.map((tag) => (
          <span key={tag} className="rounded-full bg-[var(--color-surface-container-low)] px-3 py-1.5 text-[10px] font-bold text-[var(--color-on-surface-variant)]">
            {tag}
          </span>
        ))}
        {extraTagCount > 0 && (
          <span className="rounded-full bg-[rgba(53,37,205,0.08)] px-3 py-1.5 text-[10px] font-bold text-[var(--color-primary)]">
            +{extraTagCount} more
          </span>
        )}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3 text-left">
        <div className="rounded-2xl bg-[var(--color-surface-container-low)] px-4 py-3">
            <div className="mb-1 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]/55">Assignee</div>
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--color-surface-container-highest)] text-[11px] font-black uppercase text-[var(--color-on-surface)] shadow-sm">
                    {task.assigneeName?.[0] || 'U'}
                </div>
                <span className="min-w-0 truncate text-sm font-semibold text-[var(--color-on-surface)]">
                  {task.assigneeName || 'Unassigned'}
                </span>
            </div>
        </div>

        <div className="rounded-2xl bg-[var(--color-surface-container-low)] px-4 py-3">
          <div className="mb-1 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]/55">Timeline</div>
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-[var(--color-on-surface-variant)] opacity-60" />
            <span className="text-sm font-semibold text-[var(--color-on-surface)]">{dueLabel}</span>
          </div>
        </div>

        <div className="col-span-2 flex items-center justify-between rounded-2xl bg-[rgba(246,243,242,0.75)] px-4 py-3">
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--color-on-surface-variant)]/62">
            {task.status.replace('_', ' ')}
          </span>
          <span className="text-xs font-semibold text-[var(--color-on-surface-variant)]">{task.metadata.text}</span>
        </div>
      </div>
    </div>
  );
};

export const KanbanBoard: React.FC = () => {
  const { currentProject } = useProjectStore();
  const { tasks, error, clearError, fetchTasks, createTask, updateTask, updateTaskStatus, initializeWebSocket, disconnectWebSocket } = useTaskStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [createStatus, setCreateStatus] = useState<Status>('todo');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (currentProject) {
      void fetchTasks(currentProject.projectId);
      initializeWebSocket();
    }
    return () => disconnectWebSocket();
  }, [currentProject, disconnectWebSocket, fetchTasks, initializeWebSocket]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor));
  
  if (!currentProject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <div className="w-24 h-24 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl flex items-center justify-center text-indigo-500 mb-8 animate-bounce-slow">
           <PlusCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-display font-black tracking-tighter text-slate-800 uppercase italic">Awaiting Context<span className="text-indigo-600">.</span></h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">Select or initiate a project to begin workspace allocation</p>
      </div>
    );
  }

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDragStart = (event: any) => {
    const task = tasks.find((item) => item.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    let targetStatus: Status | null = null;
    if (columns.some((column) => column.id === over.id)) {
      targetStatus = over.id as Status;
    } else {
      const overTask = tasks.find((item) => item.id === over.id);
      if (overTask) targetStatus = overTask.status;
    }

    if (targetStatus && active.data.current?.status !== targetStatus) {
      void updateTaskStatus(String(active.id), targetStatus);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-full max-w-[1600px] mx-auto animate-fade-in-up">
        {/* Header Action Area: Balanced & Grouped */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 md:mb-16 w-full gap-8">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 backdrop-blur-md border border-[var(--color-outline-variant)]/20 shadow-sm w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
              <span className="text-[10px] font-black tracking-[0.2em] text-[var(--color-on-surface-variant)] uppercase">Studio Session</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-display text-[var(--color-on-surface)] tracking-tighter">Workspace Board.</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1 max-w-2xl justify-end">
            <div className="relative group flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-[var(--color-on-surface-variant)]/30 group-focus-within:text-[var(--color-primary)] transition-colors" />
                </div>
                <input 
                    type="text"
                    placeholder="Search tasks, tags, or members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-[var(--color-outline-variant)]/40 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/30 focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] transition-all shadow-sm"
                />
            </div>
            <button onClick={() => { setCreateStatus('todo'); setIsCreating(true); }} className="bg-[var(--color-primary)] text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-[0_20px_40px_rgba(53,37,205,0.25)] hover:-translate-y-1 active:translate-y-0 shadow-lg">
              <PlusCircle className="w-5 h-5" />
              <span className="text-sm tracking-tight uppercase font-black">New Task</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-between shadow-sm animate-fade-in-up">
            <div className="flex items-center gap-3">
                <PlusCircle className="w-5 h-5 rotate-45" />
                <span className="font-bold text-sm">{error}</span>
            </div>
            <button type="button" className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors" onClick={clearError}>Dismiss</button>
          </div>
        )}

        {/* Column Grid: Precise Track Alignment */}
        <div className="overflow-x-auto pb-3 custom-scrollbar">
          <div className="grid auto-cols-[minmax(310px,1fr)] grid-flow-col gap-5 items-start min-w-max">
          {columns.map((column, colIdx) => {
            const columnTasks = filteredTasks.filter((task) => task.status === column.id);
            const totalTasks = tasks.filter(t => t.status === column.id).length;
            const progress = totalTasks > 0 ? (columnTasks.length / totalTasks) * 100 : 100;

            return (
              <SortableContext key={column.id} id={column.id} items={columnTasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-8 animate-fade-in-up" style={{ animationDelay: `${colIdx * 150}ms` }}>
                  {/* Fixed Header Alignment Area */}
                  <div className="space-y-4 px-2">
                    <ColumnHeader title={column.title} count={columnTasks.length} badgeColor={column.badgeColor} onCreate={() => { setCreateStatus(column.id); setIsCreating(true); }} />
                    <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden shadow-inner">
                        <div 
                            className="h-full bg-[var(--color-primary)] transition-all duration-1000 ease-out shadow-[0_0_8px_var(--color-primary)]" 
                            style={{ width: `${searchTerm ? progress : 100}%`, opacity: searchTerm ? 1 : 0.4 }}
                        ></div>
                    </div>
                  </div>
                  
                  {/* Task Track: Visual Definition */}
                  <DroppableColumn id={column.id}>
                    {columnTasks.map((task, index) => (
                      <KanbanCard key={task.id} task={task} index={index} onEdit={setEditingTask} />
                    ))}
                    {columnTasks.length === 0 && (
                      <div className="flex flex-1 flex-col items-center justify-center rounded-[1.75rem] bg-[rgba(255,255,255,0.45)] p-10 text-center transition-all opacity-70">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white transition-transform shadow-sm">
                            <PlusCircle className="w-5 h-5 text-[var(--color-outline-variant)]" />
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">{searchTerm ? 'No matches' : 'Drop tasks here'}</span>
                      </div>
                    )}
                  </DroppableColumn>
                </div>
              </SortableContext>
            );
          })}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeTask ? <KanbanCard task={activeTask} index={0} isOverlay /> : null}
      </DragOverlay>

      <TaskEditorModal
        isOpen={isCreating || Boolean(editingTask)}
        mode={editingTask ? 'edit' : 'create'}
        task={editingTask}
        initialStatus={createStatus}
        onClose={() => {
          setIsCreating(false);
          setEditingTask(null);
        }}
        onSubmit={async (input) => {
          if (editingTask) {
            await updateTask(editingTask.id, input);
            setEditingTask(null);
          } else {
            await createTask({ ...input, status: input.status || createStatus });
            setIsCreating(false);
          }
        }}
      />
    </DndContext>
  );
};
