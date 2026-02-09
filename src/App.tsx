
import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  ArrowRight, 
  Sparkles, 
  CloudRain, 
  Sun, 
  Leaf, 
  ShieldCheck, 
  Circle,
  Gamepad2,
  BookOpen,
  Notebook,
  User as UserIcon,
  CheckCircle2,
  Pencil,
  Save,
  Zap,
  Target,
  Wind,
  Smile,
  Plus,
  Skull,
  Activity,
  Eye,
  Lock,
  Trophy,
  Loader2,
  Flame,
  Shield,
  Trash2,
  Calendar,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LogOut,
  Camera
} from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Adding missing interface for JournalEntry to fix compilation errors
interface JournalEntry {
  id: string;
  time: string;
  date: string;
  prompt: string;
  response: string;
  completed: boolean;
}

const FormedCloud: React.FC<{ top: string; left: string; scale?: number; duration: string; color?: string }> = ({ top, left, scale = 1, duration, color = "white" }) => (
  <div 
    className="cloud-container pointer-events-none" 
    style={{ top, left, transform: `scale(${scale})`, '--d': duration } as any}
  >
    <div className={`cloud-part w-16 h-16 -top-4 left-4`} style={{backgroundColor: color}}></div>
    <div className={`cloud-part w-12 h-12 -top-2 -left-2`} style={{backgroundColor: color}}></div>
    <div className={`cloud-part w-14 h-14 -top-2 left-12`} style={{backgroundColor: color}}></div>
    <div className={`cloud-part w-24 h-8 top-4 -left-4 rounded-full`} style={{backgroundColor: color}}></div>
  </div>
);

const DetailedTree: React.FC<{ bottom: string; left?: string; right?: string; scale?: number; leafColor?: string }> = ({ bottom, left, right, scale = 1, leafColor = "#43A047" }) => (
  <div 
    className="absolute flex flex-col items-center pointer-events-none" 
    style={{ bottom, left, right, transform: `scale(${scale})`, zIndex: 1 }}
  >
    <div className="relative mb-[-8px]">
      <div className="w-12 h-12 rounded-full absolute -top-8 -left-6" style={{backgroundColor: leafColor, opacity: 0.8}}></div>
      <div className="w-12 h-12 rounded-full absolute -top-8 -right-6" style={{backgroundColor: leafColor, opacity: 0.9}}></div>
      <div className="w-14 h-14 rounded-full absolute -top-12 -left-2" style={{backgroundColor: leafColor}}></div>
    </div>
    <div className="w-5 h-10 bg-[#5D4037] rounded-t-sm shadow-inner"></div>
  </div>
);

const ScenicBackground: React.FC<{ children: React.ReactNode; isDashboard?: boolean; activeTab?: string }> = ({ children, isDashboard, activeTab }) => {
  const getBgClass = () => {
    if (activeTab === 'boss-fight') return 'bg-gradient-to-b from-[#F3E5F5] via-[#E1F5FE] to-[#FCE4EC]';
    if (activeTab === 'progress') return 'bg-gradient-to-b from-[#E0F2F1] via-[#F1F8E9] to-[#E3F2FD]';
    if (activeTab === 'logs') return 'bg-[#F9FBF9]';
    if (activeTab === 'me') return 'bg-gray-50';
    if (isDashboard) return 'bg-[#FFFDF0]';
    return 'bg-gradient-to-b from-[#4FC3F7] via-[#81D4FA] to-[#B3E5FC]';
  };

  const getGroundClass = (layer: number) => {
    if (activeTab === 'boss-fight') return layer === 1 ? 'bg-[#E1BEE7]' : 'bg-[#D1C4E9]';
    if (activeTab === 'progress') return layer === 1 ? 'bg-[#C8E6C9]' : 'bg-[#A5D6A7]';
    if (activeTab === 'logs') return layer === 1 ? 'bg-[#E8F5E9]/50' : 'bg-[#C8E6C9]/30';
    if (activeTab === 'me') return layer === 1 ? 'bg-gray-200/50' : 'bg-gray-100/30';
    if (isDashboard) return layer === 1 ? 'bg-[#E6EE9C]' : 'bg-[#DCE775]';
    return layer === 1 ? 'bg-[#81C784]' : 'bg-[#66BB6A]';
  };

  const getTreeColor = (idx: number) => {
    if (activeTab === 'boss-fight') return idx === 0 ? "#9575CD" : idx === 1 ? "#7986CB" : "#BA68C8";
    if (activeTab === 'progress') return idx === 0 ? "#80CBC4" : idx === 1 ? "#B2DFDB" : "#4DB6AC";
    if (activeTab === 'logs') return idx === 0 ? "#A5D6A7" : idx === 1 ? "#C8E6C9" : "#81C784";
    if (activeTab === 'me') return idx === 0 ? "#CBD5E1" : idx === 1 ? "#E2E8F0" : "#94A3B8";
    if (isDashboard) return idx === 0 ? "#C0CA33" : idx === 1 ? "#D4E157" : "#AFB42B";
    return idx === 0 ? "#2E7D32" : idx === 1 ? "#388E3C" : "#43A047";
  };

  return (
    <div className={`fixed inset-0 transition-all duration-1000 overflow-hidden flex flex-col items-center ${
      isDashboard ? 'justify-start' : 'justify-center'
    } ${getBgClass()}`}>
      
      {!isDashboard && activeTab !== 'boss-fight' && activeTab !== 'progress' && activeTab !== 'logs' && activeTab !== 'me' && (
        <>
          <FormedCloud top="12%" left="8%" scale={1.2} duration="10s" />
          <FormedCloud top="25%" left="75%" scale={1.5} duration="14s" />
          <FormedCloud top="8%" left="45%" scale={0.8} duration="7s" />
        </>
      )}

      {(isDashboard || activeTab === 'boss-fight' || activeTab === 'progress' || activeTab === 'logs' || activeTab === 'me') && (
        <>
          <FormedCloud top="15%" left="5%" scale={1.1} duration="12s" color={activeTab === 'boss-fight' ? "#F8BBD0" : activeTab === 'progress' || activeTab === 'logs' ? "#B2EBF2" : activeTab === 'me' ? "#E2E8F0" : "#FFF9C4"} />
          <FormedCloud top="25%" left="85%" scale={1.4} duration="18s" color={activeTab === 'boss-fight' ? "#E1F5FE" : activeTab === 'progress' || activeTab === 'logs' ? "#E0F2F1" : activeTab === 'me' ? "#F1F5F9" : "#FFF9C4"} />
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-white/20 rounded-full blur-[150px] glow-pulse opacity-50"></div>
        </>
      )}
      
      <div className={`absolute top-[-150px] left-[10%] w-[500px] h-[500px] rounded-full blur-[120px] ${activeTab === 'boss-fight' ? 'bg-purple-100/30' : activeTab === 'progress' || activeTab === 'logs' ? 'bg-teal-100/30' : activeTab === 'me' ? 'bg-slate-100/40' : 'bg-yellow-100/20'}`}></div>

      <div className={`absolute bottom-[-5vh] w-[160%] left-[-30%] h-[40vh] transition-colors duration-1000 rounded-[100%] ${getGroundClass(1)}`}></div>
      <div className={`absolute bottom-[-12vh] w-[140%] left-[-20%] h-[35vh] transition-colors duration-1000 rounded-[100%] shadow-[inset_0_20px_60px_rgba(0,0,0,0.06)] ${getGroundClass(2)}`}></div>
      
      <DetailedTree bottom="18vh" left="12%" scale={1.1} leafColor={getTreeColor(0)} />
      <DetailedTree bottom="22vh" left="22%" scale={0.8} leafColor={getTreeColor(1)} />
      <DetailedTree bottom="14vh" right="15%" scale={1.2} leafColor={getTreeColor(2)} />

      {children}
    </div>
  );
};

const Logo: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => (
  <div className={`flex items-center ${size === 'sm' ? 'space-x-2' : 'space-x-4'} group cursor-default`}>
    <div className="relative flex items-center justify-center">
      <div className={`${size === 'sm' ? 'w-8 h-8' : 'w-14 h-14'} bg-[#FF7043] rounded-2xl rotate-45 group-hover:rotate-0 transition-transform duration-700 shadow-lg`}></div>
      <div className={`absolute ${size === 'sm' ? 'w-3 h-3 border-2' : 'w-6 h-6 border-4'} border-white rounded-full`}></div>
    </div>
    <div className="flex flex-col">
      <h1 className={`${size === 'sm' ? 'text-xl' : 'text-4xl'} font-black tracking-tighter text-[#1A237E] leading-none`}>RECODE</h1>
      {size === 'md' && <span className="text-[10px] font-bold tracking-[0.5em] text-[#1A237E]/50 uppercase mt-1">Identity Engine</span>}
    </div>
  </div>
);

// --- ME / PROFILE VIEW ---

interface DossierItem {
  prompt: string;
  response: string;
}

interface DossierCategory {
  title: string;
  color: string;
  items: DossierItem[];
}

const MeView: React.FC<{ 
  dossier: DossierCategory[]; 
  onUpdate: (catIdx: number, itemIdx: number, val: string) => void;
  onTerminate: () => void;
}> = ({ dossier, onUpdate, onTerminate }) => {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(0);
  const [editingItem, setEditingItem] = useState<{ cat: number; item: number } | null>(null);
  const [tempVal, setTempVal] = useState("");

  const handleEdit = (catIdx: number, itemIdx: number, currentVal: string) => {
    setEditingItem({ cat: catIdx, item: itemIdx });
    setTempVal(currentVal);
  };

  const handleSave = () => {
    if (editingItem) {
      onUpdate(editingItem.cat, editingItem.item, tempVal);
      setEditingItem(null);
    }
  };

  return (
    <div className="w-full flex flex-col items-start fade-in pt-6 pb-32 max-w-xl mx-auto">
      <header className="w-full flex justify-end items-center mb-10 px-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-gray-300 shadow-sm overflow-hidden">
            <UserIcon size={32} />
          </div>
          <button className="absolute bottom-0 right-0 p-1.5 bg-[#FF7043] rounded-full text-white shadow-lg border-2 border-white">
            <Camera size={12} />
          </button>
        </div>
      </header>

      <div className="w-full px-4 mb-6">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-1 h-4 bg-red-500 rounded-full"></div>
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Psychological Dossier</span>
        </div>

        <div className="space-y-4">
          {dossier.map((cat, catIdx) => {
            const isExpanded = expandedCategory === catIdx;
            const completedCount = cat.items.filter(i => i.response.trim().length > 0).length;
            
            return (
              <div key={catIdx} className="w-full bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setExpandedCategory(isExpanded ? null : catIdx)}
                  className="w-full px-8 py-6 flex items-center justify-between group hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-6">
                    <div className={`w-1.5 h-8 rounded-full ${cat.color}`}></div>
                    <span className="text-base font-black text-[#1A237E] uppercase tracking-tighter">{cat.title}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{completedCount}/{cat.items.length} DATA</span>
                    {isExpanded ? <ChevronUp size={20} className="text-gray-300" /> : <ChevronDown size={20} className="text-gray-300" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-8 pb-8 space-y-4 fade-in">
                    {cat.items.map((item, itemIdx) => {
                      const isEditing = editingItem?.cat === catIdx && editingItem?.item === itemIdx;
                      
                      return (
                        <div key={itemIdx} className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 group relative">
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed pr-8">
                              {item.prompt}
                            </span>
                            <div className="flex items-center space-x-2">
                              {isEditing ? (
                                <>
                                  <button onClick={handleSave} className="p-1.5 bg-green-500 text-white rounded-lg shadow-sm">
                                    <Check size={14} />
                                  </button>
                                  <button onClick={() => setEditingItem(null)} className="p-1.5 bg-gray-200 text-gray-500 rounded-lg">
                                    <X size={14} />
                                  </button>
                                </>
                              ) : (
                                <button 
                                  onClick={() => handleEdit(catIdx, itemIdx, item.response)}
                                  className="p-1.5 text-gray-300 hover:text-[#FF7043] transition-colors"
                                >
                                  <Pencil size={14} />
                                </button>
                              )}
                              <ChevronDown size={14} className="text-gray-300" />
                            </div>
                          </div>
                          
                          {isEditing ? (
                            <textarea 
                              className="w-full bg-transparent border-none outline-none text-[#1A237E]/70 font-medium text-sm leading-relaxed resize-none min-h-[80px]"
                              value={tempVal}
                              onChange={(e) => setTempVal(e.target.value)}
                              placeholder="Input data node..."
                              autoFocus
                            />
                          ) : (
                            <p className={`text-sm leading-relaxed font-medium transition-colors ${item.response ? 'text-[#1A237E]/70 italic' : 'text-gray-300 italic'}`}>
                              "{item.response || 'Unmapped potential...'}"
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full px-4 mt-8 space-y-8">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-4 bg-gray-300 rounded-full"></div>
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">System Actions</span>
        </div>
        
        <button 
          onClick={onTerminate}
          className="w-full bg-white border border-gray-100 px-8 py-5 rounded-[28px] flex items-center justify-between text-[#1A237E] group hover:border-red-100 hover:text-red-500 transition-all shadow-sm"
        >
          <span className="font-black text-xs uppercase tracking-widest">Terminate Session</span>
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

// --- LOGS / JOURNAL VIEW ---

const AnalyticsView: React.FC<{ entries: JournalEntry[]; onBack: () => void }> = ({ entries, onBack }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const monthName = viewDate.toLocaleString('default', { month: 'short' }).toUpperCase();
  const year = viewDate.getFullYear();

  const daysInMonth = new Date(year, viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, viewDate.getMonth(), 1).getDay();

  const calendarItems = useMemo(() => {
    const items = [];
    for (let i = 0; i < firstDayOfWeek; i++) items.push(null);
    for (let d = 1; d <= daysInMonth; d++) items.push(d);
    return items;
  }, [viewDate]);

  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const getDayStatus = (day: number) => {
    const dStr = `${(viewDate.getMonth() + 1).toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
    const hasEntry = entries.some(e => e.date === dStr);
    return hasEntry ? 'win' : 'neutral';
  };

  const winCount = entries.filter(e => {
    const [m, d, y] = e.date.split('/');
    return parseInt(m) === viewDate.getMonth() + 1 && parseInt(y) === year;
  }).length;

  return (
    <div className="w-full flex flex-col items-start fade-in pt-6 pb-32 max-w-lg mx-auto">
      <header className="w-full flex justify-between items-center mb-8 px-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-[#1A237E]/30 uppercase tracking-[0.3em] mb-1">Performance Ledger</span>
          <h2 className="text-4xl font-black text-[#1A237E] tracking-tight">Analytics</h2>
        </div>
        <div className="px-4 py-2 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl text-[12px] font-black text-[#1A237E] shadow-sm">
          {year}
        </div>
      </header>

      <div className="w-full bg-white/30 backdrop-blur-xl border border-white/60 rounded-[48px] p-8 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-8 px-2">
          <button onClick={() => changeMonth(-1)} className="p-3 bg-white/40 hover:bg-white rounded-full transition-all text-[#1A237E]"><ChevronLeft size={20} /></button>
          <span className="text-base font-black text-[#1A237E] tracking-[0.3em] uppercase">{monthName}</span>
          <button onClick={() => changeMonth(+1)} className="p-3 bg-white/40 hover:bg-white rounded-full transition-all text-[#1A237E]"><ChevronRight size={20} /></button>
        </div>

        <div className="grid grid-cols-7 gap-y-3 text-center mb-6">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(label => (
            <span key={label} className="text-[9px] font-black text-[#1A237E]/30 tracking-widest">{label}</span>
          ))}
          
          {calendarItems.map((day, idx) => day === null ? (
            <div key={`empty-${idx}`} className="aspect-square"></div>
          ) : (
            <div 
              key={`day-${day}`} 
              onClick={() => setSelectedDay(day)}
              className={`aspect-square flex items-center justify-center m-1 rounded-2xl text-[12px] font-black cursor-pointer transition-all hover:scale-110 active:scale-95 ${
                getDayStatus(day) === 'win' 
                  ? 'bg-green-500/20 text-green-700 border-2 border-green-500/30' 
                  : 'bg-white/40 text-[#1A237E]/20 border border-white/60'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <span className="text-[10px] font-black text-[#1A237E]/30 uppercase tracking-[0.2em] mb-4 block ml-2">Monthly Overview</span>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/50 p-6 rounded-[32px] border border-white/60 shadow-sm">
              <span className="text-[9px] font-black text-[#1A237E]/40 uppercase tracking-widest block mb-2">Win Rate</span>
              <div className="flex items-end space-x-1">
                <span className="text-3xl font-black text-green-600">{winCount}</span>
                <span className="text-sm font-bold text-[#1A237E]/30 pb-1">/ {daysInMonth}</span>
              </div>
            </div>
            <div className="bg-white/50 p-6 rounded-[32px] border border-white/60 shadow-sm">
              <span className="text-[9px] font-black text-[#1A237E]/40 uppercase tracking-widest block mb-2">Avg Score</span>
              <span className="text-3xl font-black text-[#1A237E]">{winCount > 0 ? '100%' : '0%'}</span>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={onBack}
        className="self-center bg-[#1A237E] text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest flex items-center space-x-3 shadow-2xl hover:scale-105 transition-transform active:scale-95"
      >
        <Notebook size={18} />
        <span>Return to Journal</span>
      </button>

      {/* Day Detail Modal Overlay */}
      {selectedDay && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#1A237E]/10 backdrop-blur-xl fade-in">
          <div className="w-full max-w-md bg-white rounded-[48px] p-10 shadow-2xl relative overflow-hidden">
            <button 
              onClick={() => setSelectedDay(null)}
              className="absolute top-8 right-8 p-3 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 transition-all z-10"
            >
              <X size={20} />
            </button>
            
            <div className="mb-10">
              <span className="text-[12px] font-black text-[#1A237E]/30 tracking-[0.2em]">{year}-{viewDate.getMonth() + 1}-{selectedDay.toString().padStart(2, '0')}</span>
            </div>

            <div className="text-center mb-10">
              <h1 className={`text-8xl font-black mb-2 leading-none ${getDayStatus(selectedDay) === 'win' ? 'text-green-600' : 'text-gray-300'}`}>
                {getDayStatus(selectedDay) === 'win' ? '100' : '0'}
              </h1>
              <span className="text-[10px] font-black text-[#1A237E]/30 uppercase tracking-[0.4em]">
                {getDayStatus(selectedDay) === 'win' ? 'Positive PNL' : 'Session Inactive'}
              </span>
            </div>

            <div className="flex justify-around mb-10 py-8 border-y border-gray-100">
              <div className="text-center">
                <span className="text-3xl font-black text-[#1A237E]">{getDayStatus(selectedDay) === 'win' ? '1' : '0'}</span>
                <span className="block text-[9px] font-black text-[#1A237E]/30 uppercase tracking-widest mt-1">Reflections</span>
              </div>
              <div className="w-[1px] bg-gray-100"></div>
              <div className="text-center">
                <span className="text-3xl font-black text-[#1A237E]">5</span>
                <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Total Limit</span>
              </div>
            </div>

            <div className="relative">
              <span className="text-[10px] font-black text-yellow-600/60 uppercase tracking-[0.2em] block mb-3">Identity Analysis</span>
              <p className="text-[#1A237E]/60 font-medium text-base leading-relaxed italic">
                {getDayStatus(selectedDay) === 'win' 
                  ? "Strategic alignment verified. Your documentation of wins and struggles demonstrates genuine commitment to innovation over performative progress. Maintain this trajectory to ensure the evolution of your core loop."
                  : "No data captured for this temporal segment. Identity recoding requires consistent temporal nodes. Ensure future reflections are initialized to prevent drift."
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LogsView: React.FC<{ 
  entries: JournalEntry[]; 
  onUpdate: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}> = ({ entries, onUpdate, onDelete, onAdd }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempResponse, setTempResponse] = useState("");
  const [showAnalytics, setShowAnalytics] = useState(false);

  if (showAnalytics) {
    return <AnalyticsView entries={entries} onBack={() => setShowAnalytics(false)} />;
  }

  const startEditing = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setTempResponse(entry.response);
  };

  const saveEdit = (entry: JournalEntry) => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    onUpdate({ ...entry, response: tempResponse, time: formattedTime });
    setEditingId(null);
  };

  return (
    <div className="w-full flex flex-col items-start fade-in pt-6 pb-32">
      <header className="w-full flex justify-between items-center mb-10 px-4">
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Daily Log</span>
          <h2 className="text-4xl font-black text-[#1A237E] tracking-tight">Journal</h2>
        </div>
        <button 
          onClick={() => setShowAnalytics(true)}
          className="w-14 h-14 rounded-3xl bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center text-yellow-500 shadow-sm hover:shadow-lg transition-all active:scale-95 group"
        >
          <Calendar size={26} className="group-hover:scale-110 transition-transform" />
        </button>
      </header>

      <div className="w-full space-y-6 px-4">
        {entries.map((entry) => (
          <div 
            key={entry.id} 
            className="group relative bg-[#F1F8F1] border border-[#E0EBE0] rounded-[40px] p-8 shadow-sm transition-all hover:shadow-xl hover:scale-[1.01]"
          >
            <div className="flex justify-between items-center mb-5">
              <span className="text-[11px] font-black text-green-600/60 uppercase tracking-[0.2em]">
                {entry.time} • {entry.date}
              </span>
              <div className="flex items-center space-x-2">
                {editingId === entry.id ? (
                  <>
                    <button onClick={() => saveEdit(entry)} className="p-2 text-green-600 hover:bg-green-100 rounded-xl transition-all"><Check size={20} /></button>
                    <button onClick={() => setEditingId(null)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"><X size={20} /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(entry)} className="p-2 text-gray-400 hover:text-[#1A237E] opacity-0 group-hover:opacity-100 transition-all"><Pencil size={18} /></button>
                    <button onClick={() => onDelete(entry.id)} className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
                    <div className="text-green-500/60 ml-2">
                      <Check size={24} strokeWidth={3} />
                    </div>
                  </>
                )}
              </div>
            </div>

            <h3 className="text-[#1A237E]/80 font-black text-2xl leading-snug mb-5 tracking-tight">
              {entry.prompt}
            </h3>

            {editingId === entry.id ? (
              <textarea 
                className="w-full bg-transparent border-none outline-none text-[#1A237E]/60 font-medium text-lg italic leading-relaxed resize-none min-h-[120px]"
                value={tempResponse}
                onChange={(e) => setTempResponse(e.target.value)}
                autoFocus
              />
            ) : (
              <p className="text-[#1A237E]/60 font-medium text-lg italic leading-relaxed border-l-4 border-green-500/10 pl-6">
                "{entry.response || "No reflection yet..."}"
              </p>
            )}
          </div>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="w-full py-24 flex flex-col items-center justify-center opacity-20">
          <BookOpen size={70} className="text-[#1A237E] mb-6" />
          <p className="font-black text-base text-[#1A237E] uppercase tracking-widest">Your story is unwritten.</p>
        </div>
      )}
      
      <div className="w-full flex justify-center mt-12 pb-24">
        <button 
          onClick={onAdd}
          className="bg-green-100 text-green-700 px-8 py-4 rounded-3xl font-black text-[13px] uppercase tracking-[0.2em] flex items-center space-x-3 hover:bg-green-200 transition-all active:scale-95 shadow-md"
        >
          <Plus size={18} strokeWidth={3} />
          <span>New Entry</span>
        </button>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD ---

const Dashboard: React.FC = () => {
  const [directive, setDirective] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [hasDirective, setHasDirective] = useState(false);
  const [activeTab, setActiveTab] = useState<'journey' | 'boss-fight' | 'progress' | 'logs' | 'me'>('journey');
  const [vision, setVision] = useState("");
  const [antiVision, setAntiVision] = useState("");
  const [isGeneratingInitial, setIsGeneratingInitial] = useState(false);
  
  const [quests, setQuests] = useState([
    { title: "Define Core Loop", reward: "+15 Clarity", icon: <Target />, color: "bg-blue-100", completed: false },
    { title: "Engagement Micro-Habit", reward: "+10 Focus", icon: <Zap />, color: "bg-orange-100", completed: false },
    { title: "Weekly User Review", reward: "+20 Empathy", icon: <Smile />, color: "bg-pink-100", completed: false },
    { title: "Streamline Roadmap", reward: "+5 Momentum", icon: <Wind />, color: "bg-cyan-100", completed: false },
    { title: "Polish Visual Signature", reward: "+12 Aesthetic", icon: <Sparkles />, color: "bg-purple-100", completed: false },
  ]);

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  // Initial dossier structure based on article Part VI
  const [dossier, setDossier] = useState<DossierCategory[]>([
    {
      title: "Pain Awareness",
      color: "bg-red-500",
      items: [
        { prompt: "TOLERATED DISSATISFACTION", response: "" },
        { prompt: "REPEATED COMPLAINTS", response: "" },
        { prompt: "WHAT BEHAVIOR REVEALS", response: "" },
        { prompt: "THE UNBEARABLE TRUTH", response: "" },
      ]
    },
    {
      title: "Anti-Vision",
      color: "bg-orange-500",
      items: [
        { prompt: "5-YEAR TUESDAY", response: "" },
        { prompt: "10-YEAR COST", response: "" },
        { prompt: "END OF LIFE COST", response: "" },
        { prompt: "TRAJECTORY MIRROR", response: "" },
        { prompt: "IDENTITY TO RELEASE", response: "" },
        { prompt: "THE EMBARRASSING REASON", response: "" },
      ]
    },
    {
      title: "Vision MVP",
      color: "bg-emerald-500",
      items: [
        { prompt: "3-YEAR TUESDAY (NO LIMITS)", response: "" },
        { prompt: "TARGET IDENTITY STATEMENT", response: "" },
        { prompt: "WEEKLY LEVER", response: "" },
      ]
    },
    {
      title: "Synthesis",
      color: "bg-blue-500",
      items: [
        { prompt: "CORE STUCK REASON", response: "" },
        { prompt: "ACTUAL ENEMY", response: "" },
        { prompt: "REFUSAL SENTENCE", response: "" },
        { prompt: "BUILDING SENTENCE", response: "" },
      ]
    },
    {
      title: "Goal Lenses",
      color: "bg-indigo-500",
      items: [
        { prompt: "1-YEAR CONCRETE LENS", response: "" },
        { prompt: "1-MONTH REQUIREMENT", response: "" },
        { prompt: "DAILY ACTIONS", response: "" },
      ]
    },
    {
      title: "Game Setup",
      color: "bg-slate-500",
      items: [
        { prompt: "RULES & CONSTRAINTS", response: "" },
        { prompt: "PRIORITY XP NODES", response: "" },
      ]
    }
  ]);

  useEffect(() => {
    const now = new Date();
    const dStr = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear()}`;
    
    setJournalEntries([
      {
        id: '1',
        time: '11:00 AM',
        date: dStr,
        prompt: 'What am I avoiding right now by doing what I’m doing?',
        response: 'Creating the demo video is taking longer than expected. I keep re-recording because I want it to be perfect for the buildathon submission.',
        completed: true
      }
    ]);
  }, []);

  const toggleQuest = (index: number) => {
    const newQuests = [...quests];
    newQuests[index].completed = !newQuests[index].completed;
    setQuests(newQuests);
  };

  const handleUpdateJournal = (updatedEntry: JournalEntry) => {
    setJournalEntries(journalEntries.map(e => e.id === updatedEntry.id ? updatedEntry : e));
  };

  const handleDeleteJournal = (id: string) => {
    setJournalEntries(journalEntries.filter(e => e.id !== id));
  };

  const handleAddJournal = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
    const formattedDate = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear()}`;
    
    const prompts = [
      "What did I learn about my future self today?",
      "Which old habit tried to speak for me today?",
      "Who am I becoming in this exact moment?"
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      time: formattedTime,
      date: formattedDate,
      prompt: randomPrompt,
      response: "",
      completed: false
    };
    setJournalEntries([newEntry, ...journalEntries]);
  };

  const handleUpdateDossier = (catIdx: number, itemIdx: number, val: string) => {
    const newDossier = [...dossier];
    newDossier[catIdx].items[itemIdx].response = val;
    setDossier(newDossier);
  };

  const generateVisions = async (userDirective: string) => {
    setIsGeneratingInitial(true);
    try {
      const prompt = `Based on this identity directive: "${userDirective}", generate a JSON object with "vision" and "antiVision" paragraphs. Return ONLY JSON.`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
      const result = JSON.parse(response.text || "{}");
      setVision(result.vision || "");
      setAntiVision(result.antiVision || "");
    } catch (e) {
      console.error("Failed to generate visions:", e);
    } finally {
      setIsGeneratingInitial(false);
    }
  };

  const saveDirective = () => {
    if (directive.trim().length > 5) {
      setIsEditing(false);
      setHasDirective(true);
      if (!vision) generateVisions(directive);
    }
  };

  const handleTerminate = () => {
    if (window.confirm("Are you sure you want to terminate this identity session? All progress will be archived.")) {
      window.location.reload();
    }
  };

  return (
    <ScenicBackground isDashboard={true} activeTab={activeTab}>
      <div className="z-20 w-full max-w-2xl h-screen flex flex-col items-center px-4 overflow-y-auto pt-10 pb-48 fade-in no-scrollbar">
        <header className="w-full flex justify-between items-center mb-10 flex-shrink-0 px-2">
          <Logo size="sm" />
          <div className="flex items-center space-x-3">
             <div className={`px-4 py-1.5 rounded-full text-[11px] font-black transition-all ${
               activeTab === 'boss-fight' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 
               activeTab === 'progress' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' :
               activeTab === 'logs' ? 'bg-green-600 text-white shadow-lg shadow-green-500/20' :
               activeTab === 'me' ? 'bg-slate-800 text-white shadow-lg shadow-slate-500/20' :
               'bg-[#FF7043]/10 text-[#FF7043]'
             }`}>
               {activeTab === 'boss-fight' ? 'BOSS FIGHT' : activeTab === 'progress' ? 'CAMPAIGN' : activeTab === 'logs' ? 'JOURNAL' : activeTab === 'me' ? 'PROFILE' : 'ACTIVE SESSION'}
             </div>
             <div className="bg-white/40 px-3 py-1 rounded-full text-[10px] font-black text-[#1A237E] backdrop-blur-sm">840 XP</div>
          </div>
        </header>

        {activeTab === 'journey' ? (
          <>
            <div className="w-full group relative mb-12 flex-shrink-0 px-2">
              <div className="absolute -top-3 left-8 bg-[#FF7043] text-white px-4 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest z-10 shadow-sm">Current Focus</div>
              <div className="w-full bg-white/40 p-8 rounded-[48px] backdrop-blur-md border border-white/60 relative overflow-hidden transition-all duration-500 shadow-sm">
                {isEditing ? (
                  <div className="flex flex-col space-y-6">
                    <textarea value={directive} onChange={(e) => setDirective(e.target.value)} placeholder="Tell your future self where we are going..." className="w-full bg-transparent text-[#1A237E] font-bold text-2xl leading-relaxed outline-none resize-none min-h-[140px] placeholder:text-[#1A237E]/10" autoFocus />
                    <button onClick={saveDirective} disabled={directive.trim().length < 5} className="self-center flex items-center space-x-3 bg-[#1A237E] text-white px-8 py-4 rounded-full font-black text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-10 disabled:scale-100">
                      {isGeneratingInitial ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                      <span>{isGeneratingInitial ? 'MAPPING DESTINY...' : 'INITIALIZE PROTOCOL'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-start group">
                    <p className="text-[#1A237E] font-bold text-2xl leading-relaxed pr-10">{directive}</p>
                    <button onClick={() => setIsEditing(true)} className="p-3 bg-white/20 hover:bg-white text-[#1A237E] rounded-full transition-all opacity-0 group-hover:opacity-100"><Pencil size={18} /></button>
                  </div>
                )}
              </div>
            </div>

            {hasDirective && !isEditing ? (
              <div className="w-full space-y-8 fade-in px-2">
                <div className="flex justify-between items-center px-4">
                  <h4 className="text-xl font-black text-[#1A237E]">Evolution Quests</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black text-[#1A237E]/30 uppercase tracking-[0.2em]">Status: {quests.filter(q => q.completed).length}/{quests.length}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  {quests.map((q, i) => (
                    <div key={i} onClick={() => toggleQuest(i)} className="group flex items-center justify-between bg-white/30 hover:bg-white/70 transition-all p-6 rounded-[40px] backdrop-blur-sm cursor-pointer border border-white/40 shadow-sm hover:shadow-lg">
                      <div className="flex items-center space-x-5">
                        <div className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all ${q.completed ? 'bg-green-100/50 text-green-600 scale-90' : `${q.color} text-[#1A237E]`}`}>
                          {q.completed ? <CheckCircle2 size={26} /> : React.cloneElement(q.icon as React.ReactElement<any>, { size: 26, strokeWidth: 2.5 })}
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-lg font-black tracking-tight transition-all ${q.completed ? 'text-gray-400 line-through' : 'text-[#1A237E]'}`}>{q.title}</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-[9px] font-black text-[#FF7043] uppercase tracking-tighter opacity-70">REWARD</span>
                            <span className="text-[10px] font-black text-[#1A237E] uppercase">{q.reward}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-2xl text-[9px] font-black border transition-all ${q.completed ? 'bg-white border-[#1A237E]/10 text-green-600' : 'bg-[#FF7043] border-white scale-110 shadow-lg shadow-[#FF7043]/30 text-white'}`}>
                        {q.completed ? "DONE" : "START"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : !isEditing && (
              <div className="w-full flex flex-col items-center justify-center p-20 text-center space-y-6 opacity-30">
                <div className="p-8 bg-white/20 rounded-full"><Target size={60} className="text-[#1A237E]" /></div>
                <p className="font-black text-sm text-[#1A237E] uppercase tracking-widest leading-loose max-w-xs">Waiting for protocol instructions to map your evolution.</p>
              </div>
            )}
          </>
        ) : activeTab === 'boss-fight' ? (
          <div className="px-2 w-full"><BossFightView vision={vision} setVision={setVision} antiVision={antiVision} setAntiVision={setAntiVision} directive={directive} /></div>
        ) : activeTab === 'progress' ? (
          <div className="px-2 w-full"><ProgressView /></div>
        ) : activeTab === 'logs' ? (
          <div className="px-2 w-full">
            <LogsView 
              entries={journalEntries} 
              onUpdate={handleUpdateJournal} 
              onDelete={handleDeleteJournal} 
              onAdd={handleAddJournal}
            />
          </div>
        ) : (
          <div className="px-2 w-full">
            <MeView 
              dossier={dossier} 
              onUpdate={handleUpdateDossier} 
              onTerminate={handleTerminate} 
            />
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-white/40 backdrop-blur-2xl border-t border-white/40 pt-4 pb-8 px-4 h-24">
          <NavItem icon={<Gamepad2 size={24} />} label="Journey" active={activeTab === 'journey'} onClick={() => setActiveTab('journey')} />
          <NavItem icon={<Skull size={24} />} label="Boss Fight" active={activeTab === 'boss-fight'} onClick={() => setActiveTab('boss-fight')} />
          
          <div className="relative group -mt-10">
            <div className="w-16 h-16 bg-[#FF7043] rounded-[24px] flex items-center justify-center rotate-45 group-hover:rotate-90 transition-all duration-500 shadow-2xl cursor-pointer shadow-[#FF7043]/40 border-4 border-white">
              <Plus size={36} className="-rotate-45 group-hover:-rotate-90 transition-all duration-500 text-white" />
            </div>
          </div>

          <NavItem icon={<Activity size={24} />} label="Progress" active={activeTab === 'progress'} onClick={() => setActiveTab('progress')} />
          <NavItem icon={<Notebook size={24} />} label="Logs" active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} />
          <NavItem icon={<UserIcon size={24} />} label="Me" active={activeTab === 'me'} onClick={() => setActiveTab('me')} />
      </nav>
    </ScenicBackground>
  );
};

// --- REMAINING HELPER COMPONENTS ---

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }> = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} className={`flex flex-col items-center space-y-1.5 cursor-pointer transition-all ${active ? 'text-[#1A237E] scale-110' : 'text-[#1A237E]/30 hover:text-[#1A237E]'}`}>
    <div className={`p-1 transition-colors ${active ? 'text-[#FF7043]' : ''}`}>
      {React.cloneElement(icon as React.ReactElement<any>, { strokeWidth: 2.5 })}
    </div>
    <span className={`text-[9px] font-black uppercase tracking-[0.1em] text-center ${active ? 'text-[#1A237E]' : 'text-[#1A237E]/40'}`}>{label}</span>
  </div>
);

const ProgressView: React.FC = () => {
  const milestones = [
    { level: 12, title: "Transcendence", desc: "The vision is now reality.", locked: true },
    { level: 11, title: "Ascension", desc: "Approaching the peak.", locked: true },
    { level: 10, title: "Legacy", desc: "Building something lasting.", locked: true },
    { level: 9, title: "Influence", desc: "Your impact ripples out.", locked: true },
    { level: 8, title: "Mastery", desc: "Flow state is baseline.", locked: true },
    { level: 7, title: "Breakthrough", desc: "Breaking old boundaries.", locked: true },
    { level: 6, title: "Harmony", desc: "Systematic alignment.", locked: true },
    { level: 5, title: "Resilience", desc: "Unshakable core strength.", locked: true },
    { level: 4, title: "Clarity", desc: "The path is fully visible.", locked: true },
    { level: 3, title: "Momentum", desc: "Acceleration begins.", locked: true },
    { level: 2, title: "Awakening", desc: "Eyes open to potential.", locked: true },
    { level: 1, title: "Origin", desc: "The journey begins.", locked: false },
  ];

  return (
    <div className="w-full flex flex-col items-center space-y-8 fade-in py-10">
      <header className="w-full flex justify-between items-end mb-4 px-4">
        <div>
          <span className="text-[10px] font-black text-[#1A237E]/30 uppercase tracking-[0.4em]">Campaign Map</span>
          <h2 className="text-4xl font-black text-[#1A237E] tracking-tight">Progress</h2>
        </div>
        <div className="bg-[#FF7043]/10 text-[#FF7043] border border-[#FF7043]/20 px-4 py-2 rounded-2xl text-sm font-black flex items-center space-x-2">
          <span>LVL 1</span>
        </div>
      </header>

      <div className="w-full grid grid-cols-2 gap-4 px-4">
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 flex flex-col items-center justify-center space-y-1 shadow-sm group hover:scale-[1.02] transition-transform">
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-black text-[#FFB300]">0</span>
            <Flame className="text-[#FF7043] fill-[#FF7043]" size={24} />
          </div>
          <span className="text-[9px] font-black text-[#1A237E]/40 uppercase tracking-[0.2em]">Streak</span>
        </div>
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 flex flex-col items-center justify-center space-y-1 shadow-sm group hover:scale-[1.02] transition-transform">
          <div className="flex items-center space-x-1">
            <span className="text-3xl font-black text-[#FF7043]">100%</span>
          </div>
          <span className="text-[9px] font-black text-[#1A237E]/40 uppercase tracking-[0.2em]">Integrity</span>
        </div>
      </div>

      <div className="w-full relative py-10 flex flex-col items-center">
        <div className="absolute top-0 bottom-0 w-[2px] bg-[#1A237E]/10 left-1/2 -translate-x-1/2"></div>
        <div className="w-full space-y-12 relative px-4 pb-24">
          {milestones.map((m, i) => (
            <div key={i} className={`flex items-center w-full ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-1/2 flex ${i % 2 === 0 ? 'justify-end pr-8' : 'justify-start pl-8'}`}>
                <div className={`max-w-[200px] w-full p-6 bg-white/30 backdrop-blur-lg border rounded-[32px] transition-all duration-500 hover:bg-white/60 group cursor-default ${
                  m.locked ? 'border-white/20 opacity-40' : 'border-white/60 shadow-xl shadow-[#1A237E]/5'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-2xl font-black ${m.locked ? 'text-[#1A237E]/20' : 'text-[#1A237E]'}`}>
                      {m.level}
                    </span>
                    {m.locked && <Lock size={14} className="text-[#1A237E]/20" />}
                  </div>
                  <h4 className={`font-black text-sm uppercase tracking-tight mb-1 ${m.locked ? 'text-[#1A237E]/30' : 'text-[#1A237E]'}`}>
                    {m.title}
                  </h4>
                  <p className={`text-[10px] font-medium leading-relaxed ${m.locked ? 'text-[#1A237E]/20' : 'text-[#1A237E]/50'}`}>
                    {m.desc}
                  </p>
                </div>
              </div>
              <div className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 transition-all duration-500 z-10 ${
                m.locked ? 'bg-white border-[#1A237E]/10' : 'bg-[#FF7043] border-white scale-125 shadow-lg shadow-[#FF7043]/30'
              }`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RewardCard: React.FC<{ icon: React.ReactNode; title: string; status: string; active?: boolean }> = ({ icon, title, status, active }) => (
  <div className={`flex-shrink-0 w-64 p-8 rounded-[40px] border-2 transition-all duration-500 ${
    active ? 'bg-white/60 border-green-400 shadow-xl' : 'bg-white/20 border-white/40 opacity-50'
  }`}>
    <div className={`mb-6 ${active ? 'text-green-600' : 'text-[#1A237E]/40'}`}>
      {icon}
    </div>
    <h4 className={`font-black text-xl mb-1 tracking-tight ${active ? 'text-[#1A237E]' : 'text-[#1A237E]/40'}`}>
      {title}
    </h4>
    <p className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-green-600' : 'text-[#1A237E]/30'}`}>
      {status}
    </p>
  </div>
);

const BossFightView: React.FC<{ 
  vision: string; 
  setVision: (v: string) => void;
  antiVision: string; 
  setAntiVision: (v: string) => void;
  directive: string;
}> = ({ vision, setVision, antiVision, setAntiVision, directive }) => {
  const [isEditingVision, setIsEditingVision] = useState(!vision);
  const [isEditingAntiVision, setIsEditingAntiVision] = useState(!antiVision);
  const [loadingType, setLoadingType] = useState<'vision' | 'antiVision' | null>(null);

  const generatePartial = async (type: 'vision' | 'antiVision') => {
    setLoadingType(type);
    try {
      const prompt = `Based on this identity directive: "${directive}", generate a ${type === 'vision' ? 'inspiring, vivid 2-sentence vision of success' : 'stark, cautionary 2-sentence consequences of failure'}. 
      Return ONLY the text, no other formatting.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      
      if (type === 'vision') {
        setVision(response.text || "");
        setIsEditingVision(false);
      } else {
        setAntiVision(response.text || "");
        setIsEditingAntiVision(false);
      }
    } catch (e) {
      console.error(`Failed to generate ${type}:`, e);
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="w-full flex flex-col items-center space-y-10 fade-in py-10">
      <div className="w-full space-y-6">
        <div className={`bg-white/30 backdrop-blur-xl border-2 transition-all duration-500 rounded-[48px] p-8 relative overflow-hidden group shadow-xl ${isEditingVision ? 'border-green-400/50 scale-[1.02]' : 'border-green-400/10 shadow-green-500/5'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-500 rounded-2xl text-white shadow-lg shadow-green-500/20">
                <Eye size={20} />
              </div>
              <span className="text-green-600 font-black text-[11px] uppercase tracking-widest">The Ascendant Vision</span>
            </div>
            <div className="flex items-center space-x-2">
              {isEditingVision ? (
                <>
                  <button onClick={() => generatePartial('vision')} className="p-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors">
                    {loadingType === 'vision' ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  </button>
                  <button onClick={() => vision.length > 5 && setIsEditingVision(false)} className="p-2 bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/30">
                    <Save size={16} />
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditingVision(true)} className="p-2 bg-green-100/50 text-green-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                  <Pencil size={16} />
                </button>
              )}
            </div>
          </div>
          {isEditingVision ? (
            <textarea className="w-full bg-transparent border-none outline-none text-[#1A237E] font-bold text-2xl leading-relaxed tracking-tight resize-none min-h-[120px] placeholder:text-green-900/10" value={vision} onChange={(e) => setVision(e.target.value)} placeholder="Who do you become when you win?" autoFocus />
          ) : (
            <p className="text-[#1A237E] font-bold text-2xl leading-relaxed tracking-tight">"{vision}"</p>
          )}
          <div className="absolute -right-8 -bottom-8 opacity-[0.05] rotate-12 group-hover:rotate-0 transition-transform duration-1000"><Trophy size={200} /></div>
        </div>

        <div className={`bg-white/30 backdrop-blur-xl border-2 transition-all duration-500 rounded-[48px] p-8 relative overflow-hidden group shadow-xl ${isEditingAntiVision ? 'border-red-400/50 scale-[1.02]' : 'border-red-400/10 shadow-red-500/5'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-500 rounded-2xl text-white shadow-lg shadow-green-500/20">
                <Skull size={20} />
              </div>
              <span className="text-red-600 font-black text-[11px] uppercase tracking-widest">The Degenerative Path</span>
            </div>
            <div className="flex items-center space-x-2">
              {isEditingAntiVision ? (
                <>
                  <button onClick={() => generatePartial('antiVision')} className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors">
                    {loadingType === 'antiVision' ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  </button>
                  <button onClick={() => antiVision.length > 5 && setIsEditingAntiVision(false)} className="p-2 bg-red-600 text-white rounded-xl shadow-lg shadow-green-500/30">
                    <Save size={16} />
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditingAntiVision(true)} className="p-2 bg-green-100/50 text-green-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                  <Pencil size={16} />
                </button>
              )}
            </div>
          </div>
          {isEditingAntiVision ? (
            <textarea className="w-full bg-transparent border-none outline-none text-[#1A237E] font-bold text-2xl leading-relaxed tracking-tight resize-none min-h-[120px] placeholder:text-red-900/10" value={antiVision} onChange={(e) => setAntiVision(e.target.value)} placeholder="What is the cost of falling back?" autoFocus />
          ) : (
            <p className="text-[#1A237E] font-bold text-2xl leading-relaxed tracking-tight">"{antiVision}"</p>
          )}
          <div className="absolute -right-8 -bottom-8 opacity-[0.05] rotate-12 group-hover:rotate-0 transition-transform duration-1000 text-red-900"><Skull size={200} /></div>
        </div>
      </div>

      <div className="w-full">
        <div className="flex items-center space-x-4 mb-8">
          <div className="h-[1px] flex-1 bg-[#1A237E]/10"></div>
          <span className="text-[10px] font-black text-[#1A237E]/30 uppercase tracking-[0.4em]">Boss Rewards</span>
          <div className="h-[1px] flex-1 bg-[#1A237E]/10"></div>
        </div>
        <div className="flex space-x-6 overflow-x-auto pb-8 no-scrollbar px-4">
          <RewardCard icon={<Trophy size={32} />} title="Identity Anchor" status="Unlocked" active />
          <RewardCard icon={<Lock size={32} />} title="Ethereal Theme" status="Level 12 Required" />
          <RewardCard icon={<Zap size={32} />} title="Focus Burst" status="Level 20 Required" />
        </div>
      </div>
    </div>
  );
};

const OnboardingStep: React.FC<{ data: any; currentStep: number; totalSteps: number; onNext: () => void }> = ({ data, currentStep, totalSteps, onNext }) => (
  <div className="fade-in flex flex-col items-center text-center px-6">
    <div className="mb-10 p-4">
      <div className={`transition-colors duration-700 ${data.color} drop-shadow-2xl`}>
        {React.cloneElement(data.icon as React.ReactElement<any>, { size: 120, strokeWidth: 1.5, fill: "currentColor" })}
      </div>
    </div>
    <h2 className="text-5xl font-black text-[#1A237E] tracking-tight mb-6 drop-shadow-sm">{data.title}</h2>
    <p className="text-xl text-[#1A237E]/70 font-medium leading-relaxed max-w-md mb-14">{data.description}</p>
    <button onClick={onNext} className="group flex flex-col items-center space-y-3 focus:outline-none">
      <div className="px-14 py-6 bg-[#1A237E] text-white rounded-full font-black text-xl flex items-center space-x-4 hover:scale-105 active:scale-95 transition-all shadow-2xl hover:shadow-[#1A237E]/40">
        <span>{currentStep === totalSteps - 1 ? "Begin Journey" : "Tell Me More"}</span>
        <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
      </div>
      <span className="text-[11px] font-black text-[#1A237E]/30 uppercase tracking-[0.4em] pt-8">Phase {currentStep + 1} // {totalSteps}</span>
    </button>
  </div>
);

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);

  const steps = [
    { title: "Who are you protecting?", description: "You aren't lazy. You're just protecting an old version of yourself that feels safe. It's time to bloom.", icon: <Sparkles />, color: "text-[#FFB300]" },
    { title: "The Anti-Vision", description: "Define the future you refuse to live. Growth happens when you stop settling for 'okay'.", icon: <CloudRain />, color: "text-[#3F51B5]" },
    { title: "Identity First", description: "Don't just change your habits. Change your roots. Everything else will grow from there.", icon: <Leaf />, color: "text-[#43A047]" },
    { title: "New Horizons", description: "Turn your progress into a game. When the path is fun, discipline becomes effortless.", icon: <Sun />, color: "text-[#FF7043]" }
  ];

  const handleNext = () => currentStep < steps.length - 1 ? setCurrentStep(s => s + 1) : setShowDashboard(true);

  return (
    <div className="min-h-screen">
      {showDashboard ? <Dashboard /> : (
        <ScenicBackground isDashboard={false}>
          <div className="z-20 w-full max-w-xl flex flex-col items-center justify-center pt-10">
            <div className="flex space-x-6 mb-20">
              {steps.map((_, idx) => (
                <div key={idx} onClick={() => setCurrentStep(idx)} className={`w-4 h-1 rounded-full cursor-pointer transition-all duration-500 ${idx === currentStep ? 'bg-[#1A237E] w-12 shadow-sm' : 'bg-[#1A237E]/10 hover:bg-[#1A237E]/30'}`} />
              ))}
            </div>
            <div className="mb-14"><Logo /></div>
            <OnboardingStep data={steps[currentStep]} currentStep={currentStep} totalSteps={steps.length} onNext={handleNext} />
          </div>
          <div className="absolute bottom-[10vh] left-[42%] text-[#1B5E20]/5 pointer-events-none"><Circle size={60} strokeWidth={8} /></div>
          <div className="absolute bottom-[15vh] right-[32%] text-[#1B5E20]/5 pointer-events-none"><Circle size={40} strokeWidth={6} /></div>
          <div className="fixed bottom-12 flex flex-col items-center opacity-20 pointer-events-none">
            <div className="text-[10px] font-black text-[#1A237E] tracking-[0.8em] uppercase">RECODE IDENTITY PROTOCOL</div>
          </div>
        </ScenicBackground>
      )}
      <div className="fixed inset-0 bg-[#81D4FA] z-[300] flex flex-col items-center justify-center p-12 text-center lg:hidden">
        <div className="text-[#1A237E] mb-8"><ShieldCheck size={90} strokeWidth={1} /></div>
        <h3 className="text-4xl font-black text-[#1A237E] mb-4 tracking-tighter text-balance leading-tight">Identity Recoding Requires Space</h3>
        <p className="text-[#1A237E]/70 font-bold uppercase tracking-widest text-[10px]">Please use a larger display to begin your journey.</p>
      </div>
    </div>
  );
};

export default App;
