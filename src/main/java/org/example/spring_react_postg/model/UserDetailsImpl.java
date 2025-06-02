package org.example.spring_react_postg.model;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import org.example.spring_react_postg.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Реалізація інтерфейсу {@link UserDetails} для користувача в контексті автентифікації та авторизації.
 * <p>
 * Цей клас використовується Spring Security для зберігання інформації про користувача, такої як ім'я, електронна пошта, пароль і ролі.
 */
public class UserDetailsImpl implements UserDetails {

    private User user;

    public UserDetailsImpl(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("USER"));
    }
    public int getId(){
        return user.getId();
    }

    public String getConfirmationCode(){
        return user.getConfirmationCode();
    }

    public User getUser(){
        return user;
    }


    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

