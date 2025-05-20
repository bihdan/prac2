### Prerequisites

Project is written on Java 21. Project requires maven (bundled with Intelj Idea or standalone), PostgreSQL 16, Node.js 20, GIT, npm.

---

### Installation

#### GIT
Clone GIT repository to your computer: https://github.com/bihdan/SpringReactPostg.git

#### Postgresql
Download and install postgresql from official site
Create database on localhost, port: 5432 name:flashcards.
The Java project uses the @Entity parameter, which creates tables.

#### Backend
Connect to database: in file (root)/src/main/resources/application.properties:

    spring.datasource.url=jdbc:postgresql://localhost:5432/flashcards
    spring.datasource.username=(your_postgre_username)
    spring.datasource.password=(your_postgre_password)

Change (your_postgre_username) and (your_postgre_password) to yours postgreSQL username and password. 

#### Maven
Use termital

    ./mvnw clean package

#### Frontend

Use termital

    cd (root)/frontend
    npm install

### Running the Project
#### Backend

    cd backend
    ./mvnw spring-boot:run

#### Frontend

    cd ../frontend
    npm run dev

---

### Scripts

#### Backend
    ./mvnw spring-boot:run - Run backend server
    ./mvnw test            - Run unit tests

#### Frontend
    npm run dev 	       - Run frontend in dev mode
    npm run build 	       - Create production build
    npm run preview        - Preview production version



