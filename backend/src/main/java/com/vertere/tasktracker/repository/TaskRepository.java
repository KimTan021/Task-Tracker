package com.vertere.tasktracker.repository;

import com.vertere.tasktracker.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findByProject_User_UserEmail(String userEmail);
    List<Task> findByProject_User_UserEmailAndArchivedFalse(String userEmail);

    @Query("""
        select distinct t
        from Task t
        left join fetch t.assignees a
        left join t.project.members m
        where t.archived = false
          and (t.project.user.userEmail = :userEmail or m.userEmail = :userEmail)
    """)
    List<Task> findAccessibleTasks(@Param("userEmail") String userEmail);

    @Query("""
        select distinct t
        from Task t
        left join fetch t.assignees a
        left join t.project.members m
        where t.taskId = :taskId
          and (t.project.user.userEmail = :userEmail or m.userEmail = :userEmail)
    """)
    Optional<Task> findAccessibleTaskById(@Param("taskId") Integer taskId, @Param("userEmail") String userEmail);

    @Query("""
        select distinct t
        from Task t
        join fetch t.assignees a
        where t.project.projectId = :projectId
          and a.userId = :userId
    """)
    List<Task> findProjectTasksAssignedToUser(@Param("projectId") Integer projectId, @Param("userId") Integer userId);

    @Modifying
    void deleteByProject_ProjectId(Integer projectId);
}
