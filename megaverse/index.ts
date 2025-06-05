import { MegaverseApiClient } from './api/client';
import { MegaverseService } from './services/megaverseService';

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
  const service = new MegaverseService();
  
  try {
    console.log('Building X pattern...');
    await service.buildXPattern();
    
    console.log('\nValidating solution...');
    const currentMap = await client.getMegaverseMap();
    const goalMap = await client.getGoalMap();
    
    console.log('\nCurrent Megaverse Map:');
    console.dir(currentMap, { depth: null });
    console.log('\nGoal Megaverse Map (ASCII):');
    printAsciiGrid(goalMap);
    
    // Validate the solution
    const isValid = await service.validateSolution();
    console.log('\nSolution Validation:', isValid ? 'Yay! 🎉' : 'Nay :(');
    
    if (!isValid) {
      console.log('\nThe current map does not match the goal map. Please check the differences above.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
