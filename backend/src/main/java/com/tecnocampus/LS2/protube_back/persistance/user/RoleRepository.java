package com.tecnocampus.LS2.protube_back.persistance.user;

import com.tecnocampus.LS2.protube_back.domain.user.ERole;
import com.tecnocampus.LS2.protube_back.domain.user.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    @Query("SELECT r FROM Role r WHERE r.name = :role")
    Role getRole(@Param("role") ERole role);

    @Query("SELECT r FROM Role r WHERE r.name = :role")
    Role getRole(@Param("role") String role);

}
