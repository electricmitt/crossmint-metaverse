import axios, { AxiosInstance, AxiosError } from 'axios';
import { getConfig } from '../utils/config';
import { MegaverseMap } from '../models/types';

const MAX_RETRIES = 5;
const INITIAL_BACKOFF_MS = 500;

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

  private async withRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES, backoff = INITIAL_BACKOFF_MS): Promise<T> {
    let attempt = 0;
    while (true) {
      try {
        return await fn();
      } catch (error) {
        const status = (error as AxiosError)?.response?.status;
        if ((status === 429 || status === 500) && attempt < retries) {
          await new Promise(res => setTimeout(res, backoff));
          attempt++;
          backoff *= 2;
        } else {
          throw error;
        }
      }
    }
  }

  async placePolyanet(row: number, column: number): Promise<void> {
    return this.withRetry(async () => {
      await this.client.post('/polyanets', {
        row,
        column,
        candidateId: this.candidateId,
      });
    });
  }

  async removePolyanet(row: number, column: number): Promise<void> {
    return this.withRetry(async () => {
      await this.client.delete('/polyanets', {
        data: {
          row,
          column,
          candidateId: this.candidateId,
        },
      });
    });
  }

  async placeSoloon(row: number, column: number, color: string): Promise<void> {
    return this.withRetry(async () => {
      await this.client.post('/soloons', {
        row,
        column,
        color: color.toLowerCase(),
        candidateId: this.candidateId,
      });
    });
  }

  async removeSoloon(row: number, column: number): Promise<void> {
    return this.withRetry(async () => {
      await this.client.delete('/soloons', {
        data: {
          row,
          column,
          candidateId: this.candidateId,
        },
      });
    });
  }

  async placeCometh(row: number, column: number, direction: string): Promise<void> {
    return this.withRetry(async () => {
      await this.client.post('/comeths', {
        row,
        column,
        direction: direction.toLowerCase(),
        candidateId: this.candidateId,
      });
    });
  }

  async removeCometh(row: number, column: number): Promise<void> {
    return this.withRetry(async () => {
      await this.client.delete('/comeths', {
        data: {
          row,
          column,
          candidateId: this.candidateId,
        },
      });
    });
  }

  async getMegaverseMap(): Promise<MegaverseMap> {
    return this.withRetry(async () => {
      const response = await this.client.get(`/map/${this.candidateId}`);
      return response.data;
    });
  }

  async getGoalMap(): Promise<MegaverseMap> {
    return this.withRetry(async () => {
      const response = await this.client.get(`/map/${this.candidateId}/goal`);
      return response.data;
    });
  }
}
