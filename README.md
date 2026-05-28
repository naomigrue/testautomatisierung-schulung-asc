# Schulung Testautomation

Schulungsunterlagen für Testautomatisierung. Beinhaltet die Präsentation sowie ein Beispielprojekt mit zugehörigen E2E Tests.

## Voraussetzungen
* Docker & Docker Compose
* Node.js 20+

## Starten der Applikation

```bash
cd example
docker compose up --build
```


| Service  | URL                      |
| -------- | ------------------------ |
| Frontend | http://localhost:3000    |
| Backend  | http://localhost:8080    |


## Starten der E2E Tests

```bash
cd e2e
npm install
npx playwright test
npx playwright test --ui     #mit UI
```


## Präsentation

```bash
cd presentation
npm install
npm run dev
```