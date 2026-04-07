import React from 'react';
import { Grid, List, Download, FileText, Layout, Image as ImageIcon, Search, Plus } from 'lucide-react';
import { useTaskStore } from '../hooks/useTaskStore';
import { useProjectStore } from '../hooks/useProjectStore';

export const CardGallery: React.FC = () => {
  const { tasks, fetchTasks } = useTaskStore();
  const { currentProject } = useProjectStore();

  React.useEffect(() => {
    void fetchTasks(currentProject?.projectId);
  }, [currentProject, fetchTasks]);

  return (
    <div className="mx-auto max-w-[1600px] animate-fade-in-up pb-10">
      <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 px-3 py-1">
            <ImageIcon className="h-3.5 w-3.5 text-[var(--color-primary)]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">
              {currentProject?.projectName || 'Task Visualizer'}
            </span>
          </div>
          <h1 className="mb-1 text-3xl font-display font-black italic tracking-tighter text-[var(--color-on-surface)] md:mb-2 md:text-5xl">Gallery.</h1>
          <p className="text-sm font-medium text-[var(--color-on-surface-variant)] opacity-70 md:text-base">
            A visual browse view of tasks in the selected project.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-xl bg-[var(--color-surface-container-low)] p-1">
            <button type="button" className="flex items-center gap-2 rounded-lg bg-[var(--color-surface-container-lowest)] px-5 py-2.5 text-xs font-black tracking-wider text-[var(--color-on-surface)] shadow-sm">
              <Grid className="h-4 w-4" /> GRID
            </button>
            <button type="button" disabled title="List view is not available yet" className="flex cursor-not-allowed items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-black tracking-wider text-[var(--color-on-surface-variant)]/45">
              <List className="h-4 w-4" /> LIST
            </button>
          </div>

          <div className="mx-2 h-8 w-px bg-[var(--color-outline-variant)]/40"></div>

          <button type="button" disabled title="Search is not available yet" className="cursor-not-allowed rounded-xl bg-[var(--color-surface-container-lowest)] p-3 text-[var(--color-on-surface)]/45 shadow-sm">
            <Search className="h-5 w-5" />
          </button>

          <button type="button" disabled title="Asset creation is not available yet" className="cursor-not-allowed rounded-xl bg-[var(--color-primary)] p-3 text-white/70 shadow-lg shadow-[var(--color-primary)]/20">
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
        {tasks.map((asset, index) => {
          const Icon = asset.metadata?.icon === 'chat_bubble' ? FileText : asset.metadata?.icon === 'history' ? Layout : ImageIcon;

          return (
            <div
              key={asset.id}
              className={`group flex cursor-pointer flex-col overflow-hidden rounded-[2rem] bg-[var(--color-surface-container-lowest)] shadow-[0_24px_48px_rgba(28,27,27,0.05)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(28,27,27,0.08)] animate-fade-in-up ${asset.status === 'completed' ? 'grayscale-[0.8] opacity-70 hover:grayscale-0 hover:opacity-100' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-container-low)]">
                <img alt={asset.title} className="h-full w-full object-cover grayscale-[20%] transition-transform duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0" src={`https://picsum.photos/seed/task_${asset.id}/800/600`} />

                <div className="absolute left-5 top-5">
                  <span
                    className={`rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white shadow-lg backdrop-blur-md ${
                      asset.status === 'completed' ? 'bg-emerald-500' : asset.status === 'review' ? 'bg-orange-500' : 'bg-slate-500'
                    }`}
                  >
                    {asset.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-on-surface)]/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 backdrop-blur-[2px]">
                  <button type="button" disabled title="Downloads are not available yet" className="flex h-14 w-14 cursor-not-allowed items-center justify-center rounded-2xl bg-white/20 text-white shadow-2xl">
                    <Download className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5 md:p-7">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 text-left">
                    <h3 className="mb-2 line-clamp-2 text-lg font-display font-black leading-tight text-[var(--color-on-surface)] transition-colors group-hover:text-[var(--color-primary)] md:text-xl">
                      {asset.title}
                    </h3>
                    <div className="flex min-w-0 items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-[var(--color-on-surface-variant)]" />
                      <span className="truncate text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)] opacity-60">
                        {asset.priority} Priority
                      </span>
                    </div>
                  </div>

                  <span className="max-w-[44%] shrink-0 rounded-xl bg-[var(--color-surface-container-low)] px-3 py-1.5 text-right text-[10px] font-black leading-tight text-[var(--color-on-surface-variant)] shadow-sm [overflow-wrap:anywhere]">
                    {asset.metadata?.text || 'No date'}
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between rounded-2xl bg-[var(--color-surface-container-low)] px-4 py-3">
                  <div className="flex -space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[10px] font-bold text-[var(--color-primary)]">
                      {asset.assigneeName?.[0] || 'U'}
                    </div>
                  </div>

                  {asset.status === 'in_progress' ? (
                    <div className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)]/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)]"></span>
                      Interactive
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)] opacity-40">
                      Vaulted
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div className="group flex min-h-[300px] flex-col items-center justify-center rounded-[2rem] bg-[var(--color-surface-container-low)]/70 p-12">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--color-surface-container-lowest)] shadow-sm">
            <Plus className="h-8 w-8 text-[var(--color-on-surface-variant)]" />
          </div>
          <p className="text-center text-xs font-black uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)] opacity-50">
            Asset creation coming soon
          </p>
        </div>
      </div>
    </div>
  );
};
