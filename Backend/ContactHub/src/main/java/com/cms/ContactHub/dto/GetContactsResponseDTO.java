package com.cms.ContactHub.dto;

import com.cms.ContactHub.entity.Contacts;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class GetContactsResponseDTO {
    private List<ContactsDTO> contacts;
    private String message;
}
