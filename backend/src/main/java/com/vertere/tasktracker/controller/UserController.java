package com.vertere.tasktracker.controller;

import com.vertere.tasktracker.entity.User;
import com.vertere.tasktracker.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService){
        this.userService=userService;
    }

    @GetMapping
    public List<User> findAllUsers(){
        return userService.findAllUsers();
    }

    @GetMapping("/{userId}")
    public User findUserById(@PathVariable Integer userId){
        return userService.findUserById(userId);
    }

    @PutMapping
    public User saveUser(@RequestBody User user){
        return userService.saveUser(user);
    }

    @DeleteMapping("/{userId}")
    public void deleteUserById(@PathVariable Integer userId){
        userService.deleteUserById(userId);
    }

    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam String query) {
        return userService.searchByUsername(query);
    }
}
