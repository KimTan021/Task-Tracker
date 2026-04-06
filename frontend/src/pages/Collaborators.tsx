import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Shield, Users, Mail, Loader2 } from 'lucide-react';
import { useProjectStore } from '../hooks/useProjectStore';
import api from '../services/api';

interface SearchResult {
  userId: number;
  userName: string;
  userEmail: string;
}

export const Collaborators: React.FC = () => {
  const { currentProject, addMember, getMembers } = useProjectStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  useEffect(() => {
    if (currentProject) {
      loadMembers();
    }
  }, [currentProject]);

  const loadMembers = async () => {
    if (!currentProject) return;
    setIsLoadingMembers(true);
    try {
      const data = await getMembers(currentProject.projectId);
      setMembers(data);
    } catch (error) {
      console.error('Failed to load members', error);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await api.get('/users/search', { params: { query } });
      // Filter out people already in the project
      const currentMemberIds = new Set(members.map(m => m.userId));
      setSearchResults(response.data.filter((u: SearchResult) => !currentMemberIds.has(u.userId)));
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddMember = async (username: string) => {
    if (!currentProject) return;
    try {
      await addMember(currentProject.projectId, username);
      setSearchQuery('');
      setSearchResults([]);
      loadMembers();
    } catch (error) {
      console.error('Failed to add member', error);
    }
  };

  if (!currentProject) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
          <Users className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-display font-black tracking-tighter text-slate-800 uppercase italic">No Active Context</h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Select or initiating a project to manage collaborators</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="px-3 py-1 bg-indigo-50 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
              {currentProject.projectName}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-slate-900 uppercase italic leading-none">
            Collaborators<span className="text-indigo-600">.</span>
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-4">Manage project access and permissions</p>
        </div>

        <div className="flex items-center gap-4">
           <div className="text-right hidden sm:block">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Squad Size</p>
             <p className="text-2xl font-display font-black text-slate-800">{members.length}</p>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
             <Users className="w-6 h-6" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Search & Discovery */}
        <div className="lg:col-span-1 space-y-8">
           <div className="space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-1">Search Operatives</h3>
             <div className="relative group">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Username query..."
                  className="w-full bg-white border border-slate-100 rounded-2xl px-12 py-4 text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all placeholder:text-slate-300"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                {isSearching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 animate-spin" />}
             </div>
           </div>

           {/* Search Results */}
           <div className="space-y-3">
             {searchResults.length > 0 ? (
               searchResults.map(user => (
                 <div 
                   key={user.userId}
                   className="group p-4 bg-white rounded-2xl border border-slate-50 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all animate-slide-up"
                 >
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <img className="w-10 h-10 rounded-xl object-cover bg-slate-100" src={`https://i.pravatar.cc/150?u=${user.userName}`} alt={user.userName} />
                       <div>
                         <p className="text-[11px] font-black uppercase tracking-widest text-slate-800">{user.userName}</p>
                         <p className="text-[9px] font-bold text-slate-400 truncate max-w-[120px]">{user.userEmail}</p>
                       </div>
                     </div>
                     <button 
                       onClick={() => handleAddMember(user.userName)}
                       className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all group-hover:scale-110"
                     >
                       <UserPlus className="w-4 h-4" />
                     </button>
                   </div>
                 </div>
               ))
             ) : searchQuery.length >= 2 && !isSearching ? (
               <div className="p-8 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No operatives found</p>
               </div>
             ) : null}
           </div>
        </div>

        {/* Right: Member List */}
        <div className="lg:col-span-2 space-y-6">
           <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-1">Current Squad</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {isLoadingMembers ? (
               [1, 2, 3, 4].map(i => (
                 <div key={i} className="h-24 bg-slate-50 rounded-3xl animate-pulse" />
               ))
             ) : (
               members.map(member => (
                 <div 
                   key={member.userId}
                   className="p-6 bg-white rounded-3xl border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden"
                 >
                   <div className="absolute top-0 right-0 p-4">
                      {member.userId === currentProject.user.userId ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 rounded-full text-[8px] font-black text-rose-500 uppercase tracking-widest">
                          <Shield className="w-3 h-3" /> Architect
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 rounded-full text-[8px] font-black text-indigo-500 uppercase tracking-widest">
                          Collaborator
                        </div>
                      )}
                   </div>

                   <div className="flex items-center gap-4">
                     <div className="relative">
                        <img className="w-14 h-14 rounded-2xl object-cover bg-slate-100 shadow-lg group-hover:rotate-6 transition-transform" src={`https://i.pravatar.cc/150?u=${member.userName}`} alt={member.userName} />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
                     </div>
                     <div>
                       <p className="text-[13px] font-black uppercase tracking-tighter text-slate-800 italic">{member.userName}</p>
                       <div className="flex items-center gap-3 mt-1 text-slate-400">
                         <div className="flex items-center gap-1 text-[9px] font-bold">
                            <Mail className="w-3 h-3 opacity-40" /> {member.userEmail}
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               ))
             )}
           </div>
        </div>
      </div>
    </div>
  );
};
