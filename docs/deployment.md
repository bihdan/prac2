# Розгортання проекту у Production-середовищі

## Вимоги до апаратного забезпечення
- Архітектура: x86_64
- CPU: 2 ядра
- RAM: 4 ГБ
- Disk: 5 ГБ SSD

## Необхідне програмне забезпечення
- Java 21
- maven
- PostgreSQL 16
- Node.js 20
- GIT
- npm

## Налаштування СУБД (PostgreSQL)
Створити базу даних:

	CREATE DATABASE learncards;
При необхідності можна також створити окремого юзера:

	CREATE USER prod_user WITH PASSWORD 'prod_pass';
	CREATE DATABASE learncards OWNER prod_user;

## Налаштування мережі
Відкриті порти:
- `80` (HTTP)
- `443` (HTTPS)
- `5432` (PostgreSQL, лише для локального з'єднання)

## Конфігурація серверів

### 1. Backend-сервер

#### Склонуйте проєкт:

	git clone https://github.com/bihdan/SpringReactPostg.git

#### Наведення ладу в properties

в (root)/src/main/resources/application.properties, з вказанням свого PostgreSQL username та password:

	spring.datasource.url=jdbc:postgresql://localhost:5432/flashcards
	spring.datasource.username=(your_postgre_username)
	spring.datasource.password=(your_postgre_password)

#### Збірка:

	./mvnw clean package

#### Деплой .jar

	java -jar target/learncards-0.0.1-SNAPSHOT.jar

### 2. Frontend-сервер

#### Створення .env.production

в нього запишіть змінну посиланням для потрібного домену
	
	VITE_API_URL=https://domain.com/api

####  Побудуйте production-версію

  	cd (root)/frontend
    npm install
	npm run build

## Перевірка працездатності 

Перевірка статусу API:
	
	curl http://localhost:8080/api/status

Відкрити в браузері сайт, назву якого вказали в front-end.env.production
	
	https://domain.com

#### Використання функцій сайту
Створити користувача, увійти та створити колоду з картками. Почати навчання, перевірити, чи зберігаються зміни. Оновити.