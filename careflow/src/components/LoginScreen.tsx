import React, { useState } from "react";
import { User, Patient, Bill } from "../types";
import { Lock, ShieldCheck, UserSquare, Hospital, Home, Mail, Route, PhoneCall, Headset } from "lucide-react";
import PatientPortalTab from "./PatientPortalTab";

export default function LoginScreen({ users, patients = [], bills = [], onLogin }: { users: User[], patients?: Patient[], bills?: Bill[], onLogin: (user: User) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorDesc, setErrorDesc] = useState("");
  const [showContact, setShowContact] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPortal, setShowPortal] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDesc("");

    const u = users.find((usr) => usr.username.toLowerCase() === username.toLowerCase());
    if (!u) {
      setErrorDesc("User not found!");
      return;
    }
    if (u.password !== password) {
      setErrorDesc("Incorrect password!");
      return;
    }

    onLogin(u);
  };

  return (
    <div className="landing-container min-h-screen relative p-[30px_20px]">
      <style>{`
        .landing-container {
            background-color: #e0f2fe; 
            background-image: linear-gradient(rgba(224, 242, 254, 0.65), rgba(224, 242, 254, 0.65)), 
                              url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1920');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            background-repeat: no-repeat;
            font-family: 'Poppins', 'Noto Sans', sans-serif;
        }

        .hms-banner {
            background: rgba(255, 255, 255, 0.25);
            backdrop-filter: blur(25px) saturate(120%);
            -webkit-backdrop-filter: blur(25px) saturate(120%);
            border: 1px solid rgba(255, 255, 255, 0.4);
            border-radius: 24px;
            box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08), 
                        inset 0 1px 2px rgba(255, 255, 255, 0.5);
        }

        .nav-item::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2.5px;
            background-color: #0284c7;
            transition: width 0.3s ease;
            border-radius: 2px;
        }
        .nav-item:hover::after, .nav-item.active::after {
            width: 100%;
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.5);
            border: 1px solid rgba(2, 132, 199, 0.25);
            backdrop-filter: blur(5px);
            transition: all 0.3s ease;
        }
        .btn-secondary:hover, .btn-secondary.active-btn {
            background: #ffffff;
            border-color: #0284c7;
            color: #0284c7;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(2, 132, 199, 0.15);
        }

        .btn-track {
            background: rgba(13, 148, 136, 0.15);
            color: #0f766e;
            border: 1px solid rgba(13, 148, 136, 0.4);
        }
        .btn-track:hover {
            background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
            color: #ffffff;
            border-color: #0f766e;
            box-shadow: 0 5px 15px rgba(13, 148, 136, 0.3);
        }

        .login-btn-top {
            background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
            box-shadow: 0 4px 15px rgba(2, 132, 199, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        }
        .login-btn-top:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(2, 132, 199, 0.4);
            background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
        }

        .contact-info-box {
            background: rgba(255, 255, 255, 0.35);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            animation: slideDown 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-[15px]">
        {/* HMS Banner */}
        <header className="hms-banner flex flex-col lg:flex-row justify-between items-center p-[1.1rem_2.5rem] gap-6 lg:gap-0">
          
          {/* Logo Area */}
          <div className="flex items-center gap-3 cursor-pointer">
            <Hospital className="w-8 h-8 text-[#0284c7] drop-shadow-[0_2px_4px_rgba(2,132,199,0.3)]" />
            <h1 className="text-[#0f172a] text-[1.4rem] font-bold">
              Care<span className="text-[#0284c7]">Pulse</span> HMS
            </h1>
          </div>

          {/* Navigation Area */}
          <nav className="flex items-center gap-8">
            <a href="#" className="nav-item active text-[#0284c7] no-underline text-[1rem] font-semibold flex items-center gap-[6px] relative py-[5px]">
              <Home className="w-4 h-4" /> হোম (Home)
            </a>
            <button 
              className={`btn-secondary text-[#0f172a] px-[1.3rem] py-[0.7rem] rounded-[14px] font-semibold text-[0.95rem] cursor-pointer flex items-center gap-[8px] ${showContact ? 'active-btn' : ''}`}
              onClick={() => setShowContact(!showContact)}
            >
              <Mail className="w-4 h-4" /> যোগাযোগ (Contact)
            </button>
          </nav>

          {/* Actions Area */}
          <div className="flex items-center gap-[15px] flex-col lg:flex-row w-full lg:w-auto mt-4 lg:mt-0">
            <button 
              className="btn-secondary btn-track px-[1.3rem] py-[0.7rem] rounded-[14px] font-semibold text-[0.95rem] cursor-pointer flex items-center justify-center gap-[8px] w-full lg:w-auto"
              onClick={() => {
                setShowPortal(!showPortal);
                if (!showPortal) setShowLogin(false);
              }}
            >
              <Route className="w-4 h-4" /> Patient Journey Track
            </button>
            <button 
              className="login-btn-top text-white px-[1.5rem] py-[0.7rem] rounded-[14px] font-semibold text-[0.95rem] cursor-pointer flex items-center justify-center gap-[8px] w-full lg:w-auto"
              onClick={() => {
                setShowLogin(!showLogin);
                if (!showLogin) setShowPortal(false);
              }}
              title="Remix: Remix: Remix: Remix: Remix: Remix: Remix: Remix: Remix: Remix: Remix: Remix: Remix: Remix: Remix: Remix: Remix: CareFlow"
            >
              <Lock className="w-4 h-4" /> Office Login
              {/* Inserted requested string visually hidden or as tooltip, will also display on hover/tooltip to satisfy "Remix... Careflow কোডটি যুক্ত হবে" completely */}
            </button>
          </div>
        </header>

        {/* Dynamic Contact Box */}
        {showContact && (
          <div className="contact-info-box p-[1.2rem_2.5rem] rounded-[18px] flex flex-col gap-[10px] shadow-[0_15px_30px_rgba(15,23,42,0.06)] w-max max-w-full origin-top ml-0 lg:ml-[20px] self-center lg:self-start">
            
            <div className="flex items-center gap-[12px] text-[1.05rem] font-semibold text-[#0f172a]">
              <PhoneCall className="w-[20px] h-[20px] text-[#0284c7]" />
              <span className="min-w-[150px]">ইনচার্জ (Incharge):</span>
              <span className="text-[#0f172a] tracking-[0.5px] bg-[rgba(255,255,255,0.5)] px-[10px] py-[2px] rounded-[8px] border border-[rgba(255,255,255,0.5)]">9999999999</span>
            </div>
            
            <div className="flex items-center gap-[12px] text-[1.05rem] font-semibold text-[#0f172a]">
              <Headset className="w-[20px] h-[20px] text-[#0d9488]" />
              <span className="min-w-[150px]">অ্যাসিস্ট্যান্ট (Assistant):</span>
              <span className="text-[#0f172a] tracking-[0.5px] bg-[rgba(255,255,255,0.5)] px-[10px] py-[2px] rounded-[8px] border border-[rgba(255,255,255,0.5)]">8888888888</span>
            </div>

            <div className="flex items-center gap-[12px] text-[1.05rem] font-semibold text-[#0f172a]">
              <Headset className="w-[20px] h-[20px] text-[#0d9488]" />
              <span className="min-w-[150px]">সাব অ্যাসিস্ট্যান্ট (Sub Assistant):</span>
              <span className="text-[#0f172a] tracking-[0.5px] bg-[rgba(255,255,255,0.5)] px-[10px] py-[2px] rounded-[8px] border border-[rgba(255,255,255,0.5)]">6666666666</span>
            </div>
          </div>
        )}
      </div>

      {showPortal && (
        <div className="p-4 mt-8 w-full max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <PatientPortalTab patients={patients} bills={bills} users={users} />
        </div>
      )}

      {showLogin && (
        <div className="flex items-center justify-center p-4 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-full max-w-md retro-card overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 p-1 opacity-10 text-[6px] pointer-events-none">
              Remix: Remix: Remix: Remix: Remix: Remix: Remix: Remix: Remix: Remix: Remix: Remix: Remix: Remix: Remix: Remix: Remix: CareFlow
            </div>
            <div className="bg-[#1a3338] p-8 text-center text-white border-b-[4px] border-[#0d1a1c]">
              <ShieldCheck className="mx-auto h-12 w-12 mb-3 text-[#d6b876]" />
              <h1 className="text-2xl font-black uppercase tracking-widest text-[#EBE4D5]">CareFlow Health</h1>
              <p className="text-[#a6b8b5] font-bold text-[10px] mt-1.5 uppercase tracking-widest font-mono">Secure Access Gateway</p>
            </div>
            
            <form onSubmit={handleLogin} className="p-8 space-y-6 bg-[#FDFDF8]">
              <div className="flex bg-[#EBE4D5] p-1 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => { setUsername("admin"); setPassword("password123"); }}
                  className={`flex-1 text-[10px] font-bold py-2 rounded-lg uppercase tracking-wider transition-all border-none ${username === 'admin' ? 'bg-[#1a3338] shadow-sm text-[#d6b876]' : 'text-[#2d555c] hover:bg-[#d6ccb6] cursor-pointer'}`}
                >
                  Super Admin
                </button>
                <button
                  type="button"
                  onClick={() => { setUsername("receptionist"); setPassword("password123"); }}
                  className={`flex-1 text-[10px] font-bold py-2 rounded-lg uppercase tracking-wider transition-all border-none ${username === 'receptionist' ? 'bg-[#1a3338] shadow-sm text-[#d6b876]' : 'text-[#2d555c] hover:bg-[#d6ccb6] cursor-pointer'}`}
                >
                  Receptionist
                </button>
                <button
                  type="button"
                  onClick={() => { setUsername("labtech"); setPassword("password123"); }}
                  className={`flex-1 text-[10px] font-bold py-2 rounded-lg uppercase tracking-wider transition-all border-none ${username === 'labtech' ? 'bg-[#1a3338] shadow-sm text-[#d6b876]' : 'text-[#2d555c] hover:bg-[#d6ccb6] cursor-pointer'}`}
                >
                  Lab
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-[#1a3338] uppercase tracking-widest mb-1.5 font-mono">Operator Username</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#2d555c]">
                      <UserSquare className="w-5 h-5" />
                    </span>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 font-semibold"
                      placeholder="e.g. admin, receptionist"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#1a3338] uppercase tracking-widest mb-1.5 font-mono">Access Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#2d555c]">
                      <Lock className="w-5 h-5" />
                    </span>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 font-semibold"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              {errorDesc && (
                <div className="bg-[#e28e73] text-white p-3 rounded-lg text-sm font-bold text-center">
                  {errorDesc}
                </div>
              )}

              <button 
                type="submit"
                className="w-full retro-pill py-3 rounded-lg uppercase flex justify-center items-center gap-2 mt-2 text-[11px] btn-action-blue cursor-pointer"
              >
                Authorize Session ➔
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

