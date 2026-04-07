import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuthStore } from '../hooks/useAuthStore';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Mail, Lock, ArrowRight, Rocket, Shield, Cpu, AlertCircle, User } from 'lucide-react';

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
            Join a workspace that feels like a high-end physical studio. Curated for teams that demand excellence.
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

      {/* Right Section: Registration Area */}
      <section className="w-full lg:w-[45%] bg-[var(--color-surface-container-lowest)] flex items-center justify-center p-8 md:p-16 relative">
        <div className="w-full max-w-md animate-fade-in-up delay-200">
          {/* Mobile Branding */}
          <div className="lg:hidden flex items-center space-x-3 mb-12">
            <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-lg">
              <Rocket className="text-white font-bold w-6 h-6"/>
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tighter text-[var(--color-on-surface)]">Nexus Flow</span>
          </div>

          <div className="mb-10">
            <h2 className="font-display font-extrabold text-[2.25rem] md:text-[3.5rem] leading-[1.1] text-[var(--color-on-surface)] mb-3 md:mb-4 tracking-tighter">Request Access.</h2>
            <p className="text-[var(--color-on-surface-variant)] text-base md:text-lg font-medium opacity-80">Join the studio. <br className="hidden md:block"/>Create your workspace.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="transform transition-all duration-500 hover:translate-x-1">
              <Input 
                label="Username" 
                type="text" 
                placeholder="architect_01" 
                icon={<User className="w-[18px] h-[18px] opacity-70" />}
                required
                value={name}
                onChange={handleInputChange(setName)}
              />
              <p className="mt-2 text-[10px] font-bold text-[var(--color-on-surface-variant)]/40 uppercase tracking-widest pl-1">
                This will be your unique architectural handle.
              </p>
            </div>

            <div className="transform transition-all duration-500 hover:translate-x-1 delay-75">
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="name@nexus.io" 
                icon={<Mail className="w-[18px] h-[18px] opacity-70" />}
                required
                value={email}
                onChange={handleInputChange(setEmail)}
              />
            </div>
            
            <div className="transform transition-all duration-500 hover:translate-x-1 delay-100">
              <Input 
                label="Password"
                type="password" 
                placeholder="••••••••" 
                icon={<Lock className="w-[18px] h-[18px] opacity-70" />}
                required 
                value={password}
                onChange={handleInputChange(setPassword)}
              />
            </div>

            <div className="transform transition-all duration-500 hover:translate-x-1 delay-150">
              <Input 
                label="Confirm Password"
                type="password" 
                placeholder="••••••••" 
                icon={<Lock className="w-[18px] h-[18px] opacity-70" />}
                required 
                value={confirmPassword}
                onChange={handleInputChange(setConfirmPassword)}
              />
            </div>

            {displayError && (
              <div className="flex items-center gap-2 text-rose-500 text-sm font-semibold bg-rose-50 p-3 rounded-lg border border-rose-100 animate-fade-in-up">
                <AlertCircle className="w-4 h-4" />
                <span>{displayError}</span>
              </div>
            )}

            <Button disabled={isLoading} variant="primary" className="w-full py-5 group relative overflow-hidden shadow-[0_20px_40px_rgba(53,37,205,0.2)] mt-8" type="submit">
              <span className="relative z-10 flex items-center text-lg font-bold">
                {isLoading ? 'Creating Account...' : 'Initialize Workspace'}
                {!isLoading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />}
              </span>
              <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </Button>
            
            <div className="text-center mt-6">
                <span className="text-[var(--color-on-surface-variant)] text-sm font-medium">Already have an account? </span>
                <Link to="/login" className="text-[var(--color-primary)] text-sm font-bold hover:text-[var(--color-primary-container)] transition-colors inline-block hover:-translate-y-0.5 duration-300">
                    Sign In
                </Link>
            </div>
          </form>

        </div>

        {/* Footer info absolute to right section */}
        <footer className="absolute bottom-6 md:bottom-10 w-full hidden md:flex justify-center space-x-12 px-8 animate-fade-in-up delay-[600ms] opacity-0" style={{ animationFillMode: 'forwards' }}>
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
