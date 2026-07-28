package com.cms.ContactHub.service;

import com.cms.ContactHub.dto.*;
import com.cms.ContactHub.entity.Users;
import com.cms.ContactHub.repository.UserRepository;
import com.cms.ContactHub.security.CustomUserDetails;
import com.cms.ContactHub.security.JwtService;
import com.cms.ContactHub.security.SecurityUtils;
import jakarta.transaction.Transactional;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class ProfileService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private SecurityUtils securityUtils;

    public ProfileResponseDTO getProfile(){
        try{
            Users user = securityUtils.getAuthenticatedUser();
            log.info("{} Profile Returned!", user.getFullName());
            return new ProfileResponseDTO(user.getFullName(), user.getEmail(), "Profile Returned");
        }catch (Exception e){
            log.error("Failed to retrieve authenticated user!", e);
        }

        return null;
    }

    @Transactional
    public UpdateProfileResponseDTO updateProfile(@NonNull UpdateProfileRequestDTO request){
        Users user = securityUtils.getAuthenticatedUser();
        Users existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        log.debug("userRepository.findById({}) method called and returned object.", user.getId());

        existingUser.setFullName(request.getFullName().trim());
        existingUser.setEmail(request.getEmail().toLowerCase().trim());
        userRepository.save(existingUser);
        log.debug("userRepository.save() method called and user saved to DB.");

        String token = jwtService.generateToken(existingUser.getEmail());
        Map<String, String> map = new HashMap<>();
        map.put("fullName", existingUser.getFullName());
        map.put("email", existingUser.getEmail());

        log.info("Profile Updated: Full Name: {}, Email: {}", existingUser.getFullName(), existingUser.getEmail());
        return new UpdateProfileResponseDTO(token, map, "Profile Updated Successfully!");
    }

    public ChangePasswordResponseDTO changePassword(@NonNull ChangePasswordRequestDTO request){
        Users user = securityUtils.getAuthenticatedUser();
        boolean isMatched = passwordEncoder.matches(request.getCurrentPassword(), user.getPassword());
        log.info("passwordEncoder.matches(newPassword, oldPassword) method called and returned {}", isMatched);
        if( !isMatched ) {
            log.error("Incorrect Password Entered!");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect Password! Please enter a correct password.");
        }

        String newPassword = passwordEncoder.encode(request.getNewPassword());
        log.info("passwordEncoder.encode(newPassword) method called and returned encoded password.");
        user.setPassword(newPassword);
        userRepository.save(user);
        log.info("{} Password Changed!", user.getFullName());
        return new ChangePasswordResponseDTO("Password Changed Successfully!");
    }
}
