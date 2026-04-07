import React, { useEffect, useState } from 'react';
import { Search, UserPlus, Shield, Users, Mail, Loader2 } from 'lucide-react';
import { useProjectStore } from '../hooks/useProjectStore';
import api from '../services/api';

interface SearchResult {
  userId: number;
  userName: string;
  userEmail: string;
}

interface Member {
  userId: number;
  userName: string;
  userEmail: string;
}

export const Collaborators: React.FC = () => {
  const { currentProject, addMember, getMembers } = useProjectStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  useEffect(() => {
    if (currentProject) {
      void loadMembers();
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
      const currentMemberIds = new Set(members.map((member) => member.userId));
      setSearchResults(response.data.filter((user: SearchResult) => !currentMemberIds.has(user.userId)));
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
      await loadMembers();
    } catch (error) {
      console.error('Failed to add member', error);
    }
  };

  if (!currentProject) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--color-surface-container-low)] text-slate-300">
          <Users className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-display font-black uppercase italic tracking-tighter text-slate-800">No Active Context</h2>
        <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">Select or initiate a project to manage collaborators</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 animate-fade-in">
      <section className="flex flex-col gap-6 rounded-[2rem] bg-[var(--color-surface-container-low)] p-6 shadow-[0_24px_48px_rgba(28,27,27,0.04)] md:flex-row md:items-end md:justify-between md:p-8">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="max-w-full truncate rounded-full bg-[rgba(53,37,205,0.08)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
              {currentProject.projectName}
            </div>
          </div>
          <h1 className="text-4xl font-display font-black uppercase italic tracking-tighter text-slate-900 md:text-5xl">
            Collaborators<span className="text-indigo-600">.</span>
          </h1>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Manage project access and visibility</p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:min-w-[280px]">
          <div className="rounded-2xl bg-white px-4 py-4 shadow-[0_18px_36px_rgba(28,27,27,0.05)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Squad</p>
            <p className="mt-2 text-3xl font-display font-black tracking-tight text-slate-800">{members.length}</p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-4 shadow-[0_18px_36px_rgba(28,27,27,0.05)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Owner</p>
            <p className="mt-2 truncate text-sm font-black uppercase tracking-[0.18em] text-indigo-600">{currentProject.user.userName}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-6 rounded-[2rem] bg-[var(--color-surface-container-low)] p-6 shadow-[0_18px_36px_rgba(28,27,27,0.03)]">
          <div className="space-y-4">
            <div>
              <h3 className="ml-1 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Search Operatives</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-on-surface-variant)]/78">
                Add teammates by username. Search results exclude people who already belong to this project.
              </p>
            </div>

            <div className="group relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => void handleSearch(e.target.value)}
                placeholder="Search username"
                className="w-full rounded-2xl bg-white px-12 py-4 text-sm font-semibold text-slate-700 outline-none transition-all placeholder:text-slate-300 focus-visible:ring-4 focus-visible:ring-indigo-500/10"
              />
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-indigo-500" />
              {isSearching && <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-indigo-500" />}
            </div>
          </div>

          <div className="space-y-3">
            {searchResults.length > 0 ? (
              searchResults.map((user) => (
                <div
                  key={user.userId}
                  className="group rounded-2xl bg-white p-4 shadow-[0_14px_32px_rgba(28,27,27,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(53,37,205,0.08)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <img className="h-10 w-10 rounded-xl object-cover bg-slate-100" src={`https://i.pravatar.cc/150?u=${user.userName}`} alt={user.userName} />
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-black uppercase tracking-widest text-slate-800">{user.userName}</p>
                        <p className="truncate text-[10px] font-semibold text-slate-400">{user.userEmail}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleAddMember(user.userName)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-all hover:bg-[var(--color-primary)] hover:text-white"
                    >
                      <UserPlus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : searchQuery.length >= 2 && !isSearching ? (
              <div className="rounded-3xl bg-white/70 p-8 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No operatives found</p>
              </div>
            ) : (
              <div className="rounded-3xl bg-white/55 p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type at least 2 characters</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="ml-1 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Current Squad</h3>
            <span className="rounded-full bg-[var(--color-surface-container-low)] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
              {members.length} members
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {isLoadingMembers ? (
              [1, 2, 3, 4].map((item) => (
                <div key={item} className="h-36 rounded-[2rem] bg-[var(--color-surface-container-low)] animate-pulse" />
              ))
            ) : (
              members.map((member) => (
                <div
                  key={member.userId}
                  className="group overflow-hidden rounded-[2rem] bg-[var(--color-surface-container-lowest)] p-6 shadow-[0_22px_44px_rgba(28,27,27,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_28px_56px_rgba(28,27,27,0.08)]"
                >
                  <div className="mb-5 flex justify-end">
                    {member.userId === currentProject.user.userId ? (
                      <div className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-rose-500">
                        <Shield className="h-3 w-3" /> Architect
                      </div>
                    ) : (
                      <div className="rounded-full bg-indigo-50 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-indigo-500">
                        Collaborator
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img className="h-14 w-14 rounded-2xl object-cover bg-slate-100 shadow-lg transition-transform group-hover:rotate-3" src={`https://i.pravatar.cc/150?u=${member.userName}`} alt={member.userName} />
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-white bg-green-500"></div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-black uppercase italic tracking-tighter text-slate-800">{member.userName}</p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                        <Mail className="h-3.5 w-3.5 opacity-40" />
                        <span className="truncate">{member.userEmail}</span>
                      </div>

                      <div className="mt-4 rounded-2xl bg-[var(--color-surface-container-low)] px-4 py-3">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Access</p>
                        <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-700">
                          {member.userId === currentProject.user.userId ? 'Owns this project and can manage team membership.' : 'Can collaborate on shared tasks and view project activity.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
