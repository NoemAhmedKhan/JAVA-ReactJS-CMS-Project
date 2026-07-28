package com.cms.ContactHub.dto;

import jakarta.validation.constraints.NotBlank;
import jdk.jfr.BooleanFlag;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MarkFavouriteRequestDTO {
    private boolean favourite;
}
