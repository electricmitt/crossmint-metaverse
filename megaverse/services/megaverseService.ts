import { MegaverseApiClient } from '../api/client';
import { ShapeBuilder, Shape, ShapeConfig } from './shapeBuilder';
import { AstralObject, ObjectType, Soloon, Cometh, MegaverseMap } from '../models/types';
export class MegaverseService {
  private apiClient: MegaverseApiClient;
  // keeping track of failed attempts for debugging
  private failedAttempts: Map<string, number> = new Map();

  constructor() {
    this.apiClient = new MegaverseApiClient();
  }

  async validateSolution(): Promise<boolean> {
    const currentMap = await this.apiClient.getMegaverseMap();
    const goalMap = await this.apiClient.getGoalMap();

    if (!currentMap.map || !currentMap.map.content || !goalMap.goal) {
      throw new Error('Map data is messed up, something went wrong');
    }

    const currentGrid = currentMap.map.content;
    const goalGrid = goalMap.goal;

    // quick lookup for types
    const typeMap: Record<number, string> = {
      0: 'POLYANET',
      1: 'SOLOON',
      2: 'COMETH',
    };

    // check if dimensions match
    if (currentGrid.length !== goalGrid.length || 
        (currentGrid[0] && goalGrid[0] && currentGrid[0].length !== goalGrid[0].length)) {
      console.log('Grid sizes dont match, something is wrong');
      return false;
    }

    let mismatchCount = 0;
    const maxMismatchesToShow = 10; // dont spam the console

    // compare each cell
    for (let i = 0; i < currentGrid.length; i++) {
      for (let j = 0; j < currentGrid[i].length; j++) {
        const currentCell = currentGrid[i][j];
        const goalCell = goalGrid[i][j];

        // skip empty cells
        if (!currentCell && (!goalCell || goalCell === 'SPACE')) continue;

        // handle empty vs non-empty mismatch
        if (!currentCell || !goalCell || goalCell === 'SPACE') {
          if (mismatchCount < maxMismatchesToShow) {
            console.warn(`Mismatch at (${i}, ${j}): got=${JSON.stringify(currentCell)}, want=${goalCell}`);
            mismatchCount++;
          }
          return false;
        }

        // figure out what we have
        let currentType: string | null = null;
        let currentProps: string | null = null;

        if (currentCell.type === 0) {
          currentType = 'POLYANET';
        } else if (currentCell.type === 1 && currentCell.color) {
          currentType = 'SOLOON';
          currentProps = currentCell.color.toUpperCase();
        } else if (currentCell.type === 2 && currentCell.direction) {
          currentType = 'COMETH';
          currentProps = currentCell.direction.toUpperCase();
        }

        // figure out what we want
        let goalType: string | null = null;
        let goalProps: string | null = null;

        if (goalCell === 'POLYANET') {
          goalType = 'POLYANET';
        } else if (goalCell.endsWith('_SOLOON')) {
          goalType = 'SOLOON';
          goalProps = goalCell.split('_')[0];
        } else if (goalCell.endsWith('_COMETH')) {
          goalType = 'COMETH';
          goalProps = goalCell.split('_')[0];
        }

        // check if they match
        if (currentType !== goalType || (currentProps && goalProps && currentProps !== goalProps)) {
          if (mismatchCount < maxMismatchesToShow) {
            console.warn(`Mismatch at (${i}, ${j}): got=${currentType}${currentProps ? ' ' + currentProps : ''}, want=${goalType}${goalProps ? ' ' + goalProps : ''}`);
            mismatchCount++;
          }
          return false;
        }
      }
    }

    return true;
  }


  async buildMegaverseFromTemplate(shape: Shape, config: ShapeConfig): Promise<void> {
    // const map = await this.apiClient.getMegaverseMap(); // might need this later
    const objects = ShapeBuilder.generateShape(shape, config);

    // try to place everything at once
    const placementPromises = objects.map(obj => {
      switch (obj.type) {
        case ObjectType.POLYANET:
          return this.apiClient.placePolyanet(obj.coordinates.row, obj.coordinates.column);
        case ObjectType.SOLOON:
          return this.apiClient.placeSoloon(
            obj.coordinates.row,
            obj.coordinates.column,
            (obj as Soloon).color
          );
        case ObjectType.COMETH:
          return this.apiClient.placeCometh(
            obj.coordinates.row,
            obj.coordinates.column,
            (obj as Cometh).direction
          );
        default:
          console.error('Unknown object type:', obj);
          return Promise.reject(new Error('Unknown object type'));
      }
    });

    const results = await Promise.allSettled(placementPromises);
    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        console.log(`✅ Placed at (${objects[i].coordinates.row}, ${objects[i].coordinates.column})`);
      } else {
        console.error(`❌ Failed at (${objects[i].coordinates.row}, ${objects[i].coordinates.column}):`, result.reason);
        // track failed attempts
        const key = `${objects[i].coordinates.row},${objects[i].coordinates.column}`;
        this.failedAttempts.set(key, (this.failedAttempts.get(key) || 0) + 1);
      }
    });
  }

  // quick helper to build an X pattern
  async buildXPattern(): Promise<void> {
    const size = 11; // based on the goal map
    const objects: AstralObject[] = [];
    
    // build the X
    for (let i = 0; i < size; i++) {
      // top-left to bottom-right
      if (i >= 2 && i <= 8) {
        objects.push({
          type: ObjectType.POLYANET,
          coordinates: { row: i, column: i }
        });
      }
      
      // top-right to bottom-left
      if (i >= 2 && i <= 8) {
        objects.push({
          type: ObjectType.POLYANET,
          coordinates: { row: i, column: size - 1 - i }
        });
      }
    }

    // try to place everything
    const placementPromises = objects.map(obj => 
      this.apiClient.placePolyanet(obj.coordinates.row, obj.coordinates.column)
    );

    const results = await Promise.allSettled(placementPromises);
    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        console.log(`✅ Placed at (${objects[i].coordinates.row}, ${objects[i].coordinates.column})`);
      } else {
        console.error(`❌ Failed at (${objects[i].coordinates.row}, ${objects[i].coordinates.column}):`, result.reason);
      }
    });
  }

  // main function to build from goal map
  async buildFromGoalMap(): Promise<void> {
    const goalMap = await this.apiClient.getGoalMap();
    if (!goalMap.goal) {
      throw new Error('No goal map found');
    }

    const grid = goalMap.goal;
    const size = grid.length;

    // helper to check if cell is a polyanet
    const isPolyanet = (row: number, col: number): boolean => {
      return grid[row][col] === 'POLYANET';
    };

    // helper to check if cell is next to a polyanet
    const isAdjacentToPolyanet = (row: number, col: number): boolean => {
      const dirs = [
        { dr: -1, dc: 0 }, // up
        { dr: 1, dc: 0 },  // down
        { dr: 0, dc: -1 }, // left
        { dr: 0, dc: 1 }   // right
      ];
      return dirs.some(({ dr, dc }) => {
        const newRow = row + dr;
        const newCol = col + dc;
        return newRow >= 0 && newRow < size && newCol >= 0 && newCol < size && isPolyanet(newRow, newCol);
      });
    };

    // place polyanets first
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const cell = grid[row][col];
        if (cell === 'POLYANET') {
          try {
            await this.apiClient.placePolyanet(row, col);
            console.log(`✅ Placed Polyanet at (${row}, ${col})`);
          } catch (error) {
            console.error(`❌ Failed to place Polyanet at (${row}, ${col}):`, error);
          }
        }
      }
    }

    // place soloons (need to be next to polyanets)
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const cell = grid[row][col];
        if (cell && cell.endsWith('_SOLOON')) {
          const color = cell.split('_')[0].toLowerCase();
          if (isAdjacentToPolyanet(row, col)) {
            try {
              await this.apiClient.placeSoloon(row, col, color);
              console.log(`✅ Placed ${color} Soloon at (${row}, ${col})`);
            } catch (error) {
              console.error(`❌ Failed to place Soloon at (${row}, ${col}):`, error);
            }
          } else {
            console.warn(`⚠️ Soloon at (${row}, ${col}) not next to Polyanet, skipping`);
          }
        }
      }
    }

    // place comeths last
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const cell = grid[row][col];
        if (cell && cell.endsWith('_COMETH')) {
          const direction = cell.split('_')[0].toLowerCase();
          try {
            await this.apiClient.placeCometh(row, col, direction);
            console.log(`✅ Placed ${direction} Cometh at (${row}, ${col})`);
          } catch (error) {
            console.error(`❌ Failed to place Cometh at (${row}, ${col}):`, error);
          }
        }
      }
    }
  }
}
