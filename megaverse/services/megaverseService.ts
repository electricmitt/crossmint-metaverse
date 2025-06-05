import { MegaverseApiClient } from '../api/client';
import { ShapeBuilder, Shape, ShapeConfig } from './shapeBuilder';
import { AstralObject, ObjectType, Soloon, Cometh, MegaverseMap } from '../models/types';

export class MegaverseService {
  private apiClient: MegaverseApiClient;

  constructor() {
    this.apiClient = new MegaverseApiClient();
  }

  async validateSolution(): Promise<boolean> {
    const currentMap = await this.apiClient.getMegaverseMap();
    const goalMap = await this.apiClient.getGoalMap();

    const currentGrid = currentMap.map ? currentMap.map.content : [];
    const goalGrid = goalMap.goal ? goalMap.goal : [];

    // Map numeric types to string types
    const typeMap: Record<number, string> = {
      0: 'POLYANET',
      1: 'SOLOON',
      2: 'COMETH',
    };

    // Compare dimensions
    if (currentGrid.length !== goalGrid.length || 
        (currentGrid[0] && goalGrid[0] && currentGrid[0].length !== goalGrid[0].length)) {
      return false;
    }

    // Compare each cell
    for (let i = 0; i < currentGrid.length; i++) {
      for (let j = 0; j < currentGrid[i].length; j++) {
        const currentCell = currentGrid[i][j];
        const goalCell = goalGrid[i][j];

        // Map current cell type
        let currentType: string | null = null;
        if (currentCell && typeof currentCell.type === 'number') {
          currentType = typeMap[currentCell.type];
        }

        // Map goal cell type
        let goalType: string | null = null;
        if (typeof goalCell === 'string') {
          if (goalCell === 'SPACE' || goalCell === null || goalCell === undefined) {
            goalType = null;
          } else if (goalCell.endsWith('_SOLOON')) {
            goalType = 'SOLOON';
          } else if (goalCell.endsWith('_COMETH')) {
            goalType = 'COMETH';
          } else {
            goalType = goalCell;
          }
        } else if (goalCell === null || goalCell === undefined) {
          goalType = null;
        }

        // If both cells are empty, continue
        if (!currentType && !goalType) continue;

        // If one cell is empty and the other isn't, they don't match
        if (!currentType || !goalType) return false;

        // Compare object types
        if (currentType !== goalType) return false;
      }
    }

    return true;
  }

  async buildMegaverseFromTemplate(shape: Shape, config: ShapeConfig): Promise<void> {
    // 1. Fetch current map (optional: for validation/clearing)
    // const map = await this.apiClient.getMegaverseMap();
    // TODO: Validate or clear positions if needed

    // 2. Generate object placements
    const objects = ShapeBuilder.generateShape(shape, config);

    // 3. Place each object concurrently
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
          return Promise.reject(new Error('Unknown object type'));
      }
    });

    const results = await Promise.allSettled(placementPromises);
    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        console.log(`Placed object at (${objects[i].coordinates.row}, ${objects[i].coordinates.column})`);
      } else {
        console.error(`Failed to place object at (${objects[i].coordinates.row}, ${objects[i].coordinates.column}):`, result.reason);
      }
    });
  }

  async buildXPattern(): Promise<void> {
    const size = 11; // Based on the goal map size
    const objects: AstralObject[] = [];
    
    // Create X pattern
    for (let i = 0; i < size; i++) {
      // First diagonal (top-left to bottom-right)
      if (i >= 2 && i <= 8) {
        objects.push({
          type: ObjectType.POLYANET,
          coordinates: { row: i, column: i }
        });
      }
      
      // Second diagonal (top-right to bottom-left)
      if (i >= 2 && i <= 8) {
        objects.push({
          type: ObjectType.POLYANET,
          coordinates: { row: i, column: size - 1 - i }
        });
      }
    }

    // Place each object concurrently
    const placementPromises = objects.map(obj => 
      this.apiClient.placePolyanet(obj.coordinates.row, obj.coordinates.column)
    );

    const results = await Promise.allSettled(placementPromises);
    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        console.log(`Placed Polyanet at (${objects[i].coordinates.row}, ${objects[i].coordinates.column})`);
      } else {
        console.error(`Failed to place Polyanet at (${objects[i].coordinates.row}, ${objects[i].coordinates.column}):`, result.reason);
      }
    });
  }
}
