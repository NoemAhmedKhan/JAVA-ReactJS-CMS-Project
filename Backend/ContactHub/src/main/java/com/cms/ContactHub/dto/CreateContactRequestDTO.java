package com.cms.ContactHub.dto;

import com.cms.ContactHub.entity.Users;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateContactRequestDTO {
    @Column(nullable = false)
    @Size(min = 3, max = 20)
    private String firstName;
    @Size(max = 20)
    private String lastName;
    @Column(nullable = false)
    @Email(message = "Invalid Email!")
    private String email;
    @Column(nullable = false)
    @Size(max = 25)
    private String phone;
    @Size(max = 50)
    private String address;
}
