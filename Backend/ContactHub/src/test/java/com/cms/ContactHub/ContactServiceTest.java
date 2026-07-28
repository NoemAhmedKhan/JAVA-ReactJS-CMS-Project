package com.cms.ContactHub;

import com.cms.ContactHub.dto.*;
import com.cms.ContactHub.entity.Contacts;
import com.cms.ContactHub.entity.Users;
import com.cms.ContactHub.repository.ContactRepository;
import com.cms.ContactHub.repository.UserRepository;
import com.cms.ContactHub.security.SecurityUtils;
import com.cms.ContactHub.service.ContactService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {
    @Mock
    ContactRepository contactRepository;
    @Mock
    UserRepository userRepository;
    @Mock
    SecurityUtils securityUtils;

    @InjectMocks
    ContactService contactService;

    @Test
    void createContact_success_test(){
        CreateContactRequestDTO request = new CreateContactRequestDTO();
        request.setFirstName("Ahmed");
        request.setLastName("Ali");
        request.setEmail("ahmedali@gmail.com");
        request.setPhone("+923332155611");
        request.setAddress("Near square tower.");

        Users user = new Users("Hamza", "hamza@gmail.com", "hamza@123");
        user.setId(1L);
        when(securityUtils.getAuthenticatedUser()).thenReturn(user);
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));

        Contacts contact = new Contacts(
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                request.getPhone(),
                request.getAddress()
        );

        when(contactRepository.save(any())).thenReturn(contact);
        CreateContactResponseDTO response = contactService.createContact(request);

//        ASSERTIONS
        Assertions.assertNotNull(response);
        Assertions.assertEquals("Success: Contact Created!", response.getMessage());
    }

    @Test
    void createContact_null_user_test() {
        CreateContactRequestDTO request = new CreateContactRequestDTO();
        request.setFirstName("Ahmed");
        request.setLastName("Ali");
        request.setEmail("ahmedali@gmail.com");
        request.setPhone("+923332155611");
        request.setAddress("Near square tower.");

        Users user = null;
        when(securityUtils.getAuthenticatedUser()).thenReturn(user);

//        ASSERTIONS
        Assertions.assertThrows(
                RuntimeException.class,
                () -> contactService.createContact(request)
        );
    }

    @Test
    void createContact_user_not_exist_test(){
        CreateContactRequestDTO request = new CreateContactRequestDTO();
        request.setFirstName("Ahmed");
        request.setLastName("Ali");
        request.setEmail("ahmedali@gmail.com");
        request.setPhone("+923332155611");
        request.setAddress("Near square tower.");

        Users user = new Users("Hamza", "hamza@gmail.com", "hamza@123");
        user.setId(1L);
        when(securityUtils.getAuthenticatedUser()).thenReturn(user);
        when(userRepository.findById(anyLong())).thenReturn(null);

        //        ASSERTIONS
        Assertions.assertThrows(
                RuntimeException.class,
                () -> contactService.createContact(request)
        );
    }

    @Test
    void createContact_null_contact_test() {
        CreateContactRequestDTO request = new CreateContactRequestDTO();
        request.setFirstName("Ahmed");
        request.setLastName("Ali");
        request.setEmail("ahmedali@gmail.com");
        request.setPhone("+923332155611");
        request.setAddress("Near square tower.");

        Users user = new Users("Hamza", "hamza@gmail.com", "hamza@123");
        user.setId(1L);
        when(securityUtils.getAuthenticatedUser()).thenReturn(user);
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));

        Contacts contact = null;
        when(contactRepository.save(any())).thenReturn(contact);

//        ASSERTIONS
        Assertions.assertThrows(
                NullPointerException.class,
                () -> contactService.createContact(request)
        );
    }

    @Test
    void getContacts_success_test(){
            Users user = new Users("Hamza", "hamza@gmail.com", "hamza@123");
            user.setId(1L);

            Contacts contact_1 = new Contacts("Saqib", "Ali", "saqibali@gmail.com", "+923345996010", "Karachi");
            contact_1.setId(1L);
            contact_1.setUser(user);
            Contacts contact_2 = new Contacts("Fasiq", "Shah", "fasiqshah@gmail.com", "+923455016550", "Karachi");
            contact_2.setId(2L);
            contact_2.setUser(user);
            Contacts contact_3 = new Contacts("Junaid", "Khan", "junaidkhan@gmail.com", "+923355822010", "Lahore");
            contact_3.setId(3L);
            contact_3.setUser(user);

            user.setContacts(List.of(contact_1, contact_2, contact_3));

            when(securityUtils.getAuthenticatedUser()).thenReturn(user);
            when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));

            GetContactsResponseDTO response = contactService.getContacts();

//            ASSERTIONS
        Assertions.assertNotNull(response.getContacts());
        Assertions.assertEquals("Contacts Fetched Successfully!", response.getMessage());
    }

    @Test
    void getContacts_no_contacts_found_test(){
        Users user = new Users("Hamza", "hamza@gmail.com", "hamza@123");
        user.setId(1L);

        when(securityUtils.getAuthenticatedUser()).thenReturn(user);
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));
        GetContactsResponseDTO response = contactService.getContacts();

//            ASSERTIONS
        Assertions.assertNull(response.getContacts());
        Assertions.assertEquals("No Contacts Found!", response.getMessage());
    }

    @Test
    void updateContact_success_test() {
        UpdateContactRequestDTO request = new UpdateContactRequestDTO("Fahad", "Khan", "fahadkhan@gmail.com", "+923347016223", "Karachi");

        Users user = new Users("Hamza", "hamza@gmail.com", "hamza@123");
        user.setId(1L);

        Contacts contact = new Contacts("Saqib", "Ali", "saqibali@gmail.com", "+923345996010", "Karachi");
        contact.setId(10L);
        contact.setUser(user);

        when(securityUtils.getAuthenticatedUser()).thenReturn(user);
        when(contactRepository.findByIdAndUserId(anyLong(), anyLong())).thenReturn(contact);

        UpdateContactResponseDTO response = contactService.updateContact(user.getId(), request);

//        ASSERTIONS
        Assertions.assertNotNull(response);
        Assertions.assertEquals("Contact Updated Successfully!", response.getMessage());
    }

    @Test
    void updateContact_contact_not_found_test() {
        UpdateContactRequestDTO request = new UpdateContactRequestDTO("Fahad", "Khan", "fahadkhan@gmail.com", "+923347016223", "Karachi");

        Users user = new Users("Hamza", "hamza@gmail.com", "hamza@123");
        user.setId(1L);

        Contacts contact = new Contacts("Saqib", "Ali", "saqibali@gmail.com", "+923345996010", "Karachi");
        contact.setId(10L);
        contact.setUser(user);

        when(securityUtils.getAuthenticatedUser()).thenReturn(user);
        when(contactRepository.findByIdAndUserId(anyLong(), anyLong())).thenReturn(null);

//        ASSERTIONS
        Assertions.assertThrows(
                RuntimeException.class,
                () -> contactService.updateContact(user.getId(), request)
        );
    }

    @Test
    void deleteContact_success_test() {
        Long id = 1L;
        Users user = new Users("Hamza", "hamza@gmail.com", "hamza@123");
        user.setId(10L);
        Contacts contact = new Contacts("Saqib", "Ali", "saqibali@gmail.com", "+923345996010", "Karachi");
        contact.setId(1L);
        contact.setUser(user);

        when(securityUtils.getAuthenticatedUser()).thenReturn(user);
        when(contactRepository.findByIdAndUserId(anyLong(), anyLong())).thenReturn(contact);

        DeleteContactResponseDTO response = contactService.deleteContact(id);

//        ASSERTIONS
        Assertions.assertEquals("Contact Deleted Successfully!", response.getMessage());
    }

    @Test
    void deleteContact_contact_not_found_test() {
        Long id = 1L;
        Users user = new Users("Hamza", "hamza@gmail.com", "hamza@123");
        user.setId(10L);
        Contacts contact = null;

        when(securityUtils.getAuthenticatedUser()).thenReturn(user);
        when(contactRepository.findByIdAndUserId(anyLong(), anyLong())).thenReturn(contact);

//        ASSERTIONS
        Assertions.assertThrows(
                RuntimeException.class,
                () -> contactService.deleteContact(id)
        );
    }

    @Test
    void markFavouriteContact_success_test() {
        Long id = 1L;
        MarkFavouriteRequestDTO request = new MarkFavouriteRequestDTO(true);
        Users user = new Users("Hamza", "hamza@gmail.com", "hamza@123");
        user.setId(10L);
        Contacts contact = new Contacts("Saqib", "Ali", "saqibali@gmail.com", "+923345996010", "Karachi");
        contact.setId(1L);
        contact.setUser(user);

        when(securityUtils.getAuthenticatedUser()).thenReturn(user);
        when(contactRepository.findByIdAndUserId(anyLong(), anyLong())).thenReturn(contact);
        MarkFavouriteResponseDTO response = contactService.markFavouriteContact(id, request);

//        ASSERTIONS
        Assertions.assertNotNull(response);
        Assertions.assertEquals("Contact's Favourite Status Updated Successfully!!", response.getMessage());
    }

    @Test
    void markFavouriteContact_contact_not_found_test() {
        Long id = 1L;
        MarkFavouriteRequestDTO request = new MarkFavouriteRequestDTO(true);
        Users user = new Users("Hamza", "hamza@gmail.com", "hamza@123");
        user.setId(10L);
        Contacts contact = null;

        when(securityUtils.getAuthenticatedUser()).thenReturn(user);
        when(contactRepository.findByIdAndUserId(anyLong(), anyLong())).thenReturn(contact);

//        ASSERTIONS
        Assertions.assertThrows(
                NullPointerException.class,
                () -> contactService.markFavouriteContact(id, request)
        );
    }

    @Test
    void importContacts_success_test(){
        createContact_success_test();
    }
}
