# Task Manager
## Introduction
This is a basic, multi-user task management software developed by me (MateusDV) for a job interview assignment.

## Technologies used
This project is based on Node.js for the backend, and Angular for the frontend.

### Frontend
- Angular 19
- Angular Material 19

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgresSQL

## Observations
During development, I took certain liberties regarding some contradicting aspects between researched information and the project requirements:
1. Even though it's not recommended, I've made the choice to add the `.env` file to git so it would comply with the instruction saying the project should be able to run with a single command.
2. The JWT implementation was made in a simplified way (no refresh token, memory storage only).
    1. To implement the refresh token in a way it wouldn't pollute the code a dedicated endpoint would be needed, and I wasn't sure I could stray from the specification.
    2. During my research I saw that a JWT should be stored in the frontend using an httpOnly cookie, but since this would go against the requirements to use Angular interceptors to send the token back to the api, I've chosen to keep them in memory.

## How to run
To run this project, it's necessary to install the Docker tooling.

I would recommend installing Docker Desktop since it comes bundled with all the tools, but you can also install the Docker Engine, Docker CLI and the Docker Compose plugin individually.

After the tooling is installed and the Docker service is running, you can open a terminal in the root directory of this project and run:

`docker-compose up -d`

This should build and run all three containers, and by accessing `http://localhost:4200` in your preferred browser, you should see the login screen.


