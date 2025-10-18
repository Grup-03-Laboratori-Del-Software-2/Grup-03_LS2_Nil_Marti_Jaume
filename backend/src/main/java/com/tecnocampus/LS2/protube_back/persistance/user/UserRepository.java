package com.tecnocampus.LS2.protube_back.persistance.user;

import com.tecnocampus.LS2.protube_back.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByEmail(String email);
    User findByEmail(String email);
}
