package com.vertere.tasktracker.repository;

import com.vertere.tasktracker.entity.ProjectInvitation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectInvitationRepository extends JpaRepository<ProjectInvitation, Integer> {
    boolean existsByProject_ProjectIdAndInvitedUser_UserIdAndStatus(Integer projectId, Integer invitedUserId, String status);
    Optional<ProjectInvitation> findByProject_ProjectIdAndInvitedUser_UserId(Integer projectId, Integer invitedUserId);
    List<ProjectInvitation> findAllByInvitedUser_UserIdAndStatusOrderByCreatedAtDesc(Integer userId, String status);
    List<ProjectInvitation> findAllByProject_ProjectIdAndStatusOrderByCreatedAtDesc(Integer projectId, String status);
    Optional<ProjectInvitation> findByProjectInvitationIdAndStatus(Integer projectInvitationId, String status);
}
