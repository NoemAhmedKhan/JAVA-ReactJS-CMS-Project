package com.cms.ContactHub.service;

import com.cms.ContactHub.dto.LoginRequestDTO;
import com.cms.ContactHub.dto.SignupRequestDTO;
import com.cms.ContactHub.entity.Users;
import com.cms.ContactHub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public String signupUser(SignupRequestDTO data){
        //  DUPLICATE EMAIL VALIDATION
        Optional<Users> user = userRepository.findByEmail(data.getEmail());
        if(user.isPresent()) return "User Already Exist!";

//        ENCODE PASSWORD
        String encodedPassword = passwordEncoder.encode(data.getPassword());
//        CREATE USER ENTITY
        Users userEntity = new Users(data.getFullName(), data.getEmail(), encodedPassword);
        userRepository.save(userEntity);
        return "Account Created!";
    }

    public String authenticateUser(LoginRequestDTO data){
//        FIND USER
        Optional<Users> user = userRepository.findByEmail(data.getEmail());

//        VALIDATE USER EXISTENCE
        if(!user.isPresent()) return "User Is Not Registered With This Email: " + data.getEmail();

//        VALIDATE PASSWORD MATCH
        Users actualUser = user.get();
        boolean isPasswordValid = passwordEncoder.matches(data.getPassword(), actualUser.getPassword());
        if(isPasswordValid) return "User Authenticated!";
        return "Password Not Match!";
    }
}
