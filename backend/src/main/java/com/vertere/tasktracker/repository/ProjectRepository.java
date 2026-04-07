package com.vertere.tasktracker.repository;

import com.vertere.tasktracker.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Integer> {
    Optional<Project> findFirstByUser_UserEmail(String userEmail);
    List<Project> findAllByMembers_UserId(Integer userId);

    @Query("""
        select distinct p
        from Project p
        left join p.members m
        where p.projectId = :projectId
          and (p.user.userEmail = :userEmail or m.userEmail = :userEmail)
    """)
    Optional<Project> findAccessibleProject(@Param("projectId") Integer projectId, @Param("userEmail") String userEmail);
}
