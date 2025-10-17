package com.tecnocampus.LS2.protube_back.persistance.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.tecnocampus.LS2.protube_back.domain.user.User;
import com.tecnocampus.LS2.protube_back.application.dto.user.UserDTO;
import com.tecnocampus.LS2.protube_back.application.dto.user.UserUpdate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    @Query("SELECT c FROM User c WHERE c.email = :#{#user.email}")
    User getUser(@Param("user") User user);

    @Query("SELECT c FROM User c WHERE c.email = :email")
    User getUser(@Param("email") String email);

    @Query("SELECT u " +
            "FROM User u")
    List<User> getUsers();

    @Query("SELECT new com.tecnocampus.LS2.protube_back.application.dto.user.UserDTO(c.name, c.surname, c.email, c.dateOfBirth, c.dateOfRegistration, null) " +
            "FROM User c")
    List<UserDTO> getAllUsers();

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE User c " +
            "SET c.name = :#{#user.name}, " +
            "c.surname = :#{#user.surname}, " +
            "c.dateOfBirth = :#{#user.dateOfBirth}, " +
            "c.password = :#{#password} " +
            "WHERE c.email = :#{#email}")
    void updateUser(@Param("user") UserUpdate user,
                    @Param("email") String email,
                    @Param("password") String password);

}