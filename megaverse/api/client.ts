import axios, { AxiosInstance } from 'axios';
import { getConfig } from '../utils/config';
import { MegaverseMap } from '../models/types';

export class MegaverseApiClient {
  private client: AxiosInstance;
  private candidateId: string;

  constructor() {
    const { apiKey, baseUrl } = getConfig();
    this.candidateId = apiKey; // candidateId is the API key
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async placePolyanet(row: number, column: number): Promise<void> {
    try {
      await this.client.post('/polyanets', {
        row,
        column,
        candidateId: this.candidateId,
      });
    } catch (error) {
      throw new Error(`Failed to place Polyanet: ${error}`);
    }
  }

  async removePolyanet(row: number, column: number): Promise<void> {
    try {
      await this.client.delete('/polyanets', {
        data: {
          row,
          column,
          candidateId: this.candidateId,
        },
      });
    } catch (error) {
      throw new Error(`Failed to remove Polyanet: ${error}`);
    }
  }

  async placeSoloon(row: number, column: number, color: string): Promise<void> {
    try {
      await this.client.post('/soloons', {
        row,
        column,
        color: color.toLowerCase(),
        candidateId: this.candidateId,
      });
    } catch (error) {
      throw new Error(`Failed to place Soloon: ${error}`);
    }
  }

  async removeSoloon(row: number, column: number): Promise<void> {
    try {
      await this.client.delete('/soloons', {
        data: {
          row,
          column,
          candidateId: this.candidateId,
        },
      });
    } catch (error) {
      throw new Error(`Failed to remove Soloon: ${error}`);
    }
  }

  async placeCometh(row: number, column: number, direction: string): Promise<void> {
    try {
      await this.client.post('/comeths', {
        row,
        column,
        direction: direction.toLowerCase(),
        candidateId: this.candidateId,
      });
    } catch (error) {
      throw new Error(`Failed to place Cometh: ${error}`);
    }
  }

  async removeCometh(row: number, column: number): Promise<void> {
    try {
      await this.client.delete('/comeths', {
        data: {
          row,
          column,
          candidateId: this.candidateId,
        },
      });
    } catch (error) {
      throw new Error(`Failed to remove Cometh: ${error}`);
    }
  }

  async getMegaverseMap(): Promise<MegaverseMap> {
    try {
      const response = await this.client.get(`/map/${this.candidateId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch Megaverse map: ${error}`);
    }
  }

  async getGoalMap(): Promise<MegaverseMap> {
    try {
      const response = await this.client.get(`/map/${this.candidateId}/goal`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch goal map: ${error}`);
    }
  }
}
