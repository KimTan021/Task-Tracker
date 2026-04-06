package com.vertere.tasktracker.service.implementation;

import com.vertere.tasktracker.entity.User;
import com.vertere.tasktracker.repository.UserRepository;
import com.vertere.tasktracker.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImplementation implements UserService {
    private final UserRepository userRepository;

    public UserServiceImplementation(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public List<User> findAllUsers(){
        return userRepository.findAll();
    }

    @Override
    public User findUserById(Integer userId){
        return userRepository.findById(userId).orElse(null);
    }

    @Override
    public User saveUser(User user){
        return userRepository.save(user);
    }

    @Override
    public void deleteUserById(Integer userId){
        userRepository.deleteById(userId);
    }



}
