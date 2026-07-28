package com.cms.ContactHub.security;

import com.cms.ContactHub.entity.Users;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@NoArgsConstructor
public class SecurityUtils {
    public Users getAuthenticatedUser() {
        Authentication authenticatedUser = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails customUser = (CustomUserDetails) authenticatedUser.getPrincipal();
        Users user = customUser != null ? customUser.getUser(): null;
        return user;
    }
}
