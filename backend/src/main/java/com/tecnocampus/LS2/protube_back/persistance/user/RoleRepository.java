package com.tecnocampus.LS2.protube_back.persistance.user;

import com.tecnocampus.LS2.protube_back.domain.user.ERole;
import com.tecnocampus.LS2.protube_back.domain.user.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(ERole name);
}
