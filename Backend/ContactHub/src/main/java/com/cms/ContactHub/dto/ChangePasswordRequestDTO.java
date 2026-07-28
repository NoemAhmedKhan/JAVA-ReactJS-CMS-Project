package com.cms.ContactHub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ChangePasswordRequestDTO {
    @NotBlank
    @Size(min = 8, max = 16, message = "Invalid Current Password!")
    private String currentPassword;
    @NotBlank
    @Size(min = 8, max = 16, message = "Invalid New Password!")
    private String newPassword;
}
