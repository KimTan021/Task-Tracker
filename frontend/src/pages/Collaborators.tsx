import React, { useEffect, useState } from 'react';
import { Search, UserPlus, Shield, Users, Mail, Loader2, Inbox, CheckCheck, Clock3, UserMinus, XCircle } from 'lucide-react';
import { useAuthStore } from '../hooks/useAuthStore';
import { useProjectStore } from '../hooks/useProjectStore';
import { useTaskStore } from '../hooks/useTaskStore';
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
  const { currentProject, addMember, getMembers, removeMember, getPendingInvitations, getPendingInvitationsForProject, acceptInvitation, rejectInvitation, fetchProjects } = useProjectStore();
  const { fetchTasks } = useTaskStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [pendingProjectInvites, setPendingProjectInvites] = useState<Invitation[]>([]);
  const [pendingUserInvites, setPendingUserInvites] = useState<Invitation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isLoadingInvites, setIsLoadingInvites] = useState(false);
  const [isAcceptingInvitationId, setIsAcceptingInvitationId] = useState<number | null>(null);
  const [isRejectingInvitationId, setIsRejectingInvitationId] = useState<number | null>(null);
  const [isRemovingMemberId, setIsRemovingMemberId] = useState<number | null>(null);

  const isProjectOwner = currentProject && userId ? currentProject.user.userId === userId : false;

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
    setIsLoadingInvites(true);
    try {
      const data = await getPendingInvitationsForProject(currentProject.projectId);
      setPendingProjectInvites(data);
    } catch (error) {
      console.error('Failed to load project invites', error);
    } finally {
      setIsLoadingInvites(false);
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
    <div className="mx-auto max-w-6xl space-y-10 animate-fade-in">
      <section className="rounded-[2rem] bg-[var(--color-surface-container-low)] p-6 shadow-[0_24px_48px_rgba(28,27,27,0.04)] md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-400">Inbox</p>
            <h2 className="mt-3 text-3xl font-display font-black uppercase italic tracking-tighter text-slate-900">
              Pending Invites<span className="text-indigo-600">.</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-on-surface-variant)]/78">
              Invitations only grant access after the recipient accepts them.
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-4 shadow-[0_18px_36px_rgba(28,27,27,0.05)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Awaiting Your Reply</p>
            <p className="mt-2 text-3xl font-display font-black tracking-tight text-slate-800">{pendingUserInvites.length}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {pendingUserInvites.length > 0 ? (
            pendingUserInvites.map((invite) => (
              <div key={invite.invitationId} className="rounded-[2rem] bg-white p-5 shadow-[0_18px_36px_rgba(28,27,27,0.05)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">{invite.projectName}</p>
                    <p className="mt-2 text-lg font-black uppercase tracking-tight text-slate-900">Invited by {invite.invitedByUserName}</p>
                    <p className="mt-3 rounded-2xl bg-[var(--color-surface-container-low)] px-4 py-3 text-sm leading-relaxed text-slate-600">
                      {invite.projectDescription?.trim() || 'No project description was provided.'}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-600">
                      <Inbox className="h-3.5 w-3.5" />
                      Awaiting acceptance
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => void handleAcceptInvitation(invite.invitationId)}
                      disabled={isAcceptingInvitationId === invite.invitationId || isRejectingInvitationId === invite.invitationId}
                      className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-[10px] font-black uppercase tracking-[0.22em] text-white transition-all hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
                    >
                      {isAcceptingInvitationId === invite.invitationId ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCheck className="h-4 w-4" />}
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleRejectInvitation(invite.invitationId)}
                      disabled={isRejectingInvitationId === invite.invitationId || isAcceptingInvitationId === invite.invitationId}
                      className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-[10px] font-black uppercase tracking-[0.22em] text-rose-500 transition-all hover:-translate-y-0.5 hover:bg-rose-500 hover:text-white disabled:cursor-wait disabled:opacity-70"
                    >
                      {isRejectingInvitationId === invite.invitationId ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[2rem] bg-white/70 p-8 text-center lg:col-span-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No pending invites for your account</p>
            </div>
          )}
        </div>
      </section>

      {currentProject ? (
        <>
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
                {isProjectOwner
                  ? 'Invite teammates by username. They appear as collaborators only after they accept.'
                  : 'Only the project owner can send collaborator invites for this project.'}
              </p>
            </div>

            {isProjectOwner ? (
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
            ) : null}
          </div>

          <div className="space-y-3">
            {isProjectOwner ? (
              searchResults.length > 0 ? (
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
                        title="Send invite"
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
              )
            ) : (
              <div className="rounded-3xl bg-white/70 p-8 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Invite controls are limited to the project owner</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="ml-1 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Pending For Project</h3>
              <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                {pendingProjectInvites.length} invites
              </span>
            </div>
            {isLoadingInvites ? (
              <div className="rounded-3xl bg-white/55 p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading invites</p>
              </div>
            ) : pendingProjectInvites.length > 0 ? (
              pendingProjectInvites.map((invite) => (
                <div key={invite.invitationId} className="rounded-2xl bg-white p-4 shadow-[0_14px_32px_rgba(28,27,27,0.05)]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-black uppercase tracking-widest text-slate-800">{invite.invitedUserName}</p>
                      <div className="mt-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-amber-600">
                        <Clock3 className="h-3.5 w-3.5" />
                        Pending acceptance
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl bg-white/55 p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No pending invites for this project</p>
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
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-indigo-50 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-indigo-500">
                          Collaborator
                        </div>
                        {isProjectOwner ? (
                          <button
                            type="button"
                            onClick={() => void handleRemoveMember(member)}
                            disabled={isRemovingMemberId === member.userId}
                            className="flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-rose-500 transition-all hover:bg-rose-500 hover:text-white disabled:cursor-wait disabled:opacity-70"
                            title="Remove collaborator"
                          >
                            {isRemovingMemberId === member.userId ? <Loader2 className="h-3 w-3 animate-spin" /> : <UserMinus className="h-3 w-3" />}
                            Remove
                          </button>
                        ) : null}
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
        </>
      ) : (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-[2rem] bg-[var(--color-surface-container-low)] p-10 text-center shadow-[0_24px_48px_rgba(28,27,27,0.04)]">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-slate-300">
            <Users className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-display font-black uppercase italic tracking-tighter text-slate-800">No Active Context</h2>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">Select or initiate a project to manage collaborators</p>
        </div>
      )}
    </div>
  );
};
