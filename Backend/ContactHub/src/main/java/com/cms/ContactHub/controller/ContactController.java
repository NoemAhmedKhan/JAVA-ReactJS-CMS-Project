package com.cms.ContactHub.controller;

import com.cms.ContactHub.dto.*;
import com.cms.ContactHub.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @GetMapping("/contacts")
    public GetContactsResponseDTO getContacts(){
        return contactService.getContacts();
    }

    @PostMapping("/contacts/create")
    public CreateContactResponseDTO createContact(@RequestBody @Valid CreateContactRequestDTO request){
        return contactService.createContact(request);
    }

    @PutMapping("/contacts/update/{id}")
    public UpdateContactResponseDTO updateContact(@PathVariable Long id, @RequestBody @Valid UpdateContactRequestDTO request){
        return contactService.updateContact(id, request);
    }

    @DeleteMapping("/contacts/delete/{id}")
    public DeleteContactResponseDTO deleteContact(@PathVariable Long id){
        return contactService.deleteContact(id);
    }

    @PutMapping("/contacts/{id}/favourite")
    public MarkFavouriteResponseDTO markFavouriteContact(@PathVariable Long id, @RequestBody MarkFavouriteRequestDTO request){
        return contactService.markFavouriteContact(id, request);
    }
}
