package org.ziro.backend.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.ziro.backend.exceptions.UserAlreadyExistsException;
import org.ziro.backend.exceptions.UserNotFoundException;
import org.ziro.backend.models.Users;
import org.ziro.backend.repository.UserRepository;
import org.ziro.backend.util.PasswordHasher;

import java.util.Optional;

@ApplicationScoped
public class UserService {

    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;

    @Inject
    public UserService(UserRepository userRepository, PasswordHasher passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }


    public boolean login(String username, String password) {
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(Response.Status.NOT_FOUND,username));
        return passwordHasher.verifyPassword(password,user.getPassword());

    }

    public boolean register(String username, String password) {
        boolean user = userRepository.existsByUsername(username);
        if (!user) {
            throw new UserAlreadyExistsException(Response.Status.BAD_REQUEST, "Это имя уже занято");
        }
        String hashed = passwordHasher.hashPassword(password);
        userRepository.save(new Users(username, hashed));
        return true;
    }

}
