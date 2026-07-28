package com.cms.ContactHub.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
public class UpdateProfileResponseDTO {
    private String token;
    private Map map;
    private String message;
}
