package com.cms.ContactHub;

import com.cms.ContactHub.dto.LoginRequestDTO;
import com.cms.ContactHub.dto.LoginResponseDTO;
import com.cms.ContactHub.dto.SignupRequestDTO;
import com.cms.ContactHub.entity.Users;
import com.cms.ContactHub.repository.UserRepository;
import com.cms.ContactHub.security.JwtService;
import com.cms.ContactHub.service.UserService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    UserRepository userRepository;
    @Mock
    PasswordEncoder passwordEncoder;
    @Mock
    AuthenticationManager authenticationManager;
    @Mock
    JwtService jwtToken;

    @InjectMocks
    UserService userService;

    @Test
    void signupUserTest(){
        SignupRequestDTO request = new SignupRequestDTO();
        request.setFullName("fasih");
        request.setEmail("fasih@gmail.com");
        request.setPassword("fasih@123");

        String response = userService.signupUser(request);

        // ASSERTIONS
        Assertions.assertEquals("Account Created!", response);
    }

    @Test
    void userAlreadyExistTest(){
        SignupRequestDTO request = new SignupRequestDTO();
        request.setFullName("salman");
        request.setEmail("salman@gmail.com");
        request.setPassword("salman@123");

        Users user = new Users();
        user.setEmail(request.getEmail());

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        String response = userService.signupUser(request);

        // ASSERTIONS
        Assertions.assertEquals("User Already Exist!", response);
    }

    @Test
    void userLoginSuccessTest(){
        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(auth.isAuthenticated()).thenReturn(true);

        LoginRequestDTO request = new LoginRequestDTO("salman@gmail.com", "salman@123");
        Users user = new Users();
        user.setEmail(request.getEmail());
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        when(jwtToken.generateToken(user.getEmail())).thenReturn("FAKE-JWT-TOKEN");

        LoginResponseDTO response = userService.authenticateUser(request);

//        ASSERTIONS
        Assertions.assertNotNull(response);
        Assertions.assertEquals("FAKE-JWT-TOKEN", response.getToken());
        Assertions.assertNotNull(response.getMap());
        Assertions.assertEquals("Login Successful!", response.getMessage());
    }

    @Test
    void userLoginFailureTest(){
        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(auth.isAuthenticated()).thenReturn(false);

        LoginRequestDTO request = new LoginRequestDTO("salman@gmail.com", "salman@123");

        LoginResponseDTO response = userService.authenticateUser(request);

//        ASSERTIONS
        Assertions.assertNull(response);
    }
}
