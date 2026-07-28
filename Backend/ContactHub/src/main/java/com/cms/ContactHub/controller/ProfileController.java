package com.cms.ContactHub.controller;

import com.cms.ContactHub.dto.*;
import com.cms.ContactHub.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {
    @Autowired
    private ProfileService profileService;

    @GetMapping("/profile")
    public ProfileResponseDTO getProfile(){
        return profileService.getProfile();
    }

    @PutMapping("/profile/update")
    public UpdateProfileResponseDTO updateProfile(@RequestBody @Valid UpdateProfileRequestDTO request){
        return profileService.updateProfile(request);
    }

    @PutMapping("/profile/changepassword")
    public ChangePasswordResponseDTO changePassword(@RequestBody @Valid ChangePasswordRequestDTO request){
        return profileService.changePassword(request);
    }
}
