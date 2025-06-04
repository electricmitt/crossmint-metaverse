# Megaverse Project

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:**
   - Create a `.env` file in the project root with:
     ```env
     MEGAVERSE_API_KEY=your-candidate-id-here
     MEGAVERSE_API_BASE_URL=https://challenge.crossmint.io/api
     ```
   - Replace `your-candidate-id-here` with your actual candidate ID.

## Project Structure

```
/megaverse
  /api
    client.ts           # API wrapper
  /models
    types.ts            # Domain models/interfaces
  /services
    megaverseService.ts # Business logic for placing objects
    shapeBuilder.ts     # Shape logic engine
  /utils
    validator.ts        # For error-checking and validation
    config.ts           # Loads environment variables
  index.ts              # Entry point and visualization script
```

## Environment Variables
- `MEGAVERSE_API_KEY`: Your candidate ID for authenticating with the Megaverse API.
- `MEGAVERSE_API_BASE_URL`: The base URL for the Megaverse API endpoints (should be `https://challenge.crossmint.io/api`).

## Visualizing the Megaverse Goal Map

You can visualize your Megaverse goal map as an ASCII grid for easier inspection.

### How to Run

1. Make sure your `.env` is set up as described above.
2. Run the following command:
   ```sh
   npx ts-node megaverse/index.ts
   ```
   (If you see an error about `ts-node` not being found, install it with `npm install -g ts-node` or `npm install --save-dev ts-node`.)

### What You'll See
- The current Megaverse map (raw object)
- The goal Megaverse map as a human-friendly ASCII grid, e.g.:
  ```
  . . O . .
  . R O B .
  O O O O O
  . P O W .
  . . O . .
  ```
  - `O` = Polyanet
  - `R/B/P/W` = Red/Blue/Purple/White Soloon
  - `^/v/</>` = Up/Down/Left/Right Cometh
  - `.` = Empty space

## Next Steps
- Implement automation to build the goal map.
- Add more visualizations or features as needed.

---

For any issues or questions, feel free to reach out! 