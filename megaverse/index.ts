import { MegaverseApiClient } from './api/client';
import { MegaverseService } from './services/megaverseService';

// quick and dirty way to visualize the grid
function printAsciiGrid(goalMap: any) {
  if (!goalMap || !goalMap.goal) {
    console.log('No map data to show');
    return;
  }
  const grid = goalMap.goal;
  // map stuff to ascii
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
      // handle variants
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
    // get the goal map first
    console.log('Getting goal map...');
    const goalMap = await client.getGoalMap();
    console.log('\nGoal Map (ASCII):');
    printAsciiGrid(goalMap);
    
    // build the logo
    console.log('\nBuilding Crossmint logo...');
    await service.buildFromGoalMap();
    
    // check if it worked
    console.log('\nChecking solution...');
    const currentMap = await client.getMegaverseMap();
    
    console.log('\nCurrent Map:');
    console.dir(currentMap, { depth: null });
    
    // validate
    const isValid = await service.validateSolution();
    console.log('\nSolution:', isValid ? '✅ Looks good!' : '❌ Something is wrong');
    
    if (!isValid) {
      console.log('\nThe map doesnt match the goal. Check the differences above.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// run it
main();
