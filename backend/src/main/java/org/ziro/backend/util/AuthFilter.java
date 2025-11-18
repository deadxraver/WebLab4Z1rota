package org.ziro.backend.util;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import org.ziro.backend.service.TokenService;

import java.io.IOException;

@Secured
@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthFilter implements ContainerRequestFilter {

    @Inject
    private TokenService tokenService;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {

        String authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);


        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            abortWithUnauthorized(requestContext, "Token is missing");
            return;
        }


        String token = authorizationHeader.substring("Bearer ".length()).trim();

        try {

            tokenService.validateToken(token);



        } catch (ExpiredJwtException e) {

            abortWithUnauthorized(requestContext, "Token expired");
        } catch (Exception e) {

            abortWithUnauthorized(requestContext, "Invalid token");
        }
    }

    private void abortWithUnauthorized(ContainerRequestContext requestContext, String message) {
        requestContext.abortWith(
                Response.status(Response.Status.UNAUTHORIZED)
                        .entity(message)
                        .build());
    }
}