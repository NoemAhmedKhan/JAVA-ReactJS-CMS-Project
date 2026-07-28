package com.cms.ContactHub.controller;

import com.cms.ContactHub.dto.*;
import com.cms.ContactHub.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    @Autowired
    private ContactService contactService;

    @GetMapping("/dashboard")
    public GetContactsResponseDTO getContacts(){
        return contactService.getContacts();
    }

    @PostMapping("/dashboard/importcontacts")
    public CreateContactResponseDTO importContacts(@RequestBody @Valid CreateContactRequestDTO request){
        return contactService.importContacts(request);
    }
}
