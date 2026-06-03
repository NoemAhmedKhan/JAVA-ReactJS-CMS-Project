package com.cms.ContactHub.service;

import com.cms.ContactHub.dto.LoginRequestDTO;
import com.cms.ContactHub.dto.LoginResponseDTO;
import com.cms.ContactHub.dto.SignupRequestDTO;
import com.cms.ContactHub.entity.Users;
import com.cms.ContactHub.repository.UserRepository;
import com.cms.ContactHub.security.JwtService;
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
    @Autowired
    private JwtService jwtToken;

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

    public LoginResponseDTO authenticateUser(LoginRequestDTO data){
//        LOGIN RESPONSE DTO
        LoginResponseDTO response = new LoginResponseDTO();
//        FIND USER
        Optional<Users> user = userRepository.findByEmail(data.getEmail());

//        VALIDATE USER EXISTENCE
        if(!user.isPresent()) {
            response.setMessage("User Is Not Registered With This Email: " + data.getEmail());
            return response;
        }

//        VALIDATE PASSWORD MATCH
        Users actualUser = user.get();
        boolean isPasswordValid = passwordEncoder.matches(data.getPassword(), actualUser.getPassword());
        if( ( actualUser.getEmail().equals(data.getEmail()) ) && ( isPasswordValid ) ) {
            String token = jwtToken.generateToken(actualUser.getEmail());
            response.setToken(token);
            response.setMessage("Login Successful!");
            return response;
        }

        response.setMessage("Password Is Not Correct!");
        return response;
    }
}
