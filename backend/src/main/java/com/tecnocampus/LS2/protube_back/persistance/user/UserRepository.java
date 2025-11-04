package com.tecnocampus.LS2.protube_back.persistance.user;

import com.tecnocampus.LS2.protube_back.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}