# TypeScript ToDo App (Node.js + Express + SQLite)

Dies ist eine einfache ToDo-Webanwendung, geschrieben in TypeScript, ohne Frontend-Frameworks (nur HTML/CSS/JS), mit einem Backend auf Basis von Node.js und Express. Die Daten werden in einer SQLite3-Datenbank gespeichert.

## Features

- Aufgaben erstellen, anzeigen, aktualisieren und löschen (CRUD)
- RESTful API mit Express
- SQLite3 als lokale Datenbank
- TypeScript für Frontend und Backend
- Kein Frontend-Framework – Vanilla JS + HTML/CSS

---

## Projektstruktur

```
├── public/               # Statische Dateien (HTML, CSS, JS)
│   └── index.html
│   └── main.ts
├── src/                  # TypeScript-Quellcode (Backend)
│   └── server.ts
│   └── routes/
│       └── todos.ts
├── db/
│   └── database.ts       # SQLite-Setup & Queries
├── dist/                 # Kompilierter JS-Code
├── package.json
├── tsconfig.json
└── README.md
```

---

## Setup

### Voraussetzungen

- Node.js (v18 oder höher empfohlen)
- npm
- sqlite3 (CLI optional)

### Installation

```bash
git clone https://github.com/dein-user/todo-typescript-sqlite.git
cd todo-typescript-sqlite

npm install
```

### Entwicklung starten

```bash
# Transpiliere TypeScript und starte den Server
npm run dev
```

oder in Produktion:

```bash
npm run build
npm start
```

Die App ist dann unter `http://localhost:3000` erreichbar.

---

## API-Endpunkte

| Methode | Pfad           | Beschreibung              |
|--------|----------------|---------------------------|
| GET    | /api/todos     | Alle Todos abrufen        |
| POST   | /api/todos     | Neues Todo hinzufügen     |
| PUT    | /api/todos/:id | Todo aktualisieren        |
| DELETE | /api/todos/:id | Todo löschen              |

---

## Datenbankschema

```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT 0
);
```

---

## ToDos / Weiterentwicklung

- [ ] Validierung im Backend
- [ ] Frontend-Formular-Validierung
- [ ] Filter für "erledigt" / "offen"
- [ ] Tests (z. B. mit Vitest oder Jest)
- [ ] Deployment auf Render / Railway / Vercel (mit SQLite-Datei)

---

## Lizenz

MIT
