package com.cms.ContactHub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String password;

    public Users(String fullName, String email, String password){
        this.fullName = fullName;
        this.email = email;
        this.password = password;
    }

    public Users(){

    }
}
