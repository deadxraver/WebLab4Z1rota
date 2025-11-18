package org.ziro.backend.util;

import at.favre.lib.crypto.bcrypt.BCrypt;
import jakarta.enterprise.context.ApplicationScoped;

import java.nio.charset.StandardCharsets;

@ApplicationScoped
public class PasswordHasher {



    public String hashPassword(String password) {
        BCrypt.Hasher hasher = BCrypt.withDefaults();
        byte[] hashbytes = hasher.hash(12,password.toCharArray());

        return new String(hashbytes, StandardCharsets.UTF_8);
    }

    public Boolean verifyPassword(String password, String hashedPassword) {
        BCrypt.Verifyer verifyer = BCrypt.verifyer();
        BCrypt.Result result = verifyer.verify(password.toCharArray(),  hashedPassword.toCharArray());

        return result.verified;

    }
}
