Help Center Backend

```markdown
# Help Center Backend 


## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v22.3.0 or later)
- npm (v10.8.1 or later)

## Getting Started

To get a local copy up and running, follow these steps:

1. Install the dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open your browser and visit `http://localhost:4001/ping` to check the application runing or not .

## Project Structure

```
src/
├── controllers/
│   ├── cardController.ts
├── config/
│   ├── database.ts
├── entities/
│   ├── card.ts
├── routes/
│   ├── cardRoutes.ts
└── app.ts/

```

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode
- `npm run build`: Builds the app for production

