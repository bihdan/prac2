package org.example.spring_react_postg.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.spring_react_postg.model.AuthToken;
import org.example.spring_react_postg.model.User;
import org.example.spring_react_postg.repository.AuthTokenRepository;
import org.example.spring_react_postg.security.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Optional;

@Component
public class AuthenticationTokenFilter extends OncePerRequestFilter {

    @Autowired
    private AuthTokenRepository authTokenRepository;

    @Autowired
    ApplicationContext context;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        String token = extractTokenFromCookies(request);

//        if (request.getCookies() != null) {
//            for (Cookie cookie : request.getCookies()) {
//                if ("AUTH_TOKEN".equals(cookie.getName())) {
//                    token = cookie.getValue();
////                    break;
//                }
//            }
//        }


        if (token != null && !token.isEmpty()) {
            Optional<AuthToken> authTokenOpt = authTokenRepository.findByToken(token);

            if (authTokenOpt.isPresent()) {
                AuthToken authToken = authTokenOpt.get();
                User user = authToken.getUser();

                UserDetails userDetails = context.getBean(UserDetailsServiceImpl.class)
                        .loadUserByUsername(user.getUsername());

                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());

                authenticationToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        filterChain.doFilter(request, response);

        /*String authHeader = request.getHeader("Authorization");
        System.out.print(authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (!token.isEmpty()) {
                Optional<AuthToken> authTokenOpt = authTokenRepository.findByToken(token);

                if (authTokenOpt.isPresent()) {
                    AuthToken authToken = authTokenOpt.get();
                    User user = authToken.getUser();

                    UserDetails userDetails = context.getBean(UserDetailsServiceImpl.class).
                            loadUserByUsername(user.getUsername());

                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());

//                    UsernamePasswordAuthenticationToken authenticationToken =
//                            new UsernamePasswordAuthenticationToken(
//                                    user, null, new ArrayList<>()); // authorities за потреби

                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            }
        }

        filterChain.doFilter(request, response);*/

//        1
//        String authHeader = request.getHeader("Authorization");
//        String token = null;
//        String username = ; // null
//
//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//            token = authHeader.substring(7);
////            /*username = jwtService.extractUserName(token);*/
//        }
//
//        if (SecurityContextHolder.getContext().getAuthentication() == null) { //username != null &&
//            UserDetails userDetails = context.getBean(UserDetailsServiceImpl.class).loadUserByUsername(username);
//            UsernamePasswordAuthenticationToken authToken =
//                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
//
//            authToken.setDetails(new WebAuthenticationDetailsSource()
//                    .buildDetails(request));
//            SecurityContextHolder.getContext().setAuthentication(authToken);
//
////            /*if (jwtService.validateToken(token, userDetails)) {
////                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
////                authToken.setDetails(new WebAuthenticationDetailsSource()
////                        .buildDetails(request));
////                SecurityContextHolder.getContext().setAuthentication(authToken);
////            }*/
//        }
//
//        filterChain.doFilter(request, response);


//        2
//        String token = extractTokenFromCookies(request);
//
//        if (token != null && !token.isEmpty()) {
//            Optional<AuthToken> authTokenOpt = authTokenRepository.findByToken(token);
//
//            if (authTokenOpt.isPresent()) {
//                AuthToken authToken = authTokenOpt.get();
//                User user = authToken.getUser();
//
//                // Створюємо об'єкт автентифікації
//                UsernamePasswordAuthenticationToken authentication =
//                        new UsernamePasswordAuthenticationToken(
//                                user, null, new ArrayList<>()); // або authorities
//
//                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//
//                SecurityContextHolder.getContext().setAuthentication(authentication);
//            }
//        }
//
//        filterChain.doFilter(request, response);
    }

    private String extractTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("AUTH_TOKEN".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}

