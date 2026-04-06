import React from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Mail, Lock, ArrowRight, Rocket, Shield, Cpu } from 'lucide-react';

export const Login: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <main className="min-h-screen w-full flex bg-[var(--color-surface)] selection:bg-[var(--color-primary)] selection:text-white">
      {/* Left Section: Visual Identity (Hidden on Mobile) */}
      <section className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-kinetic-animate items-center justify-center">
        {/* Abstract shapes for more depth */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-[#b6b4ff]/20 rounded-full blur-[100px]"></div>
        
        <div className="absolute inset-0 z-0">
          <img 
            alt="Abstract digital structure" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay scale-110" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZgwtfcnIt1RyU0j4xlve6dR01AN-Q1uX_oy6g3YlMpzpkZSLSDsjV1syiyKGKundi0Fu7ZWyyJ-aWV7fqLWKwJPrFcVtoh2z4Heohh9NWGUgT_BE-434JUtdiNdjUmGrAkXuuxKHpR2ZqaRCJyNDJcZLFjybIvu6oHRwCGH01c4qFSrPEqRZpdMr_W9lxeuKVusfebiJQddkMy25aGd_LEb86RbZQCS9mB3kwuYwb-5-sfccMuky3psOjRdnnPGeU7iKUuw7X8ro"
          />
        </div>
        
        <div className="relative z-10 px-20 max-w-2xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
            <Cpu className="w-3.5 h-3.5 text-[#b6b4ff]" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/90 uppercase">Enterprise Grade v4.0</span>
          </div>
          
          <h1 className="font-display font-extrabold text-[4.5rem] leading-[1.1] text-white mb-8 tracking-tighter">
            Architectural <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">Precision.</span>
          </h1>
          
          <p className="text-xl leading-relaxed font-light mb-12 max-w-lg text-[#c3c0ff] opacity-90">
            Experience a workspace that feels like a high-end physical studio. Curated for teams that demand excellence.
          </p>
          
          <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.15)] border border-white/10 relative group overflow-hidden">
             {/* Subtle internal glow */}
            <div className="absolute -inset-x-20 -top-20 h-40 bg-white/5 blur-3xl group-hover:bg-white/10 transition-colors duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] flex items-center justify-center text-white shadow-xl">
                   <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-display font-bold text-white text-lg">Nexus Security Core</p>
                  <p className="text-white/60 text-sm">Military-grade encryption enabled</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex -space-x-3 overflow-hidden">
                  {[1, 2, 3].map((i) => (
                    <img key={i} alt={`User ${i}`} className="inline-block h-10 w-10 rounded-full ring-4 ring-white/5 object-cover" src={`https://i.pravatar.cc/100?img=${i+40}`} />
                  ))}
                  <div className="flex items-center justify-center h-10 w-10 rounded-full ring-4 ring-white/5 bg-white/10 text-white text-xs font-bold backdrop-blur-md">+14</div>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-bold">2.4k+ Teams</p>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Active globally</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Branding overlay */}
        <div className="absolute top-12 left-12 flex items-center space-x-3 group cursor-pointer">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-2xl group-hover:rotate-[10deg] transition-transform duration-500">
            <Rocket className="text-[var(--color-primary)] font-bold w-6 h-6"/>
          </div>
          <span className="font-display font-extrabold text-2xl tracking-tighter text-white">Nexus Flow</span>
        </div>
      </section>

      {/* Right Section: Login Area */}
      <section className="w-full lg:w-[45%] bg-[var(--color-surface-container-lowest)] flex items-center justify-center p-8 md:p-16 relative">
        <div className="w-full max-w-md animate-fade-in-up delay-200">
          {/* Mobile Branding */}
          <div className="lg:hidden flex items-center space-x-3 mb-12">
            <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-lg">
              <Rocket className="text-white font-bold w-6 h-6"/>
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tighter text-[var(--color-on-surface)]">Nexus Flow</span>
          </div>

          <div className="mb-12">
            <h2 className="font-display font-extrabold text-[2.25rem] md:text-[3.5rem] leading-[1.1] text-[var(--color-on-surface)] mb-3 md:mb-4 tracking-tighter">Sign In.</h2>
            <p className="text-[var(--color-on-surface-variant)] text-base md:text-lg font-medium opacity-80">Welcome back to the studio. <br className="hidden md:block"/>Your workspace awaits.</p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="transform transition-all duration-500 hover:translate-x-1">
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="name@nexus.io" 
                icon={<Mail className="w-[18px] h-[18px] opacity-70" />}
                required 
              />
            </div>
            
            <div className="space-y-3 transform transition-all duration-500 hover:translate-x-1 delay-100">
              <div className="flex justify-between items-end">
                <label className="block text-label-sm font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]">Password</label>
                <a className="text-label-sm font-bold text-[var(--color-primary)] uppercase tracking-widest hover:text-[var(--color-primary-container)] transition-colors" href="#">Forgot password?</a>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••" 
                icon={<Lock className="w-[18px] h-[18px] opacity-70" />}
                required 
              />
            </div>

            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="relative flex items-center">
                  <input 
                    className="peer w-5 h-5 opacity-0 absolute cursor-pointer" 
                    id="remember" 
                    type="checkbox"
                  />
                  <div className="w-5 h-5 border-2 border-[var(--color-outline-variant)] rounded-md bg-[var(--color-surface-container-low)] peer-checked:bg-[var(--color-primary)] peer-checked:border-[var(--color-primary)] transition-all duration-300">
                     <svg className="w-full h-full text-white scale-0 peer-checked:scale-100 transition-transform duration-300 p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                     </svg>
                  </div>
                </div>
                <label className="text-sm text-[var(--color-on-surface-variant)] font-semibold cursor-pointer group-hover:text-[var(--color-on-surface)] transition-colors" htmlFor="remember">
                  Authenticated session
                </label>
              </div>
            </div>

            <Button variant="primary" className="w-full py-5 group relative overflow-hidden shadow-[0_20px_40px_rgba(53,37,205,0.2)]" type="submit">
              <span className="relative z-10 flex items-center text-lg font-bold">
                Enter Workspace
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </Button>
          </form>

          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-outline-variant)]/50"></div>
            </div>
            <div className="relative flex justify-center text-label-sm uppercase tracking-[0.2em] font-bold">
              <span className="bg-[var(--color-surface-container-lowest)] px-6 text-[var(--color-on-surface-variant)]">Gateway protocols</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-3 py-4 px-4 bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface)] font-display font-bold border border-transparent hover:border-[var(--color-outline-variant)] rounded-xl transition-all duration-300 group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"></path>
              </svg>
              <span>Google SSO</span>
            </button>
            <button className="flex items-center justify-center space-x-3 py-4 px-4 bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface)] font-display font-bold border border-transparent hover:border-[var(--color-outline-variant)] rounded-xl transition-all duration-300 group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
              </svg>
              <span>GitHub Key</span>
            </button>
          </div>
        </div>

        {/* Footer info absolute to right section */}
        <footer className="absolute bottom-6 md:bottom-10 w-full hidden md:flex justify-center space-x-12 px-8 animate-fade-in-up delay-500 opacity-0">
          <div className="flex items-center space-x-10">
            {['Privacy', 'Protocol', 'Security'].map((text) => (
              <span key={text} className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] cursor-pointer transition-all hover:tracking-[0.4em] duration-300">
                {text}
              </span>
            ))}
          </div>
        </footer>
      </section>
    </main>
  );
};
