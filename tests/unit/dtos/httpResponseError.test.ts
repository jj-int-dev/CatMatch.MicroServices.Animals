import { describe, it, expect } from 'vitest';
import HttpResponseError from '../../../src/dtos/httpResponseError';

describe('HttpResponseError DTO', () => {
  it('should create an error with status code and message', () => {
    const error = new HttpResponseError(404, 'Not found');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(HttpResponseError);
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Not found');
  });

  it('should create an error with 500 status code', () => {
    const error = new HttpResponseError(500, 'Internal error');

    expect(error.statusCode).toBe(500);
    expect(error.message).toBe('Internal error');
  });

  it('should create an error with 401 status code', () => {
    const error = new HttpResponseError(401, 'Unauthorized');

    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Unauthorized');
  });

  it('should be throwable', () => {
    expect(() => {
      throw new HttpResponseError(400, 'Bad request');
    }).toThrow(HttpResponseError);

    expect(() => {
      throw new HttpResponseError(403, 'Forbidden');
    }).toThrow('Forbidden');
  });
});
