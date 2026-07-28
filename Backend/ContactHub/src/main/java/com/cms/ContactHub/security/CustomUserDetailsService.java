package com.cms.ContactHub.security;

import com.cms.ContactHub.entity.Users;
import com.cms.ContactHub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Users> user = userRepository.findByEmail(email);
        if(!user.isPresent())
            throw new UsernameNotFoundException("User does not exist!");

        Users actualUser = user.get();
        return new CustomUserDetails(actualUser);
    }
}
