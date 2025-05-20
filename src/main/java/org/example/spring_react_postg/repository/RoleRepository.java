package org.example.spring_react_postg.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.example.spring_react_postg.model.ERole;
import org.example.spring_react_postg.model.Role;

/**
 * Репозиторій для роботи з ролями користувачів у базі даних.
 * <p>
 * Використовує JPA для доступу до таблиці ролей та забезпечує CRUD операції для сутності {@link Role}.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    /**
     * Знаходить роль за її назвою.
     *
     * @param name назва ролі типу {@link ERole}
     * @return Optional, що містить роль, якщо знайдена, або порожнє значення, якщо роль не знайдена
     */
    Optional<Role> findByName(ERole name);
}
