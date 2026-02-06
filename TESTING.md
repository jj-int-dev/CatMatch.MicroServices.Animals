# Testing Documentation

## Overview

This Animals microservice has a comprehensive testing infrastructure using Vitest, with unit tests, integration tests, and API tests covering the major functionality.

## Test Infrastructure

### Configuration

- **Test Framework**: Vitest 4.0.18
- **Test Environment**: Node.js
- **HTTP Testing**: Supertest
- **Coverage Provider**: V8
- **Coverage Target**: ~80% for statements, branches, and functions

### Test Scripts

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Test Structure

### Unit Tests (`tests/unit/`)

Tests for individual functions and modules in isolation:

- **DTOs** (`tests/unit/dtos/`)
  - `httpResponseError.test.ts` - Error class functionality

- **Mappers** (`tests/unit/mappers/`)
  - `adoptableAnimalSchemaToAdoptableAnimal.test.ts` - Data transformation
  - `adoptableAnimalsSchemaToAdoptableAnimals.test.ts` - Array transformation

- **Utilities** (`tests/unit/utils/`)
  - `getErrorResponseJson.test.ts` - Error response formatting

- **Validators** (`tests/unit/validators/requests/`)
  - `paginationValidator.test.ts` - Pagination parameter validation
  - `animalIdValidator.test.ts` - Animal ID validation
  - `addAnimalValidator.test.ts` - Animal creation data validation

- **Commands** (`tests/unit/commands/`)
  - `getAnimalCommand.test.ts` - Database query for single animal
  - `addAnimalCommand.test.ts` - Database insert for new animal

### API Tests (`tests/api/routes/`)

Integration tests for HTTP endpoints using Supertest:

- **Animal Routes** (`tests/api/routes/animalRoutes.test.ts`)
  - GET `/api/animals/:animalId` - Retrieve adoptable animal
  - POST `/api/animals` - Search for adoptable animals

- **Rehomer Routes** (`tests/api/routes/rehomerRoutes.test.ts`)
  - POST `/api/rehomers/:userId/add-animal` - Create animal listing
  - GET `/api/rehomers/:userId/animals/:animalId` - Get single animal
  - GET `/api/rehomers/:userId/animals` - List all animals
  - PATCH `/api/rehomers/:userId/update-animal/:animalId` - Update animal
  - DELETE `/api/rehomers/:userId/remove-animal/:animalId` - Delete animal

## Test Utilities

### Mocks (`tests/mocks/`)

Pre-configured mocks for external dependencies:

- `database.mock.ts` - Database client mock
- `supabase.mock.ts` - Supabase auth and storage mocks
- `cache.mock.ts` - Redis cache mock
- `axios.mock.ts` - HTTP client mock

### Fixtures (`tests/fixtures/`)

- `animal.fixtures.ts` - Sample animal data for tests

### Setup (`tests/setup.ts`)

Global test configuration:

- Environment variable mocking
- Console output suppression during tests

## Current Status

### Test Results

```
Test Files: 11 passed (11 total) ✅
Tests: 48 passed (48 total) ✅
Duration: ~13-15 seconds
```

### Passing Tests

✅ **All tests passing - 100% success rate!**

**Unit Tests (39 tests):**

- ✅ DTOs (4 tests) - Error class functionality
- ✅ Mappers (5 tests) - Data transformation logic
- ✅ Utilities (4 tests) - Error response formatting
- ✅ Validators (21 tests) - Request validation
  - Pagination validator (8 tests)
  - Animal ID validator (4 tests)
  - Add animal validator (9 tests)
- ✅ Commands (5 tests) - Database operations
  - Get animal command (2 tests)
  - Add animal command (3 tests)

**API Tests (9 tests):**

- ✅ Animal Routes (3 tests) - Public endpoint functionality
- ✅ Rehomer Routes (6 tests) - CRUD operations

### Test Quality Metrics

- **Pass Rate**: 100% (48/48 tests)
- **Execution Speed**: Fast (~13-15 seconds for full suite)
- **Reliability**: Zero flaky tests
- **Independence**: All tests properly isolated with mocks
- **Maintainability**: Clear structure and comprehensive coverage of critical paths
