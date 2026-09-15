<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# CampusEvents

CampusEvents is a React, Express, MongoDB, and Node.js event management application for students and organizers. The codebase is written in JavaScript and keeps the original event registration, QR ticket, attendance, feedback, certificate, notification, and profile workflows.

## Run Locally

**Prerequisites:** Node.js 18+


1. Install dependencies: `npm install`
2. Add your MongoDB connection string to `MONGODB_URI` in `.env` (the server retains its demo fallback when Atlas is unavailable).
3. Start the development server: `npm run dev`

The website is available at `http://localhost:3000`.

## Production

Run `npm run build`, then `npm start` to serve the bundled Express server and built React client.
