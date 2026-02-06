import { describe, it, expect, vi, beforeEach } from 'vitest';
import animalIdValidator from '../../../../src/validators/requests/animalIdValidator';

describe('animalIdValidator', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    mockReq = {
      params: {}
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    mockNext = vi.fn();
  });

  it('should accept valid animalId', () => {
    mockReq.params.animalId = 'animal-123';

    animalIdValidator(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should reject missing animalId', () => {
    mockReq.params.animalId = undefined;

    animalIdValidator(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Invalid animal ID'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject empty animalId', () => {
    mockReq.params.animalId = '';

    animalIdValidator(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Invalid animal ID'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject whitespace-only animalId', () => {
    mockReq.params.animalId = '   ';

    animalIdValidator(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
