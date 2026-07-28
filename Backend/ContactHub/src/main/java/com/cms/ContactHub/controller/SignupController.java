package com.cms.ContactHub.controller;

import com.cms.ContactHub.dto.SignupRequestDTO;
import com.cms.ContactHub.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class SignupController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public String createUser(@RequestBody @Valid SignupRequestDTO data){
        return userService.signupUser(data);
    }
}
