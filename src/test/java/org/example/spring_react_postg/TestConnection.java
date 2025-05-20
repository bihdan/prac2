package org.example.spring_react_postg;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class TestConnection {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/flashcards";
        String user = "postgres";
        String password = "123";

        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            System.out.println("✅ Підключення успішне!");
        } catch (SQLException e) {
            System.out.println("❌ Помилка підключення: " + e.getMessage());
        }
    }
}

