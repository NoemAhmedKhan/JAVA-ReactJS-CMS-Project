package com.cms.ContactHub.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginResponseDTO{
    private String token;
    private String message;
}