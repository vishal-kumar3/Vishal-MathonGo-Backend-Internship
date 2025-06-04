# MathonGo Chapter Performance Dashboard API

A RESTful API backend for managing chapter performance data with filtering, caching, and rate limiting.

## Features

- RESTful API endpoints for chapter management
- Redis caching with 1-hour TTL
- Rate limiting (30 requests/minute per IP)
- Admin authentication for chapter uploads
- Advanced filtering and pagination
- MongoDB with optimized indexes
- Error handling and validation

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Start MongoDB and Redis services
5. Run the server: `npm run dev`

## API Endpoints

### GET /api/v1/chapters
- Get all chapters with filtering and pagination
- Query parameters: class, unit, status, weakChapters, subject, page, limit

### GET /api/v1/chapters/:id
- Get a specific chapter by ID

### POST /api/v1/chapters
- Upload chapters (Admin only)
- Requires `admin-secret` header
- Accepts JSON file upload or JSON in request body

## Authentication

Admin endpoints require the `admin-secret` header with the correct secret key.

## Caching

Results are cached in Redis for 1 hour. Cache is invalidated when new chapters are added.

## Rate Limiting

API is rate-limited to 30 requests per minute per IP address using Redis.
