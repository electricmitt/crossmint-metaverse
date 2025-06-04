import axios from 'axios';
import { MegaverseApiClient } from './client';

jest.mock('axios');
const mockedAxios = axios.create() as jest.Mocked<typeof axios>;

// Mock config loader
jest.mock('../utils/config', () => ({
  getConfig: () => ({
    apiKey: 'test-candidate-id',
    baseUrl: 'https://challenge.crossmint.io/api',
  }),
}));

describe('MegaverseApiClient', () => {
  let client: MegaverseApiClient;

  beforeEach(() => {
    (axios.create as jest.Mock).mockReturnValue(mockedAxios);
    client = new MegaverseApiClient();
    jest.clearAllMocks();
  });

  it('should call POST /polyanets with correct payload', async () => {
    mockedAxios.post.mockResolvedValue({});
    await client.placePolyanet(1, 2);
    expect(mockedAxios.post).toHaveBeenCalledWith('/polyanets', {
      row: 1,
      column: 2,
      candidateId: 'test-candidate-id',
    });
  });

  it('should call DELETE /polyanets with correct payload', async () => {
    mockedAxios.delete.mockResolvedValue({});
    await client.removePolyanet(1, 2);
    expect(mockedAxios.delete).toHaveBeenCalledWith('/polyanets', {
      data: {
        row: 1,
        column: 2,
        candidateId: 'test-candidate-id',
      },
    });
  });

  it('should call POST /soloons with correct payload', async () => {
    mockedAxios.post.mockResolvedValue({});
    await client.placeSoloon(3, 4, 'blue');
    expect(mockedAxios.post).toHaveBeenCalledWith('/soloons', {
      row: 3,
      column: 4,
      color: 'blue',
      candidateId: 'test-candidate-id',
    });
  });

  it('should call DELETE /soloons with correct payload', async () => {
    mockedAxios.delete.mockResolvedValue({});
    await client.removeSoloon(3, 4);
    expect(mockedAxios.delete).toHaveBeenCalledWith('/soloons', {
      data: {
        row: 3,
        column: 4,
        candidateId: 'test-candidate-id',
      },
    });
  });

  it('should call POST /comeths with correct payload', async () => {
    mockedAxios.post.mockResolvedValue({});
    await client.placeCometh(5, 6, 'up');
    expect(mockedAxios.post).toHaveBeenCalledWith('/comeths', {
      row: 5,
      column: 6,
      direction: 'up',
      candidateId: 'test-candidate-id',
    });
  });

  it('should call DELETE /comeths with correct payload', async () => {
    mockedAxios.delete.mockResolvedValue({});
    await client.removeCometh(5, 6);
    expect(mockedAxios.delete).toHaveBeenCalledWith('/comeths', {
      data: {
        row: 5,
        column: 6,
        candidateId: 'test-candidate-id',
      },
    });
  });

  it('should call GET /map/{candidateId}', async () => {
    mockedAxios.get.mockResolvedValue({ data: { map: [] } });
    const result = await client.getMegaverseMap();
    expect(mockedAxios.get).toHaveBeenCalledWith('/map/test-candidate-id');
    expect(result).toEqual({ map: [] });
  });

  it('should call GET /map/{candidateId}/goal', async () => {
    mockedAxios.get.mockResolvedValue({ data: { goal: [] } });
    const result = await client.getGoalMap();
    expect(mockedAxios.get).toHaveBeenCalledWith('/map/test-candidate-id/goal');
    expect(result).toEqual({ goal: [] });
  });

  it('should retry on 429 and 500 errors', async () => {
    const error429 = { response: { status: 429 } };
    const error500 = { response: { status: 500 } };
    mockedAxios.post.mockRejectedValueOnce(error429 as any)
      .mockRejectedValueOnce(error500 as any)
      .mockResolvedValue({});
    await client.placePolyanet(1, 2);
    expect(mockedAxios.post).toHaveBeenCalledTimes(3);
  });
}); 