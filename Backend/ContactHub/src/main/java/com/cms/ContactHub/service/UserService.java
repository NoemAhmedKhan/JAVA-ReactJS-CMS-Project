package com.cms.ContactHub.service;

import com.cms.ContactHub.dto.LoginRequestDTO;
import com.cms.ContactHub.dto.LoginResponseDTO;
import com.cms.ContactHub.dto.SignupRequestDTO;
import com.cms.ContactHub.entity.Users;
import com.cms.ContactHub.repository.UserRepository;
import com.cms.ContactHub.security.JwtService;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtToken;

    public String signupUser(@NonNull SignupRequestDTO data){
        //  DUPLICATE EMAIL VALIDATION
        Optional<Users> user = userRepository.findByEmail(data.getEmail().toLowerCase().trim());
        log.debug("userRepository.findByEmail({}) method called and returned object.", data.getEmail());
        if(user.isPresent()) {
            log.error("User already registered with this {} ", user.get().getEmail());
            return "User Already Exist!";
        }
//        ENCODE PASSWORD
        String encodedPassword = passwordEncoder.encode(data.getPassword());
        log.info("Password encoded!");
//        CREATE USER ENTITY
        Users userEntity = new Users(data.getFullName(), data.getEmail().toLowerCase().trim(), encodedPassword);
        log.debug("User object created.");
        userRepository.save(userEntity);
        log.debug("userRepository.save() method called and user ({}, {}, {}) saved to DB.", userEntity.getId(), userEntity.getFullName(), userEntity.getEmail());
        log.info("User registered with this {} ", userEntity.getEmail());
        return "Account Created!";
    }

    public LoginResponseDTO authenticateUser(@NonNull LoginRequestDTO request){
        try {
            Authentication authToken = new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword());
            log.debug("UsernamePasswordAuthenticationToken(email, password) method called and returned authentication token.");
            Authentication authObj = authenticationManager.authenticate(authToken);
            log.debug("authenticationManager.authenticate(auth token) method called and returned authentication object.");
            if(authObj.isAuthenticated()){
                log.info("User is authenticated!");
                Optional<Users> user = userRepository.findByEmail(request.getEmail().toLowerCase().trim());
                if(user.isEmpty()) {
                    log.info("User not found!");
                    throw new RuntimeException("User not found");
                }
                Users actualUser = user.get();
                log.debug("User fetched!");

                Map<String, String> map = new HashMap<>();
                map.put("fullName", actualUser.getFullName());
                map.put("email", actualUser.getEmail());

                String token = jwtToken.generateToken(actualUser.getEmail());
                log.info("JWT generated from {}", actualUser.getEmail());
                log.info("{} logged in with {} ", actualUser.getFullName(), actualUser.getEmail());
                return new LoginResponseDTO(token, map, "Login Successful!");
            }
        }catch (Exception e){
            log.error("Failed attempt to login with email: {}", request.getEmail(), e);
            return new LoginResponseDTO("", null, "Incorrect username & password!");
        }

        return null;
    }
}
