import { MegaverseApiClient } from './api/client';

function printAsciiGrid(goalMap: any) {
  if (!goalMap || !goalMap.goal) {
    console.log('No goal map data to display.');
    return;
  }
  const grid = goalMap.goal;
  // Map object types to ASCII symbols
  const symbolMap: Record<string, string> = {
    'POLYANET': 'O',
    'SOLOON': 'S',
    'COMETH': 'C',
    'SPACE': '.',
    'RED_SOLOON': 'R',
    'BLUE_SOLOON': 'B',
    'PURPLE_SOLOON': 'P',
    'WHITE_SOLOON': 'W',
    'UP_COMETH': '^',
    'DOWN_COMETH': 'v',
    'LEFT_COMETH': '<',
    'RIGHT_COMETH': '>',
    null: '.',
    undefined: '.',
  };
  for (const row of grid) {
    const line = row.map((cell: string) => {
      // Try to match color/direction variants
      if (cell.endsWith('_SOLOON')) return symbolMap[cell] || 'S';
      if (cell.endsWith('_COMETH')) return symbolMap[cell] || 'C';
      return symbolMap[cell] || cell[0] || '.';
    }).join(' ');
    console.log(line);
  }
}

async function main() {
  const client = new MegaverseApiClient();
  try {
    const currentMap = await client.getMegaverseMap();
    const goalMap = await client.getGoalMap();
    console.log('Current Megaverse Map:');
    console.dir(currentMap, { depth: null });
    console.log('\nGoal Megaverse Map (ASCII):');
    printAsciiGrid(goalMap);
  } catch (error) {
    console.error('Error fetching megaverse maps:', error);
  }
}

main();
