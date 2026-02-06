import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addAnimalValidator } from '../../../../src/validators/requests/addAnimalValidator';

describe('addAnimalValidator', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    mockReq = {
      body: {}
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    mockNext = vi.fn();
  });

  const validAnimalData = {
    name: 'Whiskers',
    gender: 'Female',
    ageInWeeks: 52,
    neutered: true,
    addressDisplayName: 'Brooklyn, NY',
    description: 'Friendly cat',
    address: {
      latitude: 40.6782,
      longitude: -73.9442
    }
  };

  it('should accept valid animal data', () => {
    mockReq.body = validAnimalData;

    addAnimalValidator(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should reject missing name', () => {
    mockReq.body = { ...validAnimalData, name: '' };

    addAnimalValidator(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Invalid animal data'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject invalid gender', () => {
    mockReq.body = { ...validAnimalData, gender: 'Unknown' };

    addAnimalValidator(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject negative age', () => {
    mockReq.body = { ...validAnimalData, ageInWeeks: -1 };

    addAnimalValidator(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject age over maximum', () => {
    mockReq.body = { ...validAnimalData, ageInWeeks: 2000 };

    addAnimalValidator(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject invalid latitude', () => {
    mockReq.body = {
      ...validAnimalData,
      address: { latitude: 100, longitude: -73.9442 }
    };

    addAnimalValidator(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject invalid longitude', () => {
    mockReq.body = {
      ...validAnimalData,
      address: { latitude: 40.6782, longitude: 200 }
    };

    addAnimalValidator(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject missing address', () => {
    const { address, ...dataWithoutAddress } = validAnimalData;

    mockReq.body = dataWithoutAddress;

    addAnimalValidator(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle errors gracefully', () => {
    mockReq.body = null;

    addAnimalValidator(mockReq, mockRes, mockNext);

    // null body fails zod validation, returns 400
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Invalid animal data'
    });
  });
});
