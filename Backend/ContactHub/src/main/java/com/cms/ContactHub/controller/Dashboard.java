package com.cms.ContactHub.controller;

import com.cms.ContactHub.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Dashboard {

    @GetMapping("/dashboard")
    public String Dashboard(){
        return "Dashboard Access Granted!";
    }
}
