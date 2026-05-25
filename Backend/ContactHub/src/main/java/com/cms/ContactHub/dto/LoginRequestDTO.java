package com.cms.ContactHub.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDTO {
    @Email(message = "Invalid Email!")
    @NotBlank
    private String email;
    @NotBlank
    @Size(min = 8, max = 16, message = "Invalid Password!")
    private String password;
}
