package com.tecnocampus.LS2.protube_back.domain.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Entity
@Table(name = "app_user") // evita 'USER' reservado en SQL
public class User {
    @Id
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotBlank @Size(max = 255)
    private String name;

    @NotBlank @Size(max = 255)
    private String surname;

    @NotNull
    private LocalDateTime dateOfBirth;

    @NotNull
    private LocalDateTime dateOfRegistration;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_email"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    protected User(){}

    public User(String name, String surname, String email, String password, LocalDateTime dob, LocalDateTime reg){
        this.name = name; this.surname = surname; this.email = email;
        this.password = password; this.dateOfBirth = dob; this.dateOfRegistration = reg;
    }

    public String getEmail(){ return email; }
    public String getPassword(){ return password; }
    public String getName(){ return name; }
    public String getSurname(){ return surname; }
    public LocalDateTime getDateOfBirth(){ return dateOfBirth; }
    public LocalDateTime getDateOfRegistration(){ return dateOfRegistration; }
    public Set<Role> getRoles(){ return roles; }
    public void addRole(Role r){ roles.add(r); }
}
