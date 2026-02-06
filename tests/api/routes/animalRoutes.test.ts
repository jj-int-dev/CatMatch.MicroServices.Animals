import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Mock BEFORE importing app
vi.mock('../../../src/utils/databaseClient', () => ({
  db: {
    execute: vi.fn()
  }
}));

vi.mock('../../../src/utils/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn()
    }
  }
}));

vi.mock('../../../src/utils/cacheClient', () => ({
  cache: {
    get: vi.fn(),
    set: vi.fn()
  }
}));

import app from '../../../src/app';
import { db } from '../../../src/utils/databaseClient';
import { supabase } from '../../../src/utils/supabaseClient';

describe('Animal Routes - Basic Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have routes defined', () => {
    expect(app).toBeDefined();
  });

  it('should respond to GET /api/animals/:animalId endpoint', async () => {
    const response = await request(app).get('/api/animals/test-123');

    // Route exists (not 404)
    expect([200, 401, 500]).toContain(response.status);
  });

  it('should respond to POST /api/animals endpoint', async () => {
    const response = await request(app).post('/api/animals').send({});

    // Route exists (not 404)
    expect([200, 400, 401, 500]).toContain(response.status);
  });
});
