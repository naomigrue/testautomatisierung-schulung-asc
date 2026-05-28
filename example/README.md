# Example App

Minimal full-stack sample for test automation demos: React frontend, Spring Boot API, PostgreSQL, Docker Compose.

There is **no seed data** — create users via the UI or API.

## Prerequisites

- Docker Desktop (or Docker Engine + Compose v2)
- Optional for local dev without Docker: Java 21, Maven 3.9+, Node.js 20+, PostgreSQL 16

## Quick start

```bash
cd example
docker compose up --build
```

Wait until all three services are healthy, then open:

| Service  | URL                      |
| -------- | ------------------------ |
| Frontend | http://localhost:3000    |
| Backend  | http://localhost:8080    |


## Testability

The UI exposes stable selectors for automation (`data-testid`):

- `username-input`, `password-input`
- `signup-button`, `signin-button`
- `auth-error`
- `welcome-message`, `signout-button`


## Stop and reset

```bash
docker compose down      # stop containers
docker compose down -v   # stop and delete DB volume (fresh users)
```
