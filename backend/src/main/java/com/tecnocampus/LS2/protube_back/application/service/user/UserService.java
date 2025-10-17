package com.tecnocampus.LS2.protube_back.application.service.user;

import com.tecnocampus.LS2.protube_back.application.dto.user.*;
import com.tecnocampus.LS2.protube_back.application.mapper.user.UserMapper;
import com.tecnocampus.LS2.protube_back.domain.user.ERole;
import com.tecnocampus.LS2.protube_back.domain.user.Role;
import com.tecnocampus.LS2.protube_back.domain.user.User;
import com.tecnocampus.LS2.protube_back.exceptions.ActionDeniedException;
import com.tecnocampus.LS2.protube_back.exceptions.AuthenticationTokenException;
import com.tecnocampus.LS2.protube_back.exceptions.ElementNotFoundInBBDD;
import com.tecnocampus.LS2.protube_back.exceptions.NotFoundException;
import com.tecnocampus.LS2.protube_back.persistance.user.RoleRepository;
import com.tecnocampus.LS2.protube_back.persistance.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.getUsers().stream().map(UserMapper::userToUserDTO).toList();
    }

    public List<UserDTO> getAllUsersInDateRange(LocalDateTime startDate, LocalDateTime endDate) throws ActionDeniedException, NotFoundException {
        if (startDate.isAfter(endDate))
            throw new ActionDeniedException("End date must be after start date");
        List<UserDTO> filteredUsers = this.userRepository.getAllUsers()
                .stream()
                .filter(dto -> dto.dateOfRegistration().isAfter(startDate) && dto.dateOfRegistration().isBefore(endDate))
                .sorted(Comparator.comparing(UserDTO::dateOfRegistration).reversed())
                .toList();

        if (filteredUsers.isEmpty())
            throw new NotFoundException("No users found in the specified date range");

        return filteredUsers;

    }

    public UserDTO registerUser(UserCreate userCreate) throws ActionDeniedException {
        if (this.userRepository.getUser(userCreate.email()) != null)
            throw new ActionDeniedException();

        User user = new User(
                userCreate.getName(),
                userCreate.getSurname(),
                userCreate.getEmail(),
                passwordEncoder.encode(userCreate.getPassword()), // Beans configured in the SecurityConfigurationBeans.java class
                userCreate.getDateOfBirth(),
                LocalDateTime.now()
        );

        userRepository.save(user);
        return UserMapper.userToUserDTO(user);
    }

    public UserDTO updateUser(UserUpdate userUpdate, String userEmail) throws ElementNotFoundInBBDD, AuthenticationTokenException, NotFoundException {
        User user = getUser(userEmail);

        String passwordEncrypt = passwordEncoder.encode(userUpdate.password());
        userRepository.updateUser(userUpdate, user.getEmail(), passwordEncrypt);

        User cl = userRepository.getUser(user.getEmail());
        return UserMapper.userToUserDTO(cl);
    }

    public User getUser(String email) throws NotFoundException {
        User user = userRepository.getUser(email);

        if (user == null)
            throw new NotFoundException("User with email " + email + " not found");

        return user;
    }

    public void validate(String email, String password) throws NotFoundException {
        User user = userRepository.getUser(email);

        if (user == null)
            throw new NotFoundException("User with the email " + email + " and password not found");

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new NotFoundException("Invalid password for user with email " + email);
        }
    }

    /*public User getUser(String securityContext) throws AuthenticationTokenException {
        if (securityContext == null || securityContext.getAuthentication() == null ||
                securityContext.getAuthentication().getName() == null || !securityContext.getAuthentication().isAuthenticated())
            throw new AuthenticationTokenException();

        return getUserAuth(securityContext.getAuthentication().getName());
    }

    public UserDTO getProfileWithAuth(Principal principal) throws AuthenticationTokenException {
        if (principal == null)
            throw new AuthenticationTokenException();

        User user = getUserAuth(principal.getName());
        return UserMapper.userToUserDTO(user);
    }*/

    private User getUserAuth(String email) throws AuthenticationTokenException {
        User user = userRepository.getUser(email);

        if (user == null)
            throw new AuthenticationTokenException();

        return user;
    }

    public UserDTO getProfileWithAuth(String userEmail) throws AuthenticationTokenException, NotFoundException {
        return UserMapper.userToUserDTO(getUser(userEmail));
    }

    public UserDTO assignRole(String userEmail, String role) throws AuthenticationTokenException, NotFoundException {
        User user = getUser(userEmail);
        ERole eRole = ERole.parseRole(role);

        Role role_obj = roleRepository.getRole(eRole);

        if (role_obj == null)
            role_obj = createAndSaveRole(eRole);

        if (!user.roleExists(eRole)) {
            user.getRoles().add(role_obj);
            userRepository.save(user);
        }

        return UserMapper.userToUserDTO(user);
    }

    private Role createAndSaveRole(ERole eRole) {
        Role role = new Role(eRole);
        roleRepository.save(role);
        return role;
    }




}