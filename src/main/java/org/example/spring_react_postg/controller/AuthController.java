package org.example.spring_react_postg.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.spring_react_postg.model.AuthToken;
import org.example.spring_react_postg.model.UserStats;
import org.example.spring_react_postg.model.User;
import org.example.spring_react_postg.payload.request.LoginRequest;
import org.example.spring_react_postg.payload.request.SignupRequest;
import org.example.spring_react_postg.repository.AuthTokenRepository;
import org.example.spring_react_postg.repository.UserStatsRepository;
import org.example.spring_react_postg.repository.UserRepository;
import org.example.spring_react_postg.security.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Optional;

/**
 * Контролер автентифікації користувача.
 *
 * Обробляє запити на реєстрацію, вхід, вихід, автоматичний вхід та керування токенами автентифікації.
 * Використовує cookie для зберігання токенів (AUTH_TOKEN та confirmation_code).
 *
 * Основні функції:
 * - логін з cookie або з логін-пароля
 * - автоматичний логін через AUTH_TOKEN
 * - реєстрація нового користувача
 * - генерація нового токена
 * - видалення cookie при виході
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService service;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    AuthTokenRepository authTokenRepository;

    @Autowired
    UserStatsRepository userStatsRepository;
    private BCryptPasswordEncoder encode = new BCryptPasswordEncoder(12);

    /**
     * Авторизує користувача за допомогою логіна і пароля або cookie AUTH_TOKEN.
     *
     * @param loginRequest запит з логіном і паролем
     * @param httpServletRequest запит, що містить cookie
     * @param response відповідь, куди додаються cookie при успішній авторизації
     * @return повідомлення про успішну чи невдалу авторизацію
     */
    @PostMapping("/login")
    public ResponseEntity<?> logInUser(@RequestBody LoginRequest loginRequest, HttpServletRequest httpServletRequest, HttpServletResponse response) { // @Valid

        String token = null;

        if (httpServletRequest.getCookies() != null) {
            for (Cookie cookie : httpServletRequest.getCookies()) {
                if ("AUTH_TOKEN".equals(cookie.getName())) {
                    token = cookie.getValue();
//                    break;
                }
            }


            if (token != null && !token.isEmpty()) {
                Optional<AuthToken> authTokenOpt = authTokenRepository.findByToken(token);
                if (authTokenOpt.isPresent()) {
                    return ResponseEntity.ok("Login successful by AUTH_TOKEN");
                }
            }
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));

            if (!authentication.isAuthenticated()) {
                return ResponseEntity.ok("Authentication failed by getUsername and getPassword");
            }

            User user = userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            String code = user.getConfirmationCode();

            response.addHeader(HttpHeaders.SET_COOKIE, createConfirmationCodeCookie(code));

            AuthToken authToken = authTokenRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Token not found"));

            response.addHeader(HttpHeaders.SET_COOKIE, createAuthTokenCookie(authToken.getToken()));

//            System.out.print("\n\n token: " + authToken.getToken()  +"\n\n");
//            System.out.print("\n\n code: " + code  +"\n\n");

            return ResponseEntity.ok("Successful Authentication by username and password");

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed: invalid username or password");
        }
    }

    /**
     * Автоматичний вхід користувача на основі cookie AUTH_TOKEN.
     *
     * @param httpServletRequest запит, що містить cookie
     * @param response відповідь
     * @return ім’я користувача, якщо токен валідний, або повідомлення про помилку
     */
    @GetMapping("/auto-login")
    public ResponseEntity<?> autoLogInUser(HttpServletRequest httpServletRequest, HttpServletResponse response) { // @Valid

        String token = null;

        if (httpServletRequest.getCookies() != null) {
            for (Cookie cookie : httpServletRequest.getCookies()) {
                if ("AUTH_TOKEN".equals(cookie.getName())) {
                    token = cookie.getValue();
//                    break;
                }
            }



            if (token != null && !token.isEmpty()) {
                Optional<AuthToken> authTokenOpt = authTokenRepository.findByToken(token);

                if (authTokenOpt.isPresent()) {
                    AuthToken authToken = authTokenOpt
                            .orElseThrow(() -> new RuntimeException("Token not found"));
                    User user = authToken.getUser();

                    return ResponseEntity.ok(user.getUsername());
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
                }
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("NO token");
    }

    /**
     * Вихід користувача — видаляє cookie AUTH_TOKEN з браузера.
     *
     * @param response відповідь, до якої додається cookie з терміном життя 0
     * @return повідомлення про успішний вихід
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {

        Cookie cookie = new Cookie("AUTH_TOKEN", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);

        response.addCookie(cookie);

        return ResponseEntity.ok().body("Logged out successfully.");
    }

    /**
     * Реєструє нового користувача.
     *
     * @param signupRequest об'єкт із полями username, email та password
     * @param httpServletRequest HTTP-запит
     * @param response HTTP-відповідь із встановленими cookie
     * @return повідомлення про успішну або невдалу реєстрацію
     */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest, HttpServletRequest httpServletRequest, HttpServletResponse response) { // @Valid



        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Email is already in use!");//.body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User(signupRequest.getUsername(), signupRequest.getEmail(), signupRequest.getPassword());
        user.setPassword(encode.encode(signupRequest.getPassword()));

        userRepository.save(user);

        response.addHeader(HttpHeaders.SET_COOKIE, createConfirmationCodeCookie(user.getConfirmationCode()));



        AuthToken authToken = new AuthToken();

        String tokenValue = authToken.generateUuid(); //TODO: authToken.generateToken(user, userAgent);
        authToken.setToken(tokenValue);
        authToken.setUser(user);
        authTokenRepository.save(authToken);

        UserStats userStats = new UserStats();
        userStats.setUser(user);
//        stat.setActivityHistoryJson("{}");
        userStatsRepository.save(userStats);

        response.addHeader(HttpHeaders.SET_COOKIE, createAuthTokenCookie(authToken.getToken()));

        return ResponseEntity.ok("User registered successfully! ");

    }

    /**
     * Створює cookie для токена автентифікації.
     *
     * @param authToken значення токена
     * @return рядок cookie для додавання до заголовка відповіді
     */
    private String createAuthTokenCookie(String authToken) {
        ResponseCookie cookie = ResponseCookie.from("AUTH_TOKEN", authToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofDays(30))
                .sameSite("Strict")
                .build();

        return cookie.toString();
    }

    /**
     * Створює cookie з кодом підтвердження (confirmation_code).
     *
     * @param confirmationCode унікальний код користувача
     * @return рядок cookie для додавання до заголовка відповіді
     */
    private String createConfirmationCodeCookie(String confirmationCode) {
        ResponseCookie confirmation_code_cookie = ResponseCookie.from("confirmation_code", confirmationCode)
                .httpOnly(false)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofDays(30))
                .sameSite("Strict")
                .build();

        return confirmation_code_cookie.toString();
    }
}
