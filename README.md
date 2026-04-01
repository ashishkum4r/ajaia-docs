# Ajaia Collaborative Document Editor

## Overview

This project is a lightweight collaborative document editor inspired by Google Docs and Notion aesthetics, built as a scoped full-stack product exercise.

It supports:

* Document creation and renaming
* Rich text editing
* File upload into editable documents
* Document sharing between users
* Persistent storage

## Tech Stack

* Frontend: React + Vite + TailwindCSS
* Editor: TipTap
* Backend: Node.js + Express
* Database: SQLite (better-sqlite3)
* Authentication: JWT-based mock auth with seeded users
* File Upload: Multer
* Deployment: Docker + docker-compose

## Features

### Document Editing

* Create new document
* Rename document
* Edit rich text content
* Save and reopen documents

### Rich Text Support

* Bold
* Italic
* Underline
* Headings
* Bullet lists
* Numbered lists

### File Upload

Supported file types:

* .txt
* .md
* .docx

Uploaded content is converted into editable document content.

### Sharing

* Document owner can share with another seeded user
* Owned and shared documents are visually separated

### Persistence

* Documents persist after refresh
* Formatting preserved
* Sharing relationships stored in SQLite

## Local Setup

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Docker Setup

```bash
docker compose up --build
```

## Seeded Users

Example test users:

* [owner@example.com](mailto:owner@example.com)
* [reviewer@example.com](mailto:reviewer@example.com)

## Deployment

Frontend: [Add deployed frontend URL]
Backend: [Add deployed backend URL]

## Validation and Error Handling

* Basic input validation added
* Upload type restrictions enforced
* API error handling included

## Testing

Includes one automated backend test covering document creation flow.

## Scope Decisions

This project prioritizes a reliable end-to-end editing flow over advanced collaboration features such as real-time editing or comments.
