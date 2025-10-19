package com.tecnocampus.LS2.protube_back.domain.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "app_user")
public class User {
    @Id
    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    private String name;

    @NotBlank
    private String surname;

    private LocalDateTime dateOfBirth;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private LocalDateTime dateOfRegistration;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_email"))
    @Column(name = "role")
    private Set<String> roles = new HashSet<>();

    protected User() {}

    public User(String name, String surname, String email, LocalDateTime dateOfBirth, String passwordHash, LocalDateTime dateOfRegistration, Set<String> roles) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.dateOfBirth = dateOfBirth;
        this.passwordHash = passwordHash;
        this.dateOfRegistration = dateOfRegistration;
        if (roles != null) this.roles = roles;
    }

    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getSurname() { return surname; }
    public LocalDateTime getDateOfBirth() { return dateOfBirth; }
    public String getPasswordHash() { return passwordHash; }
    public LocalDateTime getDateOfRegistration() { return dateOfRegistration; }
    public Set<String> getRoles() { return roles; }
}
