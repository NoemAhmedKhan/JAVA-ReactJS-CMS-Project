package com.cms.ContactHub.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UpdateContactRequestDTO {
    @NotBlank
    @Size(min = 3, max = 20)
    private String firstName;
    @Size(max = 20)
    private String lastName;
    @NotBlank
    @Email(message = "Invalid Email!")
    private String email;
    @NotBlank
    @Size(max = 25)
    private String phone;
    @Size(max = 50)
    private String address;
}
