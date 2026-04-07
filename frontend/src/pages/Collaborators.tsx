import React, { useEffect, useState } from 'react';
import { Search, UserPlus, Shield, Users, Loader2, Inbox, CheckCheck, Clock3, UserMinus, XCircle, ArrowUpCircle } from 'lucide-react';
import { useAuthStore } from '../hooks/useAuthStore';
import { useProjectStore } from '../hooks/useProjectStore';
import { useTaskStore } from '../hooks/useTaskStore';
import { PromoteCollaboratorModal } from '../components/PromoteCollaboratorModal';
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
  role: string;
}

interface Invitation {
  invitationId: number;
  projectId: number;
  projectName: string;
  projectDescription?: string;
  invitedUserId: number;
  invitedUserName: string;
  invitedByUserId: number;
  invitedByUserName: string;
  status: string;
  createdAt: string;
}

export const Collaborators: React.FC = () => {
  const { userId } = useAuthStore();
  const { currentProject, addMember, getMembers, removeMember, promoteMember, getPendingInvitations, getPendingInvitationsForProject, acceptInvitation, rejectInvitation, fetchProjects } = useProjectStore();
  const { fetchTasks } = useTaskStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [pendingProjectInvites, setPendingProjectInvites] = useState<Invitation[]>([]);
  const [pendingUserInvites, setPendingUserInvites] = useState<Invitation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isAcceptingInvitationId, setIsAcceptingInvitationId] = useState<number | null>(null);
  const [isRejectingInvitationId, setIsRejectingInvitationId] = useState<number | null>(null);
  const [isRemovingMemberId, setIsRemovingMemberId] = useState<number | null>(null);
  const [isPromotingMemberId, setIsPromotingMemberId] = useState<number | null>(null);
  const [promotionCandidate, setPromotionCandidate] = useState<Member | null>(null);

  const isProjectOwner = currentProject && userId ? Number(currentProject.user.userId) === Number(userId) : false;
  const currentMembership = members.find((member) => Number(member.userId) === Number(userId));
  const canInviteMembers = isProjectOwner || currentMembership?.role === 'CO_OWNER';

  useEffect(() => {
    void loadPendingUserInvites();
  }, [userId]);

  useEffect(() => {
    if (!currentProject) {
      setMembers([]);
      setPendingProjectInvites([]);
      return;
    }
    void Promise.all([loadMembers(), loadProjectInvites()]);
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

  const loadProjectInvites = async () => {
    if (!currentProject) return;
    try {
      const data = await getPendingInvitationsForProject(currentProject.projectId);
      setPendingProjectInvites(data);
    } catch (error) {
      console.error('Failed to load project invites', error);
    }
  };

  const loadPendingUserInvites = async () => {
    if (!userId) return;
    try {
      const data = await getPendingInvitations(userId);
      setPendingUserInvites(data);
    } catch (error) {
      console.error('Failed to load user invites', error);
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
      const response = await api.get('/api/users/search', { params: { query } });
      const currentMemberIds = new Set(members.map((member) => member.userId));
      const pendingInviteIds = new Set(pendingProjectInvites.map((invite) => invite.invitedUserId));
      setSearchResults(
        response.data.filter((user: SearchResult) => !currentMemberIds.has(user.userId) && !pendingInviteIds.has(user.userId))
      );
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
      await loadProjectInvites();
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setSearchResults((current) => current.filter((user) => user.userName !== username));
      }
      if (error?.response?.status === 409) {
        await loadProjectInvites();
      }
      console.error('Failed to invite member', error);
    }
  };

  const handleAcceptInvitation = async (invitationId: number) => {
    if (!userId) return;
    setIsAcceptingInvitationId(invitationId);
    try {
      await acceptInvitation(invitationId);
      await Promise.all([
        loadPendingUserInvites(),
        currentProject ? loadMembers() : Promise.resolve(),
        currentProject ? loadProjectInvites() : Promise.resolve(),
        fetchProjects(userId),
        currentProject ? fetchTasks(currentProject.projectId) : Promise.resolve(),
      ]);
    } catch (error) {
      console.error('Failed to accept invitation', error);
    } finally {
      setIsAcceptingInvitationId(null);
    }
  };

  const handleRemoveMember = async (member: Member) => {
    if (!currentProject || !userId) return;
    setIsRemovingMemberId(member.userId);
    try {
      await removeMember(currentProject.projectId, member.userId);
      await Promise.all([
        loadMembers(),
        loadProjectInvites(),
        fetchProjects(userId),
        fetchTasks(currentProject.projectId),
      ]);
    } catch (error) {
      console.error('Failed to remove collaborator', error);
    } finally {
      setIsRemovingMemberId(null);
    }
  };

  const handlePromoteMember = async (member: Member) => {
    if (!currentProject) return;
    setIsPromotingMemberId(member.userId);
    try {
      await promoteMember(currentProject.projectId, member.userId);
      await loadMembers();
    } catch (error) {
      console.error('Failed to promote collaborator', error);
    } finally {
      setIsPromotingMemberId(null);
      setPromotionCandidate(null);
    }
  };

  const handleRejectInvitation = async (invitationId: number) => {
    if (!userId) return;
    setIsRejectingInvitationId(invitationId);
    try {
      await rejectInvitation(invitationId);
      await loadPendingUserInvites();
    } catch (error) {
      console.error('Failed to reject invitation', error);
    } finally {
      setIsRejectingInvitationId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-12 animate-fade-in pb-16">
      <section className="rounded-[2.5rem] bg-white/40 backdrop-blur-sm p-8 shadow-sm border border-[var(--color-outline-variant)]/20 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 px-3 py-1">
                <Inbox className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--color-primary)]">Signal Inbox</span>
            </div>
            <h2 className="mt-3 text-4xl font-display font-black uppercase italic tracking-tighter text-[var(--color-on-surface)] md:text-5xl">
              Pending Contexts<span className="text-[var(--color-primary)]">.</span>
            </h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-[var(--color-on-surface-variant)]/60 max-w-lg">
              Incoming stream requests awaiting project allocation and operative acceptance.
            </p>
          </div>
          <div className="rounded-[2rem] bg-white px-8 py-6 shadow-sm border border-[var(--color-outline-variant)]/10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-on-surface-variant)]/40 text-center mb-1">Awaiting Reply</p>
            <p className="text-4xl font-display font-black tracking-tighter text-[var(--color-on-surface)] text-center">{pendingUserInvites.length}</p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {pendingUserInvites.length > 0 ? (
            pendingUserInvites.map((invite) => (
              <div key={invite.invitationId} className="rounded-[2.25rem] bg-white p-6 shadow-sm border border-[var(--color-outline-variant)]/10 hover:shadow-md transition-all group">
                <div className="flex flex-col justify-between h-full gap-6">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--color-primary)] mb-2">{invite.projectName}</p>
                    <p className="text-xl font-display font-black uppercase italic tracking-tighter text-[var(--color-on-surface)]">Invited by {invite.invitedByUserName}</p>
                    <div className="mt-4 rounded-2xl bg-[var(--color-surface-container-low)]/50 px-5 py-4 text-xs font-medium leading-relaxed text-[var(--color-on-surface-variant)]">
                      {invite.projectDescription?.trim() || 'No context description available.'}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => void handleAcceptInvitation(invite.invitationId)}
                      disabled={isAcceptingInvitationId === invite.invitationId || isRejectingInvitationId === invite.invitationId}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-lg shadow-[var(--color-primary)]/20 hover:-translate-y-1 active:scale-95 disabled:opacity-70"
                    >
                      {isAcceptingInvitationId === invite.invitationId ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCheck className="h-4 w-4" />}
                      ACCEPT PROTOCOL
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleRejectInvitation(invite.invitationId)}
                      disabled={isRejectingInvitationId === invite.invitationId || isAcceptingInvitationId === invite.invitationId}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-surface-container-low)] px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-rose-500 transition-all hover:bg-rose-500 hover:text-white active:scale-95 disabled:opacity-70"
                    >
                      {isRejectingInvitationId === invite.invitationId ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                      REJECT
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[2.25rem] bg-white/20 border border-dashed border-[var(--color-outline-variant)] p-12 text-center lg:col-span-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)] opacity-40 italic">Zero Active Context Requests</p>
            </div>
          )}
        </div>
      </section>

      {currentProject ? (
        <>
          <section className="flex flex-col gap-6 rounded-[2.5rem] bg-white/40 backdrop-blur-sm p-8 shadow-sm border border-[var(--color-outline-variant)]/20 md:flex-row md:items-end md:justify-between md:p-10">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">
                  {currentProject.projectName}
                </div>
              </div>
              <h1 className="text-4xl font-display font-black uppercase italic tracking-tighter text-[var(--color-on-surface)] md:text-6xl leading-[0.9]">
                Operatives<span className="text-[var(--color-primary)]">.</span>
              </h1>
              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-on-surface-variant)] opacity-40">Squad Authority & Context Control</p>
            </div>

            <div className="flex flex-wrap gap-4 md:min-w-[320px]">
              <div className="flex-1 rounded-[2rem] bg-white px-6 py-5 shadow-sm border border-[var(--color-outline-variant)]/10">
                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]/40 mb-1">Squad Strength</p>
                <p className="text-3xl font-display font-black tracking-tighter text-[var(--color-on-surface)]">{members.length}</p>
              </div>
              <div className="flex-1 rounded-[2rem] bg-white px-6 py-5 shadow-sm border border-[var(--color-outline-variant)]/10">
                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]/40 mb-1">Lead Architect</p>
                <p className="truncate text-[11px] font-black uppercase tracking-[0.15em] text-[var(--color-primary)] mt-2">{currentProject.user.userName}</p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-12 lg:grid-cols-[400px_minmax(0,1fr)]">
            <div className="space-y-12">
              <div className="space-y-8 rounded-[2.5rem] bg-white/40 backdrop-blur-sm p-8 shadow-sm border border-[var(--color-outline-variant)]/20">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-primary)] mb-4">Recruitment Protocol</h3>
                    <p className="text-sm font-medium leading-relaxed text-[var(--color-on-surface-variant)]/70">
                      {isProjectOwner
                        ? 'Invite operatives by unique handle. Access is strictly granted post-manual verification.'
                        : canInviteMembers
                          ? 'Collaborative architect mode engaged. You hold recruitment authority for this context.'
                          : 'Recruitment protocols are restricted to contextual architects and leads.'}
                    </p>
                  </div>

                  {canInviteMembers ? (
                    <div className="group relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => void handleSearch(e.target.value)}
                        placeholder="Search Operative Handle..."
                        className="w-full rounded-2xl bg-white border border-[var(--color-outline-variant)]/30 px-12 py-4 text-sm font-bold text-[var(--color-on-surface)] outline-none transition-all placeholder:text-[var(--color-on-surface-variant)]/30 focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)] shadow-sm"
                      />
                      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-on-surface-variant)]/30 transition-colors group-focus-within:text-[var(--color-primary)]" />
                      {isSearching && <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[var(--color-primary)]" />}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-4">
                  {canInviteMembers ? (
                    searchResults.length > 0 ? (
                      searchResults.map((user) => (
                        <div
                          key={user.userId}
                          className="group rounded-2xl bg-white p-5 shadow-sm border border-[var(--color-outline-variant)]/5 transition-all hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-4">
                              <img className="h-11 w-11 rounded-xl object-cover bg-[var(--color-surface-container-low)] shadow-sm border border-white" src={`https://i.pravatar.cc/150?u=${user.userName}`} alt={user.userName} />
                              <div className="min-w-0">
                                <p className="truncate text-xs font-black uppercase tracking-widest text-[var(--color-on-surface)]">{user.userName}</p>
                                <p className="truncate text-[10px] font-bold text-[var(--color-on-surface-variant)] opacity-40">{user.userEmail}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => void handleAddMember(user.userName)}
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white transition-all shadow-md active:scale-90"
                              title="Initiate Invitation"
                            >
                              <UserPlus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : searchQuery.length >= 2 && !isSearching ? (
                      <div className="rounded-[2.25rem] bg-white/30 p-8 text-center border border-dashed border-[var(--color-outline-variant)]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)] opacity-40">No matching operative profiles</p>
                      </div>
                    ) : searchQuery.length < 2 && (
                      <div className="rounded-[2.25rem] bg-white/30 p-6 text-center border border-dashed border-[var(--color-outline-variant)]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)] opacity-40">Enter 2+ characters to scan</p>
                      </div>
                    )
                  ) : null}
                </div>
              </div>

              {pendingProjectInvites.length > 0 && (
                <div className="space-y-6 rounded-[2.5rem] bg-white/40 backdrop-blur-sm p-8 shadow-sm border border-[var(--color-outline-variant)]/20">
                   <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-on-surface-variant)]/60">Outgoing Signals</h3>
                    <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-600">
                      {pendingProjectInvites.length} Pending
                    </span>
                  </div>
                  <div className="space-y-4">
                    {pendingProjectInvites.map((invite) => (
                      <div key={invite.invitationId} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-[var(--color-outline-variant)]/5">
                        <div className="flex min-w-0 items-center gap-3">
                           <div className="h-8 w-8 rounded-lg bg-[var(--color-surface-container-low)] flex items-center justify-center">
                              <Clock3 className="h-4 w-4 text-amber-500" />
                           </div>
                           <div className="min-w-0">
                              <p className="truncate text-[11px] font-black uppercase tracking-widest text-[var(--color-on-surface)]">{invite.invitedUserName}</p>
                              <p className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Protocol Signal Sent</p>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-on-surface-variant)]/60">Squad Manifest</h3>
                <span className="rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">
                  {members.length} Active
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {isLoadingMembers ? (
                  [1, 2, 3, 4].map((item) => (
                    <div key={item} className="h-48 rounded-[2.5rem] bg-white/20 animate-pulse border border-[var(--color-outline-variant)]/10" />
                  ))
                ) : (
                  members.map((member) => (
                    <div
                      key={member.userId}
                      className="group flex flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-sm border border-[var(--color-outline-variant)]/5 transition-all hover:-translate-y-1.5 hover:shadow-xl active:scale-[0.99]"
                    >
                      <div className="flex-1 p-8">
                        <div className="mb-8 flex items-start justify-between">
                          <div className="relative">
                            <div className="h-16 w-16 overflow-hidden rounded-2xl bg-[var(--color-surface-container-low)] shadow-inner border-2 border-white transition-transform group-hover:rotate-3">
                              <img className="h-full w-full object-cover" src={`https://i.pravatar.cc/150?u=${member.userName}`} alt={member.userName} />
                            </div>
                            <div className="absolute -bottom-1.5 -right-1.5 h-5 w-5 rounded-full border-4 border-white bg-emerald-500 shadow-lg shadow-emerald-500/30"></div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-3">
                            {Number(member.userId) === Number(currentProject.user.userId) ? (
                              <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-3.5 py-1.5 text-[8px] font-black uppercase tracking-widest text-white shadow-lg shadow-rose-500/20">
                                <Shield className="h-3 w-3" /> Architect
                              </div>
                            ) : member.role === 'CO_OWNER' ? (
                              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3.5 py-1.5 text-[8px] font-black uppercase tracking-widest text-white shadow-lg shadow-amber-500/20">
                                <Shield className="h-3 w-3" /> Co-Architect
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-3.5 py-1.5 text-[8px] font-black uppercase tracking-widest text-white shadow-lg shadow-[var(--color-primary)]/20">
                                Collaborator
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xl font-display font-black uppercase italic tracking-tighter text-[var(--color-on-surface)] leading-none">{member.userName}</p>
                          <p className="text-[10px] font-bold text-[var(--color-on-surface-variant)]/40 uppercase tracking-[0.2em] truncate">{member.userEmail}</p>
                        </div>

                        <div className="mt-8 rounded-[1.5rem] bg-[var(--color-surface-container-low)]/50 p-6 border border-[var(--color-outline-variant)]/5">
                          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--color-on-surface-variant)]/40 mb-3">Access Protocol</p>
                          <p className="text-[11px] font-medium leading-relaxed text-[var(--color-on-surface-variant)]/80">
                            {Number(member.userId) === Number(currentProject.user.userId)
                              ? 'Strategic lead. Owns context parameters and total squad allocation.'
                              : member.role === 'CO_OWNER'
                                ? 'Executive authority. Can verify operatives and manage streams.'
                                : 'Active contributor. Full operational visibility in shared streams.'}
                          </p>
                        </div>
                      </div>

                      {/* Command Footer */}
                      {isProjectOwner && Number(member.userId) !== Number(currentProject.user.userId) && (
                        <div className="border-t border-[var(--color-outline-variant)]/10 bg-[var(--color-surface-container-low)]/30 p-5 flex items-center justify-between gap-4">
                           <div>
                             <p className="text-[8px] font-black uppercase tracking-[0.35em] text-[var(--color-on-surface-variant)]/40 mb-1">Command Protocol</p>
                             <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">Active Management</p>
                           </div>
                           <div className="flex flex-col gap-2">
                              {member.role !== 'CO_OWNER' && (
                                <button
                                  type="button"
                                  onClick={() => setPromotionCandidate(member)}
                                  disabled={isPromotingMemberId === member.userId}
                                  className="h-9 w-9 flex items-center justify-center rounded-xl bg-amber-500 text-white transition-all shadow-md shadow-amber-500/20 hover:bg-amber-600 hover:scale-110 active:scale-95 disabled:opacity-50"
                                  title="Promote Operative"
                                >
                                   <ArrowUpCircle className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => void handleRemoveMember(member)}
                                disabled={isRemovingMemberId === member.userId}
                                className="h-9 w-9 flex items-center justify-center rounded-xl bg-rose-500 text-white transition-all shadow-md shadow-rose-500/20 hover:bg-rose-600 hover:scale-110 active:scale-95 disabled:opacity-50"
                                title="Terminate Access"
                              >
                                {isRemovingMemberId === member.userId ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserMinus className="h-4 w-4" />}
                              </button>
                           </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-[3rem] bg-white/40 backdrop-blur-sm p-12 text-center border border-dashed border-[var(--color-outline-variant)]">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-white shadow-xl text-[var(--color-on-surface-variant)]/20 animate-bounce-slow">
            <Users className="h-12 w-12" />
          </div>
          <h2 className="text-4xl font-display font-black uppercase italic tracking-tighter text-[var(--color-on-surface)]">Awaiting Context Allocation.</h2>
          <p className="mt-4 text-xs font-black uppercase tracking-[0.4em] text-[var(--color-on-surface-variant)] opacity-40">Select a project stream to manage operative squad</p>
        </div>
      )}
      <PromoteCollaboratorModal
        isOpen={Boolean(promotionCandidate)}
        member={promotionCandidate}
        isPromoting={promotionCandidate ? isPromotingMemberId === promotionCandidate.userId : false}
        onClose={() => setPromotionCandidate(null)}
        onConfirm={async () => {
          if (!promotionCandidate) return;
          await handlePromoteMember(promotionCandidate);
        }}
      />
    </div>
  );
};
