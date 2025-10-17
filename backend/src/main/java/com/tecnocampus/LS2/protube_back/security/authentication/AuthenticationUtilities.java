package com.tecnocampus.groupprojectinformaticawithjoseplogsboats.security.authentication;

import com.tecnocampus.groupprojectinformaticawithjoseplogsboats.exceptions.AuthenticationTokenException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;

import java.security.Principal;

public class AuthenticationUtilities {
    public static String getSecurityContextUserEmail(SecurityContext securityContext) throws AuthenticationTokenException {
        if (securityContext == null || securityContext.getAuthentication() == null ||
                securityContext.getAuthentication().getName() == null || !securityContext.getAuthentication().isAuthenticated())
            throw new AuthenticationTokenException();

        // In case the user is not authenticated
        if (securityContext.getAuthentication() instanceof AnonymousAuthenticationToken)
            throw new AuthenticationTokenException("Needs to be authenticated");

        return securityContext.getAuthentication().getName();
    }

    public static String getPrincipalUserEmail(Principal principal) throws AuthenticationTokenException {
        if (principal == null)
            throw new AuthenticationTokenException();

        return principal.getName();
    }
}
