package com.vertere.tasktracker.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "task")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Integer taskId;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "task_name", nullable = false)
    private String taskName;

    @Column(name = "task_description", nullable = true)
    private String taskDescription;

    @Column(name = "task_status", nullable = false)
    private String taskStatus;

    @Column(name = "task_date_due", nullable = true)
    private LocalDateTime taskDateDue;

    @Column(name = "task_start_date", nullable = true)
    private LocalDateTime taskStartDate;

    @Column(name = "task_priority", nullable = true)
    private String taskPriority;

    @Column(name = "task_tags", nullable = true)
    private String taskTags;

    @Column(name = "assignee_name", nullable = true, length = 512)
    private String assigneeName;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "task_assignee",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> assignees = new LinkedHashSet<>();

    @Column(name = "archived", nullable = false)
    private Boolean archived = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        updatedAt = now;
        if (archived == null) {
            archived = false;
        }
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (archived == null) {
            archived = false;
        }
    }
}
