package com.cms.ContactHub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UpdateProfileRequestDTO {
    @NotBlank
    @Size(min = 3, max = 20)
    private String fullName;
    @NotBlank
    @Email(message = "Invalid Email!")
    private String email;
}
