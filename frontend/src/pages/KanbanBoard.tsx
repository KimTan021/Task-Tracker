import React from 'react';
import { useTaskStore, type Task, type Status } from '../hooks/useTaskStore';
import { Clock, MessageCircle, Calendar, MoreHorizontal, Edit3, PlusCircle, Search } from 'lucide-react';

const ColumnHeader: React.FC<{ title: string; count: number; badgeColor?: string }> = ({ title, count, badgeColor = 'bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)]' }) => (
  <div className="flex justify-between items-center px-2 mb-2">
    <div className="flex items-center gap-3">
      <span className="font-display font-extrabold text-lg md:text-xl tracking-tight text-[var(--color-on-surface)]">{title}</span>
      <span className={`${badgeColor} px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider shadow-sm`}>{count}</span>
    </div>
    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-on-surface)] transition-all">
      <MoreHorizontal className="w-5 h-5" />
    </button>
  </div>
);

const KanbanCard: React.FC<{ task: Task; index: number }> = ({ task, index }) => {
  const isCompleted = task.status === 'completed';
  const Icon = task.metadata.icon === 'history' ? Clock : task.metadata.icon === 'chat_bubble' ? MessageCircle : Calendar;
  
  return (
    <div 
      className={`
        p-4 md:p-6 rounded-2xl transition-all duration-300 group relative animate-fade-in-up
        ${isCompleted 
          ? 'bg-[var(--color-surface-container-low)] grayscale-[0.5] opacity-60 hover:opacity-100 hover:grayscale-0' 
          : 'bg-[var(--color-surface-container-lowest)] hover:-translate-y-1.5 shadow-[0_4px_12px_rgba(28,27,27,0.03)] hover:shadow-[0_30px_60px_rgba(28,27,27,0.08)]'
        }
        ${task.isEditing ? 'ring-2 ring-[var(--color-primary)] ring-offset-4 ring-offset-[var(--color-surface)]' : ''}
      `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {task.isEditing && (
        <div className="absolute top-4 right-4 flex items-center gap-2">
           <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest animate-pulse">Live</span>
           <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_12px_var(--color-primary)] block"></span>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4 md:mb-5">
        {isCompleted ? (
          <span className="bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)] text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-[0.1em]">Archive</span>
        ) : (
          <>
            <span className={`
              text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-[0.15em] shadow-sm
              ${task.priority === 'High' 
                ? 'bg-red-50 text-red-600 border border-red-100' 
                : task.priority === 'Medium' 
                  ? 'bg-[#efefff] text-[var(--color-primary)] border border-[#e2e2ff]' 
                  : 'bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)]'
              }
            `}>
              {task.priority}
            </span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
               <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-hover)] text-[var(--color-on-surface-variant)]">
                  <Edit3 className="w-4 h-4" />
               </button>
            </div>
          </>
        )}
      </div>

      <h4 className={`font-display font-bold text-base md:text-lg mb-2 md:mb-3 leading-[1.3] ${isCompleted ? 'text-[var(--color-on-surface-variant)] line-through opacity-60' : 'text-[var(--color-on-surface)]'}`}>
        {task.title}
      </h4>

      {task.description && (
        <p className="text-xs md:text-sm font-medium text-[var(--color-on-surface-variant)]/80 mb-4 md:mb-5 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6">
          {task.tags.map(tag => (
            <span key={tag} className="bg-[var(--color-surface-container-low)] text-[10px] font-bold px-2 py-1 rounded-md text-[var(--color-on-surface-variant)] border border-transparent hover:border-[var(--color-outline-variant)] transition-colors">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-auto pt-3 md:pt-4 border-t border-[var(--color-outline-variant)]">
        <div className="flex -space-x-2">
          {task.assignees.map(user => (
            <div key={user.id} className="relative group/avatar">
              <img src={user.avatar} alt={user.name} className="w-6 h-6 md:w-7 md:h-7 rounded-full ring-2 ring-[var(--color-surface-container-lowest)] object-cover transition-transform group-hover/avatar:-translate-y-1" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--color-on-surface)] text-white text-[10px] font-bold rounded opacity-0 group-hover/avatar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {user.name}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 group/meta cursor-default">
           <div className={`p-1.5 rounded-lg transition-colors ${task.isEditing ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)] group-hover/meta:bg-[var(--color-surface-hover)]'}`}>
              <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
           </div>
           <span className={`text-[10px] md:text-[11px] font-bold tracking-tight ${task.isEditing ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'}`}>
             {task.metadata.text}
           </span>
        </div>
      </div>
    </div>
  );
};

export const KanbanBoard: React.FC = () => {
  const { tasks } = useTaskStore();

  const columns: { id: Status; title: string; badgeColor?: string }[] = [
    { id: 'todo', title: 'Backlog' },
    { id: 'in_progress', title: 'Active', badgeColor: 'bg-[var(--color-primary)] text-white shadow-[0_4px_12px_rgba(53,37,205,0.3)]' },
    { id: 'review', title: 'Review' },
    { id: 'completed', title: 'Finalized', badgeColor: 'bg-[#b6b4ff] text-[#454386]' }
  ];

  return (
    <div className="flex flex-col h-full max-w-[1600px] mx-auto animate-fade-in-up">
      {/* Header & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 w-full gap-4 md:gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/30 mb-3 md:mb-4">
             <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)] animate-pulse"></span>
             <span className="text-[10px] font-black tracking-widest text-[var(--color-on-surface-variant)] uppercase">Live Session: Operational</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-display text-[var(--color-on-surface)] tracking-tighter mb-1 md:mb-2">Workspace Board.</h1>
          <p className="text-sm md:text-base text-[var(--color-on-surface-variant)] flex items-center gap-2 font-medium opacity-70">
            <Clock className="w-4 h-4 hidden md:block" /> System synchronized across 4 nodes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-[var(--color-surface-container-low)] p-1 rounded-xl border border-[var(--color-outline-variant)]">
             <button className="p-2.5 rounded-lg bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] shadow-sm hover:scale-105 transition-transform">
                <Search className="w-5 h-5" />
             </button>
             <div className="h-6 w-px bg-[var(--color-outline-variant)] mx-2"></div>
             <button className="px-5 py-2.5 rounded-lg text-sm font-bold text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
                Filters
             </button>
          </div>
          
          <button className="bg-[var(--color-primary)] text-white font-black py-3 px-4 md:px-8 rounded-xl flex items-center gap-2 md:gap-3 transition-all hover:shadow-[0_20px_40px_rgba(53,37,205,0.3)] hover:-translate-y-1 active:translate-y-0">
            <PlusCircle className="w-5 h-5" />
            <span className="text-sm tracking-tight hidden sm:inline">Create Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Grid — responsive columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 items-start">
        {columns.map((col, colIdx) => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="flex flex-col gap-4 md:gap-8 animate-fade-in-up" style={{ animationDelay: `${colIdx * 150}ms` }}>
              <ColumnHeader title={col.title} count={colTasks.length} badgeColor={col.badgeColor} />
              <div className="flex flex-col gap-3 md:gap-4 min-h-0 lg:min-h-[400px]">
                {colTasks.map((task, taskIdx) => (
                  <KanbanCard key={task.id} task={task} index={taskIdx} />
                ))}
                {colTasks.length === 0 && (
                  <div className="flex-1 min-h-[120px] lg:min-h-0 rounded-2xl border-2 border-dashed border-[var(--color-outline-variant)]/20 flex items-center justify-center p-8 md:p-12 group cursor-pointer hover:bg-[var(--color-surface-container-low)] transition-colors">
                     <PlusCircle className="w-8 h-8 text-[var(--color-outline-variant)] group-hover:text-[var(--color-primary)] transition-colors" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
