package org.ziro.backend.controller;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.ziro.backend.dto.LoginCredentials;
import org.ziro.backend.dto.TokenResponse;
import org.ziro.backend.exceptions.UserNotFoundException;
import org.ziro.backend.service.TokenService;
import org.ziro.backend.service.UserService;

@Path("/auth")
public class AuthController {
    public AuthController() {
        this.userService = null;
        this.tokenService = null;
    }

    private final TokenService tokenService;
    private final UserService userService;

    @Inject
    public AuthController(UserService userService, TokenService tokenService) {
        this.userService = userService;
        this.tokenService = tokenService;
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/login")
    public Response login(LoginCredentials credentials) {


        try {
            boolean isAuthenticated = userService.login(credentials.getUsername(), credentials.getPassword());

            if (isAuthenticated) {

                String token = tokenService.generateToken(credentials.getUsername());

                return Response.ok(new TokenResponse(token)).build();
            } else {

                return Response.status(Response.Status.UNAUTHORIZED).build();
            }
        } catch (UserNotFoundException e ) {
            return Response.status(Response.Status.UNAUTHORIZED).build();

        } catch (Exception e) {

            e.printStackTrace();
            return Response.serverError()
                    .entity("Server Error: " + e.getMessage())
                    .build();
        }
    }
    @GET
    public Response getToken() {
        System.out.println("Привет");
        return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/register")
    public Response register(LoginCredentials credentials) {
        if (userService.register(credentials.getUsername(), credentials.getPassword())) {
            return Response.status(Response.Status.CREATED).build();
        }
        return Response.status(Response.Status.BAD_REQUEST).build();
    }
}
