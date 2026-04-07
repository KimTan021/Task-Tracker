import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuthStore } from '../hooks/useAuthStore';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Mail, Lock, ArrowRight, Rocket, Shield, Cpu, AlertCircle, User, XCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!name || !email || !password || !confirmPassword) return;
    
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    
    try {
      await register(name, email, password);
      // Pass a state message to the login page
      navigate('/login', { state: { message: "Registration successful. Please log in." } });
    } catch (err) {
      // Error is handled in the store, just prevent navigation
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) clearError();
    if (localError) setLocalError(null);
    setter(e.target.value);
  };

  const displayError = localError || error;

  return (
    <main className="min-h-screen w-full flex bg-[var(--color-surface)] selection:bg-[var(--color-primary)] selection:text-white">
      {/* Floating Notification System */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-6 pointer-events-none">
        {displayError && (
          <div className="pointer-events-auto flex items-center gap-4 bg-white/80 backdrop-blur-2xl p-5 rounded-[2rem] border border-rose-500/20 shadow-[0_30px_60px_rgba(225,29,72,0.15)] animate-fade-in-up">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-0.5">Validation Protocol Error</p>
              <p className="text-sm font-bold text-slate-800 leading-tight">{displayError}</p>
            </div>
            <button onClick={() => { setLocalError(null); clearError(); }} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <XCircle className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        )}
      </div>

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
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/90 uppercase">Enterprise Grade v4.2</span>
          </div>
          
          <h1 className="font-display font-extrabold text-[4.5rem] leading-[1.1] text-white mb-8 tracking-tighter italic">
            Architectural <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">Precision.</span>
          </h1>
          
          <p className="text-xl leading-relaxed font-light mb-12 max-w-lg text-[#c3c0ff] opacity-90">
            Secure your allocation in the Nexus. Curated for squads that demand excellence.
          </p>
          
          <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.15)] border border-white/10 relative group overflow-hidden">
             {/* Subtle internal glow */}
            <div className="absolute -inset-x-20 -top-20 h-40 bg-white/5 blur-3xl group-hover:bg-white/10 transition-colors duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] flex items-center justify-center text-white shadow-2xl shadow-[var(--color-primary)]/40">
                   <Shield className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-display font-black text-white text-xl tracking-tighter uppercase italic">Nexus Authority</p>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Protocol Verified</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex -space-x-4 overflow-hidden">
                  {[1, 2, 3].map((i) => (
                    <img key={i} alt={`User ${i}`} className="inline-block h-12 w-12 rounded-[1.25rem] ring-4 ring-white/5 object-cover" src={`https://i.pravatar.cc/100?img=${i+40}`} />
                  ))}
                  <div className="flex items-center justify-center h-12 w-12 rounded-[1.25rem] ring-4 ring-white/5 bg-white/10 text-white text-xs font-black backdrop-blur-md">+14</div>
                </div>
                <div className="text-right">
                  <p className="text-white text-lg font-black tracking-tighter">2.4k+ Streams</p>
                  <p className="text-white/40 text-[9px] uppercase tracking-[0.2em] font-black">Active Contexts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Branding overlay */}
        <div className="absolute top-12 left-12 flex items-center space-x-3 group cursor-pointer">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-[10deg] transition-transform duration-500">
            <Rocket className="text-[var(--color-primary)] font-bold w-6 h-6"/>
          </div>
          <span className="font-display font-black text-3xl tracking-tighter text-white uppercase italic">Nexus Flow</span>
        </div>
      </section>

      {/* Right Section: Registration Area */}
      <section className="w-full lg:w-[45%] bg-[var(--color-surface-container-lowest)] flex items-center justify-center p-8 md:p-16 relative">
        <div className="w-full max-w-md animate-fade-in-up delay-200">
          {/* Mobile Branding */}
          <div className="lg:hidden flex items-center space-x-3 mb-12">
            <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-lg">
              <Rocket className="text-white font-bold w-6 h-6"/>
            </div>
            <span className="font-display font-black text-2xl tracking-tighter text-[var(--color-on-surface)] uppercase italic">Nexus Flow</span>
          </div>

          <div className="mb-10">
            <h2 className="font-display font-black text-[2.75rem] md:text-[4rem] leading-[0.9] text-[var(--color-on-surface)] mb-4 tracking-tighter uppercase italic">Request <br/> Access<span className="text-[var(--color-primary)]">.</span></h2>
            <p className="text-[var(--color-on-surface-variant)] text-sm md:text-md font-bold uppercase tracking-widest opacity-40">Join the studio squad.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="transform transition-all duration-500 hover:translate-x-1">
              <Input 
                label="Architect Identity" 
                type="text" 
                placeholder="architect_id" 
                icon={<User className="w-[18px] h-[18px] opacity-70" />}
                required
                value={name}
                onChange={handleInputChange(setName)}
              />
              <p className="mt-2 text-[9px] font-black text-[var(--color-on-surface-variant)]/30 uppercase tracking-widest pl-1">
                Your unique operative handle.
              </p>
            </div>

            <div className="transform transition-all duration-500 hover:translate-x-1 delay-75">
              <Input 
                label="Communication Stream" 
                type="email" 
                placeholder="nexus@studio.io" 
                icon={<Mail className="w-[18px] h-[18px] opacity-70" />}
                required
                value={email}
                onChange={handleInputChange(setEmail)}
              />
            </div>
            
            <div className="transform transition-all duration-500 hover:translate-x-1 delay-100">
              <Input 
                label="Access Key"
                type="password" 
                placeholder="••••••••" 
                icon={<Lock className="w-[18px] h-[18px] opacity-70" />}
                required 
                value={password}
                onChange={handleInputChange(setPassword)}
              />
            </div>

            <div className="transform transition-all duration-500 hover:translate-x-1 delay-150 pb-2">
              <Input 
                label="Confirm Key"
                type="password" 
                placeholder="••••••••" 
                icon={<Lock className="w-[18px] h-[18px] opacity-70" />}
                required 
                value={confirmPassword}
                onChange={handleInputChange(setConfirmPassword)}
              />
            </div>

            <Button disabled={isLoading} variant="primary" className="w-full py-5 group relative overflow-hidden shadow-xl shadow-[var(--color-primary)]/20 mt-8 rounded-2xl active:scale-95 transition-all" type="submit">
              <span className="relative z-10 flex items-center justify-center text-md font-black uppercase tracking-widest">
                {isLoading ? 'Processing Protocol...' : 'Initialize Workspace'}
                {!isLoading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />}
              </span>
              <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </Button>
            
            <div className="text-center mt-8">
                <span className="text-[var(--color-on-surface-variant)] text-[10px] font-black uppercase tracking-widest opacity-40">Allocated already? </span>
                <Link to="/login" className="text-[var(--color-primary)] text-[10px] font-black uppercase tracking-[0.2em] hover:text-[var(--color-primary-container)] transition-colors inline-block hover:-translate-y-0.5 duration-300 ml-1">
                    Sign In
                </Link>
            </div>
          </form>

        </div>

        {/* Footer info absolute to right section */}
        <footer className="absolute bottom-6 md:bottom-10 w-full hidden md:flex justify-center space-x-12 px-8 animate-fade-in-up delay-[600ms] opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div className="flex items-center space-x-10">
            {['Privacy', 'Protocol', 'Manifesto'].map((text) => (
              <span key={text} className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--color-on-surface-variant)]/30 hover:text-[var(--color-primary)] cursor-pointer transition-all hover:tracking-[0.5em] duration-300">
                {text}
              </span>
            ))}
          </div>
        </footer>
      </section>
    </main>
  );
};
