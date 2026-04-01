# Submission Contents

This submission includes all required materials for the AI-Native Full Stack Developer assignment.

## Included Files

* frontend/ — React + Vite + TailwindCSS client application
* backend/ — Node.js + Express API server
* README.md — setup instructions, feature overview, and run commands
* ARCHITECTURE.md — architecture decisions and prioritization notes
* AI_Usage_Note.pdf — AI workflow and verification note
* SUBMISSION.md — submission contents overview
* video-link.txt — walkthrough video link

## Core Functionality Implemented

* Document creation
* Document renaming
* Rich text editing with TipTap
* File upload into editable documents
* Document sharing between seeded users
* Persistent document storage using SQLite
* JWT-based mock authentication

## Supported File Upload Types

* .txt
* .md
* .docx

## Deployment

* Dockerized using Docker + docker-compose

## Seeded Test Users

* [owner@example.com](mailto:owner@example.com)
* [reviewer@example.com](mailto:reviewer@example.com)

## What Is Working End-to-End

* User login with seeded accounts
* Create and edit documents
* Save and reopen documents
* Upload supported files
* Share documents across users
* Persistence after refresh

## Deferred / Not Included

* Real-time collaboration
* Comments
* Version history
* Role-based permissions beyond basic sharing

## Next Improvements With Additional Time

* Real-time collaborative presence
* Export to PDF / Markdown
* Fine-grained sharing permissions
* Version history tracking
