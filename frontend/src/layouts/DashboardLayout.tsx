import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { Grid, Bell, Users, Settings, Plus, HelpCircle, Archive, ClipboardList, Layout, Menu, X, ChevronDown, Check, LogOut } from 'lucide-react';
import { useAuthStore } from '../hooks/useAuthStore';
import { useProjectStore } from '../hooks/useProjectStore';
import { ProjectCreationModal } from '../components/ProjectCreationModal';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projectSelectorOpen, setProjectSelectorOpen] = useState(false);
  const [creationModalOpen, setCreationModalOpen] = useState(false);

  const { userId, userName, logout: authLogout } = useAuthStore();
  const { projects, currentProject, fetchProjects, setCurrentProject, reset: resetProjects } = useProjectStore();

  const handleLogout = () => {
    authLogout();
    resetProjects();
  };

  useEffect(() => {
    if (userId) {
      fetchProjects(userId);
    }
  }, [userId, fetchProjects]);

  const NavItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
    <Link 
      to={to}
      onClick={() => setSidebarOpen(false)}
      className={`flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-all relative group ${
        active 
          ? 'bg-[var(--color-surface-container-lowest)] text-[var(--color-primary)] shadow-[0_10px_20px_rgba(53,37,205,0.05)]' 
          : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-on-surface)]'
      }`}
    >
      {active && (
        <span className="absolute left-0 w-1 h-5 bg-[var(--color-primary)] rounded-r-full shadow-[0_0_8px_var(--color-primary)]"></span>
      )}
      <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
      <span className="text-[13px] tracking-tight">{label}</span>
    </Link>
  );

  return (
    <div className="bg-[var(--color-surface)] min-h-screen text-[var(--color-on-surface)] font-sans antialiased overflow-hidden flex selection:bg-[var(--color-primary)] selection:text-white">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-40 flex justify-between items-center px-4 md:px-8 h-16 md:h-20 bg-white/70 backdrop-blur-xl border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-4 md:gap-12">
          {/* Mobile hamburger */}
          <button 
            className="lg:hidden p-2.5 rounded-xl hover:bg-[var(--color-primary)]/10 text-[var(--color-on-surface-variant)] transition-all"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 group translate-y-[-1px]">
            <div className="w-10 h-10 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center text-white shadow-[0_8px_16px_rgba(53,37,205,0.2)] group-hover:rotate-12 transition-transform duration-500">
                <Grid className="w-5 h-5 font-black" />
            </div>
            <span className="text-xl md:text-2xl font-display font-black tracking-tighter text-[var(--color-on-surface)] uppercase italic">Nexus.</span>
          </div>

          {/* Project Selector */}
          <div className="relative">
            <button 
              onClick={() => setProjectSelectorOpen(!projectSelectorOpen)}
              className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-xl transition-all group"
            >
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                {currentProject?.projectName || 'Select Project'}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform duration-300 ${projectSelectorOpen ? 'rotate-180' : ''}`} />
            </button>

            {projectSelectorOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setProjectSelectorOpen(false)}
                />
                <div className="absolute top-full mt-3 left-0 w-64 bg-white rounded-3xl border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.1)] py-4 z-20 animate-scale-in">
                  <div className="px-6 pb-3 border-b border-slate-50 mb-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Flux Channels</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto custom-scrollbar px-2 space-y-1">
                    {projects.map(project => (
                      <button
                        key={project.projectId}
                        onClick={() => {
                          setCurrentProject(project);
                          setProjectSelectorOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                          currentProject?.projectId === project.projectId 
                            ? 'bg-indigo-50 text-indigo-600' 
                            : 'hover:bg-slate-50 text-slate-500'
                        }`}
                      >
                        <span className="text-[11px] font-black uppercase tracking-widest truncate">{project.projectName}</span>
                        {currentProject?.projectId === project.projectId && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                  <div className="px-2 pt-3 mt-3 border-t border-slate-50">
                    <button 
                      onClick={() => {
                        setProjectSelectorOpen(false);
                        setCreationModalOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[var(--color-primary)] hover:bg-indigo-50/50 font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                      <Plus className="w-4 h-4" /> Initiate New Context
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <button className="p-3 rounded-2xl bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-sm relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-3 border-l border-[var(--color-outline-variant)]/30">
            <div className="hidden md:flex flex-col items-end">
                <span className="text-[11px] font-black uppercase tracking-widest text-[var(--color-on-surface)] truncate max-w-[120px]">
                  {userName || 'Kim Tan'}
                </span>
                <span className="text-[9px] font-bold text-[var(--color-on-surface-variant)]/50 uppercase tracking-widest truncate max-w-[120px]">
                   {currentProject?.user.userId === userId ? 'Architect' : 'Collaborator'}
                </span>
            </div>
            <img alt="User profile avatar" className="w-10 h-10 md:w-12 md:h-12 rounded-2xl object-cover border-2 border-white shadow-md transition-transform hover:scale-105" src={`https://i.pravatar.cc/150?u=${userName || 'kim'}`} />
          </div>
        </div>
      </header>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 lg:hidden transition-opacity duration-500"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SideNavBar */}
      <aside className={`
        fixed left-0 top-0 h-full w-72 bg-white/80 backdrop-blur-2xl flex flex-col p-6 pt-24 space-y-3 z-50 border-r border-[var(--glass-border)]
        transition-transform duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275)
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:z-30
      `}>
        {/* Mobile close button */}
        <button 
          className="lg:hidden absolute top-6 right-6 p-2.5 rounded-xl bg-slate-100 text-[var(--color-on-surface-variant)]"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-2 mb-8">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Core Systems</p>
            <nav className="space-y-1.5">
            <NavItem to="/board" icon={ClipboardList} label="Workspace Board" active={currentPath === '/board' || currentPath === '/'} />
            <NavItem to="/timeline" icon={Settings} label="Global Timeline" active={currentPath === '/timeline'} />
            <NavItem to="/gallery" icon={Layout} label="Asset Gallery" active={currentPath === '/gallery'} />
            <NavItem to="/team" icon={Users} label="Collaborators" active={currentPath === '/team'} />
            </nav>
        </div>
        
        <div className="flex-1 px-2 overflow-y-auto custom-scrollbar">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Active Contexts</p>
            <div className="space-y-2">
                {projects.slice(0, 5).map(p => (
                  <button 
                    key={p.projectId}
                    onClick={() => setCurrentProject(p)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
                      currentProject?.projectId === p.projectId 
                        ? 'bg-slate-50 text-[var(--color-primary)]' 
                        : 'text-slate-400 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${currentProject?.projectId === p.projectId ? 'bg-[var(--color-primary)]' : 'bg-slate-200'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest truncate">{p.projectName}</span>
                  </button>
                ))}
            </div>
        </div>
        
        <div className="pt-8 space-y-2 px-2">
          <button 
            onClick={() => setCreationModalOpen(true)}
            className="w-full mb-6 group py-4 px-6 bg-[var(--color-primary)] text-white rounded-[1.25rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:shadow-[0_20px_40px_rgba(53,37,205,0.2)] hover:-translate-y-1 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Initiate Project
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <Link to="#" className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl hover:bg-[var(--color-primary)]/5 transition-all group">
                <HelpCircle className="w-5 h-5 text-slate-400 group-hover:text-[var(--color-primary)] transition-colors mb-1" />
                <span className="text-[9px] font-black uppercase text-slate-500">Support</span>
            </Link>
            <Link to="#" className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl hover:bg-[var(--color-primary)]/5 transition-all group">
                <Archive className="w-5 h-5 text-slate-400 group-hover:text-[var(--color-primary)] transition-colors mb-1" />
                <span className="text-[9px] font-black uppercase text-slate-500">Vault</span>
            </Link>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 font-bold transition-all mt-4 border border-transparent hover:border-rose-100"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[13px] tracking-tight">Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="ml-0 lg:ml-72 pt-24 md:pt-32 p-6 md:p-12 min-h-screen w-full flex-1 overflow-x-hidden bg-[#fcf9f8]/30">
        <Outlet />
      </main>

      <ProjectCreationModal 
        isOpen={creationModalOpen} 
        onClose={() => setCreationModalOpen(false)} 
      />
    </div>
  );
};
