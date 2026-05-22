package com.cms.ContactHub.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequestDTO {
    @NotBlank
    private String fullName;
    @Email(message = "Invalid Email!")
    @NotBlank
    private String email;
    @Size(min = 8, max = 16, message = "Invalid Password!")
    @NotBlank
    private String password;
}
