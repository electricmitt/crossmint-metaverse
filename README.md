# Megaverse Project

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env`:
     ```sh
     cp .env.example .env
     ```
   - Fill in your actual API key and base URL in `.env`:
     ```env
     MEGAVERSE_API_KEY=your-api-key-here
     MEGAVERSE_API_BASE_URL=https://api.megaverse.example.com
     ```

## Project Structure

```
/megaverse
  /api
    client.ts           # API wrapper
  /models
    types.ts            # Domain models/interfaces
  /services
    megaverseService.ts # Business logic for placing objects
  /utils
    validator.ts        # For error-checking and validation
    config.ts           # Loads environment variables
  index.ts              # Entry point
```

## Environment Variables
- `MEGAVERSE_API_KEY`: Your API key for authenticating with the Megaverse API.
- `MEGAVERSE_API_BASE_URL`: The base URL for the Megaverse API endpoints.

## Next Steps
- Implement the API client in `megaverse/api/client.ts`.
- Add domain models and business logic as described in the project plan. 