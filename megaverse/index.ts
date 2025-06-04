import { MegaverseApiClient } from './api/client';

async function main() {
  const client = new MegaverseApiClient();
  try {
    const currentMap = await client.getMegaverseMap();
    const goalMap = await client.getGoalMap();
    console.log('Current Megaverse Map:');
    console.dir(currentMap, { depth: null });
    console.log('\nGoal Megaverse Map:');
    console.dir(goalMap, { depth: null });
  } catch (error) {
    console.error('Error fetching megaverse maps:', error);
  }
}

main();
