import { describe, it, expect, vi, beforeEach } from 'vitest';
import paginationValidator from '../../../../src/validators/requests/paginationValidator';

describe('paginationValidator', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    mockReq = {
      query: {}
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    mockNext = vi.fn();
  });

  it('should set default values when page and pageSize are not provided', async () => {
    await paginationValidator(mockReq, mockRes, mockNext);

    expect(mockReq.query.page).toBe('1');
    expect(mockReq.query.pageSize).toBe('10');
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should accept valid page and pageSize values', async () => {
    mockReq.query = { page: '2', pageSize: '15' };

    await paginationValidator(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should reject page less than 1', async () => {
    mockReq.query = { page: '0' };

    await paginationValidator(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Page must be a number with a value of at least 1'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject non-numeric page', async () => {
    mockReq.query = { page: 'abc' };

    await paginationValidator(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject pageSize less than 1', async () => {
    mockReq.query = { pageSize: '0' };

    await paginationValidator(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Page size must be a number between 1 and 20 (inclusive)'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject pageSize greater than 20', async () => {
    mockReq.query = { pageSize: '21' };

    await paginationValidator(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should reject non-numeric pageSize', async () => {
    mockReq.query = { pageSize: 'xyz' };

    await paginationValidator(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    mockNext.mockImplementation(() => {
      throw new Error('Test error');
    });
    mockReq.query = { page: '1', pageSize: '10' };

    await paginationValidator(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Internal Server Error'
    });
  });
});
