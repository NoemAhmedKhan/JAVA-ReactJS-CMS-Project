package com.cms.ContactHub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDTO {
    @NotBlank
    @Email(message = "Invalid Email!")
    private String email;
    @NotBlank
    @Size(min = 8, max = 16, message = "Invalid Password!")
    private String password;
}
