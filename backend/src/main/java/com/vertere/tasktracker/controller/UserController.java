package com.vertere.tasktracker.controller;

import com.vertere.tasktracker.entity.User;
import com.vertere.tasktracker.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "Endpoints for managing users and user-related data")
@SecurityRequirement(name = "bearerAuth")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService){
        this.userService=userService;
    }

    @GetMapping
    @Operation(summary = "Find all users in the database")
    public List<User> findAllUsers(){
        return userService.findAllUsers();
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Find a user based on provided id number")
    public User findUserById(@PathVariable Integer userId){
        return userService.findUserById(userId);
    }

    @PutMapping
    @Operation(summary = "Save user data")
    public User saveUser(@RequestBody User user){
        return userService.saveUser(user);
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "Delete a user based on provided id number")
    public void deleteUserById(@PathVariable Integer userId){
        userService.deleteUserById(userId);
    }

    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam String query) {
        return userService.searchByUsername(query);
    }
}
