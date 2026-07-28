package com.cms.ContactHub.repository;

import com.cms.ContactHub.entity.Contacts;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends JpaRepository<Contacts, Long> {
    Contacts findByIdAndUserId(@NotBlank Long id, @NotBlank Long userId);
}
