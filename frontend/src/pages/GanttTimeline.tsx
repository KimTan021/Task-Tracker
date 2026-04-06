import React from 'react';
import { GitBranch, Flag, Database, AlertCircle, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';

export const GanttTimeline: React.FC = () => {
  return (
    <div className="w-full pb-10 max-w-[1600px] mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6 md:gap-8">
        <div className="animate-fade-in-up">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <div className="px-3 py-1 rounded-md bg-[var(--color-primary)] text-white text-[10px] font-black tracking-[0.2em] uppercase shadow-lg shadow-[var(--color-primary)]/20">Release 2.4</div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/30 text-[10px] font-black shadow-sm">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
              <span className="text-[var(--color-on-surface-variant)] uppercase tracking-wider">Operational</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-display text-[var(--color-on-surface)] tracking-tighter mb-1 md:mb-2 italic">Timeline.</h1>
          <p className="text-sm md:text-base text-[var(--color-on-surface-variant)] font-medium opacity-70">Strategic Product Roadmap & Infrastructure</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 md:gap-4 animate-fade-in-up delay-100">
           <div className="flex items-center bg-[var(--color-surface-container-low)] p-1 rounded-xl border border-[var(--color-outline-variant)]/20">
              <button className="p-2 rounded-lg hover:bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)] transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <div className="px-3 md:px-4 text-[10px] md:text-xs font-bold text-[var(--color-on-surface)] uppercase tracking-widest">Oct — Nov</div>
              <button className="p-2 rounded-lg hover:bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)] transition-colors"><ChevronRight className="w-4 h-4" /></button>
           </div>
           
           <div className="hidden sm:flex items-center bg-[var(--color-surface-container-low)] p-1 rounded-xl border border-[var(--color-outline-variant)]/20">
              {['Day', 'Week', 'Month'].map((view, i) => (
                <button key={view} className={`px-3 md:px-5 py-2 rounded-lg text-[10px] md:text-xs font-black tracking-wider transition-all duration-300 ${i === 1 ? 'bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] shadow-sm' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}>
                  {view.toUpperCase()}
                </button>
              ))}
           </div>

           <button className="p-2.5 md:p-3 rounded-xl bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)]/30 shadow-sm hover:-translate-y-1 transition-all">
              <Share2 className="w-4 h-4 md:w-5 md:h-5" />
           </button>
        </div>
      </div>

      {/* Timeline container — horizontally scrollable */}
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl md:rounded-3xl shadow-[0_40px_80px_rgba(28,27,27,0.04)] border border-[var(--color-outline-variant)]/50 overflow-hidden flex flex-col animate-fade-in-up delay-200 min-w-[800px]">
          {/* Header Grid */}
          <div className="flex h-12 md:h-16 border-b border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-container-low)]/50 backdrop-blur-md">
            <div className="w-48 md:w-72 lg:w-96 flex-shrink-0 px-4 md:px-8 flex items-center border-r border-[var(--color-outline-variant)]/30">
              <span className="text-[9px] md:text-[10px] font-black tracking-[0.2em] text-[var(--color-on-surface-variant)] uppercase">Task Tree</span>
            </div>
            <div 
              className="flex-grow flex overflow-x-auto no-scrollbar relative"
              style={{ backgroundImage: 'linear-gradient(to right, var(--color-outline-variant) 1px, transparent 1px)', backgroundSize: '120px 100%' }}
            >
              {['OCT 02', 'OCT 09', 'OCT 16', 'OCT 23', 'OCT 30', 'NOV 06', 'NOV 13', 'NOV 20'].map(date => (
                <div key={date} className="flex-shrink-0 w-[120px] flex items-center justify-center text-[9px] md:text-[10px] font-black tracking-widest text-[var(--color-on-surface-variant)]/60 bg-white/20">{date}</div>
              ))}
            </div>
          </div>

          {/* Content Rows */}
          <div className="flex flex-col">
            {/* Row 1 */}
            <div className="flex h-16 md:h-20 group hover:bg-[var(--color-surface-container-low)] transition-all duration-300">
              <div className="w-48 md:w-72 lg:w-96 flex-shrink-0 px-4 md:px-8 flex items-center justify-between border-r border-[var(--color-outline-variant)]/30">
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                    <GitBranch className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs md:text-sm font-black text-[var(--color-on-surface)] tracking-tight truncate block">Design System Core</span>
                    <p className="text-[9px] md:text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase opacity-60">Architecture</p>
                  </div>
                </div>
                <img alt="user" className="hidden md:block w-6 h-6 rounded-full ring-2 ring-[var(--color-surface-container-lowest)] object-cover shadow-sm" src="https://i.pravatar.cc/100?img=32" />
              </div>
              <div className="flex-grow relative overflow-hidden" style={{ backgroundImage: 'linear-gradient(to right, var(--color-outline-variant) 1px, transparent 1px)', backgroundSize: '120px 100%' }}>
                <div className="absolute top-4 md:top-6 left-[120px] w-[300px] md:w-[360px] h-7 md:h-8 bg-[var(--color-surface-container-low)] rounded-full overflow-hidden cursor-pointer group/bar border border-[var(--color-outline-variant)]/20 shadow-inner">
                  <div className="h-full bg-kinetic-animate w-[75%] rounded-full shadow-[0_0_20px_var(--color-primary)]/30 relative">
                     <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                  <span className="absolute top-1/2 left-4 md:left-6 -translate-y-1/2 text-[8px] md:text-[9px] font-black tracking-[0.2em] text-white drop-shadow-md">75%</span>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex h-16 md:h-20 group hover:bg-[var(--color-surface-container-low)] transition-all duration-300">
              <div className="w-48 md:w-72 lg:w-96 flex-shrink-0 px-4 md:px-8 flex items-center justify-between border-r border-[var(--color-outline-variant)]/30">
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                    <Flag className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs md:text-sm font-black text-[var(--color-on-surface)] tracking-tight truncate block">Alpha Review</span>
                    <p className="text-[9px] md:text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase opacity-60">Milestone</p>
                  </div>
                </div>
              </div>
              <div className="flex-grow relative flex items-center overflow-visible" style={{ backgroundImage: 'linear-gradient(to right, var(--color-outline-variant) 1px, transparent 1px)', backgroundSize: '120px 100%' }}>
                <div className="absolute left-[480px] group/milestone z-10 cursor-pointer">
                   <div className="w-1 flex h-14 bg-orange-600/20 absolute -top-10 left-1/2 -translate-x-1/2 border-r-2 border-orange-500/40 border-dashed"></div>
                   <div className="w-7 h-7 md:w-8 md:h-8 bg-orange-500 rotate-45 flex items-center justify-center shadow-[0_10px_20px_rgba(249,115,22,0.3)] animate-pulse">
                      <Flag className="w-3 h-3 md:w-4 md:h-4 text-white -rotate-45" />
                   </div>
                   <div className="absolute top-12 left-1/2 -translate-x-1/2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 p-3 bg-[var(--color-on-surface)] text-white text-[10px] font-bold rounded-xl shadow-2xl z-20 pointer-events-none whitespace-nowrap">
                     <p className="tracking-widest uppercase mb-1 opacity-50">Q3 Milestone</p>
                     Oct 28 — Alpha Freeze
                   </div>
                </div>
              </div>
            </div>
            
            {/* Row 3 */}
            <div className="flex h-16 md:h-20 group hover:bg-[var(--color-surface-container-low)] transition-all duration-300">
              <div className="w-48 md:w-72 lg:w-96 flex-shrink-0 px-4 md:px-8 flex items-center justify-between border-r border-[var(--color-outline-variant)]/30">
                <div className="flex items-center gap-2 md:gap-4 pl-4 md:pl-10 border-l-4 border-emerald-500/20 py-2">
                  <div className="min-w-0">
                    <span className="text-xs md:text-sm font-bold text-[var(--color-on-surface-variant)] tracking-tight italic truncate block">Header Scaffold</span>
                    <p className="text-[9px] font-black text-emerald-600 uppercase mt-0.5">Pending</p>
                  </div>
                </div>
              </div>
              <div className="flex-grow relative overflow-hidden" style={{ backgroundImage: 'linear-gradient(to right, var(--color-outline-variant) 1px, transparent 1px)', backgroundSize: '120px 100%' }}>
                <div className="absolute top-4 md:top-6 left-[280px] w-[200px] md:w-[240px] h-7 md:h-8 bg-[var(--color-surface-container-high)] rounded-full cursor-pointer group-hover:shadow-lg transition-all border border-[var(--color-outline-variant)]/30 overflow-hidden">
                  <div className="h-full bg-emerald-500/60 w-[45%] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
                </div>
                <div className="absolute top-1 md:top-2 left-[490px] md:left-[530px] flex items-center gap-1 md:gap-2 text-rose-600 animate-pulse bg-rose-50 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md border border-rose-100">
                  <AlertCircle className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-tighter">Risk: Nov 02</span>
                </div>
              </div>
            </div>

            {/* Row 4 */}
            <div className="flex h-16 md:h-20 group hover:bg-[var(--color-surface-container-low)] transition-all duration-300 italic opacity-60 hover:opacity-100 grayscale hover:grayscale-0">
              <div className="w-48 md:w-72 lg:w-96 flex-shrink-0 px-4 md:px-8 flex items-center justify-between border-r border-[var(--color-outline-variant)]/30">
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-300 flex items-center justify-center text-slate-600">
                    <Database className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="min-w-0">
                     <span className="text-xs md:text-sm font-black text-[var(--color-on-surface)] tracking-tight truncate block">Cloud Node</span>
                     <p className="text-[9px] md:text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase">Infra</p>
                  </div>
                </div>
              </div>
              <div className="flex-grow relative overflow-hidden" style={{ backgroundImage: 'linear-gradient(to right, var(--color-outline-variant) 1px, transparent 1px)', backgroundSize: '120px 100%' }}>
                <div className="absolute top-4 md:top-6 left-[540px] w-[250px] md:w-[300px] h-7 md:h-8 bg-slate-100 rounded-full border-2 border-slate-200 border-dashed group-hover:border-solid transition-all">
                  <div className="h-full bg-slate-400 w-[12%] rounded-full opacity-40"></div>
                </div>
              </div>
            </div>
            
            {/* Empty Padding */}
            <div className="flex h-16 md:h-20 bg-slate-50/30">
              <div className="w-48 md:w-72 lg:w-96 border-r border-[var(--color-outline-variant)]/30"></div>
              <div className="flex-grow" style={{ backgroundImage: 'linear-gradient(to right, var(--color-outline-variant) 2px, transparent 2px)', backgroundSize: '120px 100%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Footer */}
      <div className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 animate-fade-in-up delay-400">
         {[
           { label: 'Active Streams', val: '12', sub: '+2 nodes', color: '[var(--color-primary)]' },
           { label: 'System Health', val: '98%', sub: 'High Stability', color: 'emerald-500' },
           { label: 'Infrastructure', val: '40', sub: 'Nodes globally', color: 'orange-500' },
           { label: 'Sprint Cycle', val: 'V2', sub: '4 days left', color: '[var(--color-on-surface)]' }
         ].map((kpi, idx) => (
           <div key={idx} className="p-5 md:p-8 bg-[var(--color-surface-container-lowest)] rounded-2xl md:rounded-3xl shadow-[0_10px_30px_rgba(28,27,27,0.02)] border border-[var(--color-outline-variant)]/20 hover:border-[var(--color-primary)]/30 transition-all group overflow-hidden relative">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${kpi.color}/5 rounded-full -mr-10 -mt-10 blur-3xl group-hover:scale-150 transition-transform duration-700`}></div>
              <p className="text-[9px] md:text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-[0.15em] md:tracking-[0.2em] mb-2 md:mb-3">{kpi.label}</p>
              <div className="flex items-end gap-2 md:gap-3 relative z-10">
                <span className="text-2xl md:text-4xl font-black font-display tracking-tighter">{kpi.val}</span>
                <span className={`text-[10px] md:text-[11px] font-black text-${kpi.color} mb-0.5 md:mb-1.5 uppercase`}>{kpi.sub}</span>
              </div>
           </div>
         ))}
      </div>
      
      <div className="mt-8 md:mt-12 p-1 bg-gradient-to-r from-transparent via-[var(--color-outline-variant)]/20 to-transparent"></div>
    </div>
  );
};
