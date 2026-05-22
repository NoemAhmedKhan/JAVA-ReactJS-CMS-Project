package com.cms.ContactHub.controller;

import com.cms.ContactHub.dto.SignupRequestDTO;
import com.cms.ContactHub.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class SignupRequest {

    @Autowired
    private UserService userService;

//    @GetMapping("/signup")
//    public void getUser(){
//
//    }

    @PostMapping("/signup")
    public String createUser(@RequestBody @Valid SignupRequestDTO data){
        System.out.println(data);
        return userService.signupUser(data);
    }
}
