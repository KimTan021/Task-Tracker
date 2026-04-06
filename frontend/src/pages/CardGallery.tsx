import React from 'react';
import { Grid, List, Download, FileText, Layout, Image as ImageIcon, Search, Plus } from 'lucide-react';

const mockAssets = [
  {
    id: 'a1', title: 'Brand Identity v2.1', type: 'PDF Asset', size: '24.5 MB',
    status: 'Approved', img: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800',
    viewers: [
      'https://i.pravatar.cc/100?img=1',
      'https://i.pravatar.cc/100?img=2'
    ],
    commented: true,
    fileIcon: FileText
  },
  {
    id: 'a2', title: 'Onboarding Flow', type: 'FIG File', size: 'Figma',
    status: 'Reviewing', img: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800',
    viewers: ['https://i.pravatar.cc/100?img=3'],
    commented: false,
    fileIcon: Layout
  },
  {
    id: 'a3', title: 'System Icons v4', type: 'SVG Collection', size: '2.1 MB',
    status: 'Reviewing', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    viewers: ['https://i.pravatar.cc/100?img=4'],
    commented: true,
    fileIcon: ImageIcon
  },
  {
    id: 'a4', title: 'Motion Library', type: 'MP4 Video', size: '128 MB',
    status: 'Draft', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
    viewers: ['https://i.pravatar.cc/100?img=5'],
    commented: false,
    fileIcon: ImageIcon
  }
];

export const CardGallery: React.FC = () => {
  return (
    <div className="max-w-[1600px] mx-auto pb-10 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-outline-variant)] mb-4">
             <ImageIcon className="w-3.5 h-3.5 text-[var(--color-primary)]" />
             <span className="text-[10px] font-black tracking-widest text-[var(--color-primary)] uppercase">Asset Repository v2</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-display text-[var(--color-on-surface)] tracking-tighter mb-1 md:mb-2 italic">Gallery.</h1>
          <p className="text-sm md:text-base text-[var(--color-on-surface-variant)] font-medium opacity-70">Unified Visual Language & Prototype Archive</p>
        </div>
        
        <div className="flex items-center gap-4 animate-fade-in-up delay-100">
           <div className="flex items-center bg-[var(--color-surface-container-low)] p-1 rounded-xl border border-[var(--color-outline-variant)]">
              <button className="bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] px-5 py-2.5 rounded-lg shadow-sm text-xs font-black tracking-wider flex items-center gap-2">
                <Grid className="w-4 h-4" /> GRID
              </button>
              <button className="text-[var(--color-on-surface-variant)] px-5 py-2.5 rounded-lg text-xs font-black tracking-wider flex items-center gap-2 hover:text-[var(--color-on-surface)] transition-all">
                <List className="w-4 h-4" /> LIST
              </button>
           </div>
           
           <div className="h-8 w-px bg-[var(--color-outline-variant)]/40 mx-2"></div>
           
           <button className="p-3 rounded-xl bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)]/30 shadow-sm hover:-translate-y-1 transition-all">
              <Search className="w-5 h-5" />
           </button>
           
           <button className="p-3 rounded-xl bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20 hover:-translate-y-1 active:translate-y-0 transition-all">
              <Plus className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
        {mockAssets.map((asset, idx) => {
          const Icon = asset.fileIcon;
          return (
            <div key={asset.id} 
              className="group bg-[var(--color-surface-container-lowest)] rounded-[2rem] overflow-hidden border border-[var(--color-outline-variant)] hover:shadow-[0_40px_80px_rgba(28,27,27,0.08)] hover:-translate-y-2 transition-all duration-500 animate-fade-in-up flex flex-col cursor-pointer"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-container-low)]">
                <img alt={asset.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out grayscale-[20%] group-hover:grayscale-0" src={asset.img} />
                
                {/* Status Badge */}
                <div className="absolute top-5 left-5">
                  <span className={`
                    text-[9px] font-black px-3 py-1 rounded-full tracking-[0.2em] uppercase shadow-lg backdrop-blur-md border border-white/20
                    ${asset.status === 'Approved' ? 'bg-emerald-500 text-white' : asset.status === 'Reviewing' ? 'bg-orange-500 text-white' : 'bg-slate-500 text-white'}
                  `}>
                    {asset.status}
                  </span>
                </div>
                
                {/* Action Overlay */}
                <div className="absolute inset-0 bg-[var(--color-on-surface)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                   <button className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/30 shadow-2xl hover:scale-110 transition-transform duration-300">
                      <Download className="w-6 h-6" />
                   </button>
                </div>
              </div>
              
              <div className="p-5 md:p-7 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="max-w-[70%]">
                    <h3 className="font-display font-black text-lg md:text-xl text-[var(--color-on-surface)] leading-tight mb-2 group-hover:text-[var(--color-primary)] transition-colors">{asset.title}</h3>
                    <div className="flex items-center gap-2">
                       <Icon className="w-3.5 h-3.5 text-[var(--color-on-surface-variant)]" />
                       <span className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-[0.2em] opacity-60">
                         {asset.type}
                       </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] px-3 py-1.5 rounded-xl border border-[var(--color-outline-variant)]/20 shadow-sm">
                    {asset.size}
                  </span>
                </div>
                
                <div className="mt-auto pt-6 flex items-center justify-between border-t border-[var(--color-outline-variant)]">
                  <div className="flex -space-x-2">
                    {asset.viewers.map((avatar, vIdx) => (
                      <div key={vIdx} className="w-8 h-8 rounded-full border-2 border-[var(--color-surface-container-lowest)] overflow-hidden shadow-sm group-hover:ring-2 group-hover:ring-[var(--color-primary)]/20 transition-all">
                        <img className="w-full h-full object-cover" src={avatar} alt="viewer" />
                      </div>
                    ))}
                  </div>
                  
                  {asset.commented ? (
                    <div className="flex items-center gap-2 text-[var(--color-primary)] text-[10px] font-black uppercase tracking-widest bg-[var(--color-primary)]/5 px-3 py-1.5 rounded-lg border border-[var(--color-primary)]/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)]"></span>
                      Interactive
                    </div>
                  ) : (
                     <div className="flex items-center gap-2 text-[var(--color-on-surface-variant)] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 opacity-40">
                      Vaulted
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Skeleton/Placeholder to emphasize grid */}
        <div className="rounded-[2rem] border-2 border-dashed border-[var(--color-outline-variant)]/20 flex flex-col items-center justify-center p-12 group cursor-pointer hover:bg-[var(--color-surface-container-low)] transition-all">
           <div className="w-16 h-16 rounded-3xl bg-[var(--color-surface-container-low)] flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform shadow-sm border border-[var(--color-outline-variant)]/10">
              <Plus className="w-8 h-8 text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)]" />
           </div>
           <p className="text-xs font-black text-[var(--color-on-surface-variant)] uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">Deploy Asset</p>
        </div>
      </div>
    </div>
  );
};
