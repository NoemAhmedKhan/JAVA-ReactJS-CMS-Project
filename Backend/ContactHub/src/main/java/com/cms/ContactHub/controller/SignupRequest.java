package com.cms.ContactHub.controller;

import com.cms.ContactHub.dto.SignupRequestDTO;
import com.cms.ContactHub.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.http.HttpResponse;

@RestController
public class SignupRequest {

    private UserService userService;

    @PostMapping('/signup')
    public void createUser(@RequestBody @Valid SignupRequestDTO data){
        userService.signupUser(data);
    }
}
