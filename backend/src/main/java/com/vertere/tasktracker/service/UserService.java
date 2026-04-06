package com.vertere.tasktracker.service;

import com.vertere.tasktracker.entity.User;

import java.util.List;

public interface UserService {
    public List<User> findAllUsers();
    public User findUserById(Integer userId);
    public User saveUser(User user);
    public void deleteUserById(Integer userId);
    java.util.List<User> searchByUsername(String query);
    java.util.Optional<User> findByUsername(String username);
}
