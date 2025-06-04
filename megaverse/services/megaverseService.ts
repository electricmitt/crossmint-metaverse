import { MegaverseApiClient } from '../api/client';
import { ShapeBuilder, Shape, ShapeConfig } from './shapeBuilder';
import { AstralObject, ObjectType, Soloon, Cometh } from '../models/types';

export class MegaverseService {
  private apiClient: MegaverseApiClient;

  constructor() {
    this.apiClient = new MegaverseApiClient();
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
}
