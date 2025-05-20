package org.example.spring_react_postg.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.example.spring_react_postg.model.AuthToken;
import org.example.spring_react_postg.model.User;
import org.example.spring_react_postg.payload.request.LoginRequest;
import org.example.spring_react_postg.repository.AuthTokenRepository;
import org.example.spring_react_postg.repository.UserRepository;
import org.example.spring_react_postg.security.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Контролер для керування користувачами.
 * Обробляє запити, пов’язані зі створенням, отриманням і автентифікацією користувачів.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService service;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    AuthTokenRepository authTokenRepository;

    private BCryptPasswordEncoder encode = new BCryptPasswordEncoder(12);


    /**
     * Конструктор контролера, що приймає сервіс користувачів.
     *
     * @param userService сервіс для обробки логіки користувачів
     */
    @Autowired
    public UserController(UserService userService){
        this.userService = userService;
    }

    /**
     * Отримує список усіх користувачів.
     *
     * @return список користувачів у тілі відповіді
     */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Повертає користувача за його ідентифікатором.
     *
     * @param id унікальний ідентифікатор користувача
     * @return обгортка Optional з користувачем або порожня, якщо не знайдено
     */
    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Integer id) {
        return userService.getUserById(id);
    }

    @GetMapping("/confirmationCode/{id}")
    public String getConfirmationCode(@PathVariable Integer id) {
        User user = userService.getUserById(id).orElseThrow();
        return user.getConfirmationCode();
    }

    @GetMapping("/generateConfirmationCode/{id}")
    public String getGenerateConfirmationCode(@PathVariable Integer id) {
        User user = userService.getUserById(id).orElseThrow();
        return user.generateConfirmationCode();
    }


//    /**
//     * Реєструє нового користувача.
//     *
//     * @param user об’єкт користувача з даними
//     * @return повідомлення про створення користувача
//     */
//    @PostMapping("/signup")
//    public String signup(@RequestBody User user) {
//        userService.saveUser(user);
//        return "User created";
//    }

//    @PostMapping("/register")
//    public User register(@RequestBody User user) {
//        user.setPassword(encode.encode(user.getPassword()));
//        return userRepository.save(user);
//    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {

        return service.verify(user);
    }

//    @PostMapping("/singin")
//    public String  authenticateUser(@RequestBody LoginRequest loginRequest) { // @Valid
//        try {
//            Authentication authentication = authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(
//                            loginRequest.getUsername(),
//                            loginRequest.getPassword()));
//
//            if (!authentication.isAuthenticated()) {
//                return "Authentication failed";
//            }
//
//            User user = userRepository.findByUsername(loginRequest.getUsername())
//                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
//            AuthToken authToken = authTokenRepository.findByUserId(user.getId())
//                    .orElseThrow(() -> new RuntimeException("Token not found"));
//            return authToken.getToken();
//
//        } catch (AuthenticationException e) {
//            return "Invalid username or password";
//        }

//        Authentication authentication = authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
//        (User) Optional user = userRepository.findByUsername(loginRequest.getUsername())
//                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
//        return authTokenRepository.findByUserId();
//        service.getUserByUsername()
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//        String jwt = jwtUtils.generateJwtToken(authentication);
//
//        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
//        List<String> roles = userDetails.getAuthorities().stream()
//                .map(item -> item.getAuthority())
//                .collect(Collectors.toList());
//
//        return ResponseEntity.ok(new JwtResponse(jwt,
//                userDetails.getId(),
//                userDetails.getUsername(),
//                userDetails.getEmail(),
//                roles));

//    }


//    /**
//     * Створює нового користувача з перевіркою наявності пароля.
//     *
//     * @param user об’єкт користувача з даними
//     * @return відповідь зі статусом створення або помилки
//     */
//    @PostMapping("/createUser")
//    public ResponseEntity<String> createUser(@RequestBody User user) {
//        try {
//            if (user.getPassword() == null || user.getPassword().isEmpty()) {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password must not be empty");
//            }
//            userService.saveUser(user);
//            return ResponseEntity.ok("User created");
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Error creating user: " + e.getMessage());
//        }
//    }

    @GetMapping("/http-request")
    public String greet(HttpServletRequest request){
        return request.getSession().getId();
    }

    @GetMapping("/csrf-token")
    public CsrfToken getCsrfToken(HttpServletRequest request){
        return (CsrfToken) request.getAttribute("_csrf");
    }

//
//    /**
//     * Перевіряє правильність пароля користувача.
//     *
//     * @param request запит з ім’ям користувача та паролем
//     * @return повідомлення про результат перевірки
//     */
//    @PostMapping("/checkPassword")
//    public String checkPassword(@RequestBody LoginRequest request) {
//        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
//
//        if (userOpt.isPresent()) {
//            User user = userOpt.get();
//            if (user.getPassword().equals(request.getPassword())) {
//                return "Пароль дійсний";
//            } else {
//                return "Неправильний пароль";
//            }
//        } else {
//            return "Користувача не знайдено";
//        }
//    }
}
