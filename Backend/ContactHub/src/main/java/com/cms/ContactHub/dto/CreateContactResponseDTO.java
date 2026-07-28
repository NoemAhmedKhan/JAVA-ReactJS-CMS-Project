package com.cms.ContactHub.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class CreateContactResponseDTO {
    private Long id;
    private String name;
    private String phone;
    private String email;
    private LocalDateTime timeStamp;
    private String message;
}
