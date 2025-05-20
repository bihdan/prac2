package org.example.spring_react_postg.model;

import jakarta.persistence.*;

/**
 * Сутність, що представляє роль користувача в системі.
 * <p>
 * Визначає рівень доступу користувача на основі {@link ERole}.
 */
@Entity
@Table(name = "roles")
public class Role {

    /**
     * Унікальний ідентифікатор ролі.
     */
    @Id
    private Integer id;

    /**
     * Назва ролі у вигляді переліку {@link ERole}.
     * Зберігається як рядок у базі даних.
     */
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ERole name;

    /**
     * Конструктор без аргументів. Необхідний для JPA.
     */
    public Role() {
    }

    /**
     * Конструктор для створення ролі за назвою.
     *
     * @param name назва ролі типу {@link ERole}
     */
    public Role(ERole name) {
        this.name = name;
    }

    /**
     * Повертає ідентифікатор ролі.
     *
     * @return ідентифікатор ролі
     */
    public Integer getId() {
        return id;
    }

    /**
     * Встановлює ідентифікатор ролі.
     *
     * @param id ідентифікатор
     */
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * Повертає назву ролі.
     *
     * @return назва ролі {@link ERole}
     */
    public ERole getName() {
        return name;
    }

    /**
     * Встановлює назву ролі.
     *
     * @param name назва ролі {@link ERole}
     */
    public void setName(ERole name) {
        this.name = name;
    }
}
