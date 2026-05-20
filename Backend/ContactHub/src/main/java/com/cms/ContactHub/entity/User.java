package com.cms.ContactHub.entity;

import jakarta.persistence.*;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true)
    private Long id;

    private String fullName;
    private String email;
    private String password;

    public User(String fullName, String email, String password){
        this.fullName = fullName;
        this.email = email;
        this.password = password;
    }
}
