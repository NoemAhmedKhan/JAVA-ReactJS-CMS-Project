package com.cms.ContactHub.service;

import com.cms.ContactHub.dto.SignupRequestDTO;
import com.cms.ContactHub.entity.Users;
import com.cms.ContactHub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public String signupUser(SignupRequestDTO data){
        //  DUPLICATE EMAIL VALIDATION
        Optional<Users> user = userRepository.findByEmail(data.getEmail());
        if(user.isPresent()) return "User Already Exist!";

//        CREATE USER ENTITY
        Users userEntity = new Users(data.getFullName(), data.getEmail(), data.getPassword());
        userRepository.save(userEntity);
        return "Account Created!";
    }
}
