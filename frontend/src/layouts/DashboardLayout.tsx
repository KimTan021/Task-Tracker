import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { Button } from '../components/Button';
import { Grid, Search, Bell, Users, Settings, Plus, HelpCircle, Archive, ClipboardList, Layout, Menu, X } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="bg-[var(--color-surface)] min-h-screen text-[var(--color-on-surface)] font-sans antialiased overflow-hidden flex">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-40 flex justify-between items-center px-4 md:px-6 h-14 md:h-16 bg-[var(--color-surface)] bg-opacity-95 backdrop-blur-md">
        <div className="flex items-center gap-4 md:gap-8">
          {/* Mobile hamburger */}
          <button 
            className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-on-surface-variant)] transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <span className="text-lg md:text-xl font-display font-extrabold tracking-tighter text-[var(--color-on-surface)]">Nexus Flow</span>
          
          {/* Desktop search */}
          <div className="hidden lg:flex items-center bg-[var(--color-surface-container-low)] px-4 py-2 border-b-2 border-transparent focus-within:border-[var(--color-primary)] focus-within:bg-[var(--color-surface-container-highest)]/50 transition-all duration-300 w-80 group">
            <Search className="w-4 h-4 text-[var(--color-on-surface-variant)] group-focus-within:text-[var(--color-primary)] transition-colors" />
            <input 
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-[var(--color-on-surface-variant)]/50 outline-none font-medium ml-1" 
              placeholder="Search tasks, teams, projects..." 
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop-only avatar group */}
          <div className="hidden md:flex -space-x-2 mr-2">
            <img className="w-8 h-8 rounded-full ring-2 ring-[var(--color-surface)] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp9cFIHvO74r9fokVPodBjDpyIuvVSpQxgq4aebYyBChMESNJx9QEM5qDOmag0ExRulBVeoxpIeV6ZjR57F3X1j13V7knMuhVze3w3RMVHHbqwCFZissySJ8A0F1p2zSJfX4DJbTDF3mi70sNf0mp91Gw3rIHFoNW-GXei5gKuMNRF3Af4qJrlypKsrwoTy1SH6oLj19UIwdc5HA1yjwnJJn8l4xDkXswvsIvMOY5ydNQgEHm6Rtyb8_idVecmfEJR78hw4-cD2TE"/>
            <img className="w-8 h-8 rounded-full ring-2 ring-[var(--color-surface)] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCM9pELMjYTHjf2bQHp9oD-Nzg2VvPWnxzzU6bwHweKqo1BM3fhAnw0iBTe4UpKuYM2GzOpqK63SgOnGhMxC72HUdjyTVA5d-Kwc1hKyH--Rl6eakd7yti20Ruz2b_xUb0K66LECzHdcgI4VABZf3bbYOhv4GLLz_daiZ2lx7wK7ZCrX3aTzYIVaeXjUR8xn8nF9UH8MjUieAiTqezDRVCHEL8f_RS26eKuENWnSkatVHu2szWy9gRd7cFu68PnKRBduhGPe1GjikY"/>
            <div className="w-8 h-8 rounded-full ring-2 ring-[var(--color-surface)] bg-[#b6b4ff] flex items-center justify-center text-[10px] font-bold text-[var(--color-on-surface)]">+4</div>
          </div>

          {/* Mobile search toggle */}
          <button className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-surface-container-low)] transition-colors text-[var(--color-on-surface-variant)]">
            <Search className="w-5 h-5" />
          </button>
          
          <button className="p-2 rounded-lg hover:bg-[var(--color-surface-container-low)] transition-colors text-[var(--color-on-surface-variant)]">
            <Bell className="w-5 h-5" />
          </button>
          <img alt="User profile avatar" className="w-8 h-8 md:w-9 md:h-9 rounded-lg object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMByxZi2k7xsjXvwc8jYh1emwv5Xv1xiiGKqH2jIqCNMaIdP2d5lFM09OtF2JMFLVbXd-dYjbxr-MZXGOCQjXtrlOacb6EA5vhWl5QkDhEPp8N5P2D2aE11H0byL5b18Y6hkUBkz1ZF1X7B9vEaZpWZ9bM67dBOWpqFOZM2CRKlLZ3dF33YuUoIEmFJJo-OfL2kKa3P8-w0vsUEKwePCEApfcdlxHi_ZByiKs6M6oLzEacwcY_Q3cAqUdz8Ey8-WdU9NohcerXYmw"/>
        </div>
      </header>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SideNavBar */}
      <aside className={`
        fixed left-0 top-0 h-full w-64 bg-[var(--color-surface-container-low)] flex flex-col p-4 pt-20 space-y-2 z-50
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:z-30
      `}>
        {/* Mobile close button */}
        <button 
          className="lg:hidden absolute top-5 right-4 p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-on-surface-variant)]"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-4 py-6 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center text-white">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-[var(--color-on-surface)] leading-none">Kinetic Monolith</h3>
              <p className="text-[11px] font-semibold text-[var(--color-on-surface-variant)] mt-1 tracking-wider uppercase">Design Studio</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1">
          <NavItem to="/board" icon={ClipboardList} label="Tasks (Board)" active={currentPath === '/board' || currentPath === '/'} />
          <NavItem to="/timeline" icon={Settings} label="Timeline (Gantt)" active={currentPath === '/timeline'} />
          <NavItem to="/gallery" icon={Layout} label="Card Gallery" active={currentPath === '/gallery'} />
          <NavItem to="/team" icon={Users} label="Team" active={currentPath === '/team'} />
        </nav>
        
        <div className="pt-4 space-y-1">
          <Button className="w-full mb-6 group py-3">
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
            New Project
          </Button>
          
          <Link to="#" className="flex items-center gap-3 px-4 py-3 text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-on-surface)] rounded-lg transition-all font-semibold text-sm">
            <HelpCircle className="w-5 h-5" />
            <span>Help</span>
          </Link>
          <Link to="#" className="flex items-center gap-3 px-4 py-3 text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-on-surface)] rounded-lg transition-all font-semibold text-sm">
            <Archive className="w-5 h-5" />
            <span>Archive</span>
          </Link>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="ml-0 lg:ml-64 pt-16 md:pt-20 p-4 md:p-8 min-h-screen w-full flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};
