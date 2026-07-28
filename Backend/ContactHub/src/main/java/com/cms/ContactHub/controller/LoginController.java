package com.cms.ContactHub.controller;

import com.cms.ContactHub.dto.LoginRequestDTO;
import com.cms.ContactHub.dto.LoginResponseDTO;
import com.cms.ContactHub.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class LoginController {
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public LoginResponseDTO getUser(@RequestBody @Valid LoginRequestDTO request){ return userService.authenticateUser(request); }
}