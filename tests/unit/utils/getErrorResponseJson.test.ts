import { describe, it, expect, vi } from 'vitest';
import getErrorResponseJson from '../../../src/utils/getErrorResponseJson';
import HttpResponseError from '../../../src/dtos/httpResponseError';

describe('getErrorResponseJson utility', () => {
  it('should handle HttpResponseError with correct status code', () => {
    const mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as any;

    const error = new HttpResponseError(404, 'Animal not found');
    getErrorResponseJson(error, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Animal not found'
    });
  });

  it('should handle HttpResponseError with 500 status', () => {
    const mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as any;

    const error = new HttpResponseError(500, 'Internal server error');
    getErrorResponseJson(error, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal server error'
    });
  });

  it('should handle generic Error as 500 with error message', () => {
    const mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as any;

    const error = new Error('Something went wrong');
    getErrorResponseJson(error, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Something went wrong'
    });
  });

  it('should handle unknown error types', () => {
    const mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as any;

    const error = { someProperty: 'value' };
    getErrorResponseJson(error, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
  });
});
