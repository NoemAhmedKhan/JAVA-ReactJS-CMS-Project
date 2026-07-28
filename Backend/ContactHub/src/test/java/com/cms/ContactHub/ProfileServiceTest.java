package com.cms.ContactHub;

import com.cms.ContactHub.dto.*;
import com.cms.ContactHub.entity.Users;
import com.cms.ContactHub.repository.UserRepository;
import com.cms.ContactHub.security.JwtService;
import com.cms.ContactHub.security.SecurityUtils;
import com.cms.ContactHub.service.ProfileService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private JwtService jwtService;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private SecurityUtils securityUtils;

    @InjectMocks
    ProfileService profileService;

    @Test
    void getProfile_success_test(){
        Users user = new Users("Aslam", "Aslam@gmail.com", "Aslam@123");
        when(securityUtils.getAuthenticatedUser()).thenReturn(user);

        ProfileResponseDTO response = profileService.getProfile();

//        ASSERTIONS
        Assertions.assertNotNull(response);
        Assertions.assertEquals("Aslam", response.getFullName());
        Assertions.assertEquals("Aslam@gmail.com", response.getEmail());
        Assertions.assertEquals("Profile Returned", response.getMessage());
    }

    @Test
    void getProfile_failure_test(){
        Users user = null;
        when(securityUtils.getAuthenticatedUser()).thenReturn(user);
        ProfileResponseDTO response = profileService.getProfile();

//        ASSERTIONS
        Assertions.assertEquals(null, response);
    }

    @Test
    void updateProfile_success_test(){
        UpdateProfileRequestDTO request = new UpdateProfileRequestDTO("Farooq", "farooq@gmail.com");

        Users user = new Users("Aslam", "Aslam@gmail.com", "Aslam@123");
        when(securityUtils.getAuthenticatedUser()).thenReturn(user);
        when(userRepository.findById(any())).thenReturn(Optional.of(user));
        when(jwtService.generateToken(anyString())).thenReturn("FAKE-JWT-TOKEN");
        UpdateProfileResponseDTO response = profileService.updateProfile(request);

//        ASSERTIONS
        Assertions.assertNotNull(response);
        Assertions.assertEquals("FAKE-JWT-TOKEN", response.getToken());
        Assertions.assertEquals("Farooq", response.getMap().get("fullName"));
        Assertions.assertEquals("farooq@gmail.com", response.getMap().get("email"));
        Assertions.assertEquals("Profile Updated Successfully!", response.getMessage());
    }

    @Test
    void updateProfile_null_user_test(){
        UpdateProfileRequestDTO request = new UpdateProfileRequestDTO("Farooq", "farooq@gmail.com");

        Users user = null;
        when(securityUtils.getAuthenticatedUser()).thenReturn(user);

//        ASSERTIONS
        Assertions.assertThrows(
                RuntimeException.class,
                () -> profileService.updateProfile(request)
        );
    }

    @Test
    void updateProfile_user_not_found_test(){
        UpdateProfileRequestDTO request = new UpdateProfileRequestDTO("Farooq", "farooq@gmail.com");

        Users user = new Users("Salman", "salman@gmail.com", "Salman@123");
        when(securityUtils.getAuthenticatedUser()).thenReturn(user);
        when(userRepository.findById(user.getId())).thenThrow(new RuntimeException("User not found!"));

//        ASSERTIONS
        Assertions.assertThrows(
                RuntimeException.class,
                () -> profileService.updateProfile(request)
        );
    }

    @Test
    void changePassword_success_test(){
        ChangePasswordRequestDTO request = new ChangePasswordRequestDTO("Ahmed@123", "123@Ahmed");
        Users user = new Users("Ahmed", "Ahmed@gmail.com", "Ahmed@123");
        when(securityUtils.getAuthenticatedUser()).thenReturn(user);
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(passwordEncoder.encode(anyString())).thenReturn("NEW-ENCODED-PASSWORD");
        ChangePasswordResponseDTO response = profileService.changePassword(request);

//        ASSERTIONS
        Assertions.assertNotNull(response);
        Assertions.assertEquals("Password Changed Successfully!", response.getMessage());
    }

    @Test
    void changePassword_null_user_test(){
        ChangePasswordRequestDTO request = new ChangePasswordRequestDTO("Ahmed@123", "123@Ahmed");
        Users user = null;
        when(securityUtils.getAuthenticatedUser()).thenReturn(user);

//        ASSERTIONS
        Assertions.assertThrows(
                RuntimeException.class,
                () -> profileService.changePassword(request)
        );
    }

    @Test
    void changePassword_password_match_failure_test(){
        ChangePasswordRequestDTO request = new ChangePasswordRequestDTO("Ahmed@123", "123@Ahmed");
        Users user = new Users("Ahmed", "Ahmed@gmail.com", "Ahmedali@123");
        when(securityUtils.getAuthenticatedUser()).thenReturn(user);
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

//        ASSERTIONS
        Assertions.assertThrows(
                ResponseStatusException.class,
                () -> profileService.changePassword(request)
        );
    }
}
