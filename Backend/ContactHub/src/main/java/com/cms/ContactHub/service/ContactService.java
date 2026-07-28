package com.cms.ContactHub.service;

import com.cms.ContactHub.dto.*;
import com.cms.ContactHub.entity.Contacts;
import com.cms.ContactHub.entity.Users;
import com.cms.ContactHub.repository.ContactRepository;
import com.cms.ContactHub.repository.UserRepository;
import com.cms.ContactHub.security.CustomUserDetails;
import com.cms.ContactHub.security.SecurityUtils;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class ContactService {
    @Autowired
    private ContactRepository contactRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SecurityUtils securityUtils;

    public CreateContactResponseDTO createContact(@NonNull CreateContactRequestDTO request){
        //        TO AVOID LAZY INITIALIZATION - SECURITY UTILS RETURN LOGGED IN USER ENTITY BUT HIBERNATE SESSION IS NOT ACTIVE BECAUSE OF NOT COLLECTING USER ENTITY FROM DATABASE
        Users user = userRepository.findById(securityUtils.getAuthenticatedUser().getId()).orElseThrow(() -> new RuntimeException("User Not Found!"));
        log.debug("userRepository.findById({}) method called and returned user object.", securityUtils.getAuthenticatedUser().getId());
        Contacts contact = new Contacts(
                request.getFirstName().trim(),
                request.getLastName().trim(),
                request.getEmail().toLowerCase().trim(),
                request.getPhone().trim(),
                request.getAddress().trim()
        );

        contact.setUser(user);
        log.info("Contact Created ({}, {}, {})", contact.getFirstName().concat(contact.getLastName()), contact.getEmail(), contact.getPhone());

//        TO MAINTAIN BI-DIRECTIONAL CONSISTENCY
        user.getContacts().add(contact);

        Contacts savedContact = contactRepository.save(contact);
        log.info("Contact Saved to DB.");

        return new CreateContactResponseDTO(
                savedContact.getId(),
                savedContact.getFirstName() + " " + savedContact.getLastName(),
                savedContact.getPhone(),
                savedContact.getEmail(),
                savedContact.getCreatedAt(),
                "Success: Contact Created!"
        );
    }

    public GetContactsResponseDTO getContacts() {
//        TO AVOID LAZY INITIALIZATION - SECURITY UTILS RETURN LOGGED IN USER ENTITY BUT HIBERNATE SESSION IS NOT ACTIVE BECAUSE OF NOT COLLECTING USER ENTITY FROM DATABASE
        Users user = userRepository.findById(securityUtils.getAuthenticatedUser().getId()).orElseThrow(() -> new RuntimeException("User Not Found!"));
        log.debug("userRepository.findById({}) method called and returned user object.", securityUtils.getAuthenticatedUser().getId());

        if (user.getContacts().isEmpty()){
            log.info("No contacts found!");
            return new GetContactsResponseDTO(null, "No Contacts Found!");
        }

        List<ContactsDTO> listOfContactsDTO = user.getContacts().stream().map(contact -> new ContactsDTO(
                contact.getId(),
                contact.getFirstName(),
                contact.getLastName(),
                contact.getEmail(),
                contact.getPhone(),
                contact.getAddress(),
                contact.isFavourite()
        )).toList();

        log.info("Contacts fetched and returned.");
        return new GetContactsResponseDTO(listOfContactsDTO,"Contacts Fetched Successfully!");
    }

    public UpdateContactResponseDTO updateContact(@NotBlank Long id, @NonNull UpdateContactRequestDTO request) {
        Users user = securityUtils.getAuthenticatedUser();
        log.debug("securityUtils.getAuthenticatedUser() method called and returned authenticated user object.");

//        VERIFY USER AUTHENTICATION - UPDATING CONTACT BY CONTACT ID AND USER ID
        Contacts contact = contactRepository.findByIdAndUserId(id, user.getId());
        log.debug("contactRepository.findByIdAndUserId({}, {}) method called and returned contact object.", id, user.getId());
        contact.setFirstName(request.getFirstName());
        contact.setLastName(request.getLastName());
        contact.setPhone(request.getPhone());
        contact.setEmail(request.getEmail());
        contact.setAddress(request.getAddress());

        contactRepository.save(contact);
        log.info("Contact updated.");
        return new UpdateContactResponseDTO("Contact Updated Successfully!");
    }

    public DeleteContactResponseDTO deleteContact(@NotBlank Long id) {
        Users user = securityUtils.getAuthenticatedUser();
        log.debug("securityUtils.getAuthenticatedUser() method called and returned authenticated user object.");

//        VERIFY USER AUTHENTICATION - DELETING CONTACT BY CONTACT ID AND USER ID
        Contacts contact = contactRepository.findByIdAndUserId(id, user.getId());
        log.debug("contactRepository.findByIdAndUserId({}, {}) method called and returned contact object.", id, user.getId());
        if(contact == null) {
            log.error("Contact not found.");
            throw new RuntimeException("Contact not found!");
        }
        contactRepository.delete(contact);
        log.info("Contact deleted.");
        return new DeleteContactResponseDTO("Contact Deleted Successfully!");
    }

    public MarkFavouriteResponseDTO markFavouriteContact(@NotBlank Long id, @NonNull MarkFavouriteRequestDTO request) {
        Users user = securityUtils.getAuthenticatedUser();
        log.debug("securityUtils.getAuthenticatedUser() method called and returned authenticated user object.");

//        VERIFY USER AUTHENTICATION - UPDATING CONTACT'S FAVOURITE STATUS BY CONTACT ID AND USER ID
        Contacts contact = contactRepository.findByIdAndUserId(id, user.getId());
        log.debug("contactRepository.findByIdAndUserId({}, {}) method called and returned contact object.", id, user.getId());
        contact.setFavourite(request.isFavourite());
        log.info("Contact: {} favourite set = {}", contact.getFirstName().concat(contact.getLastName()), contact.isFavourite());
        contactRepository.save(contact);
        log.info("Contact saved.");
        return new MarkFavouriteResponseDTO("Contact's Favourite Status Updated Successfully!!");
    }

    public CreateContactResponseDTO importContacts(@NonNull CreateContactRequestDTO request) {
        return createContact(request);
    }
}
