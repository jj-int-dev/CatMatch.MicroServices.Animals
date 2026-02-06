# CatMatch Animals Microservice

A RESTful microservice for managing and discovering adoptable animals, part of the CatMatch platform. This service provides location-based search capabilities, comprehensive animal profiles, and secure API endpoints for finding pets available for adoption.

## Overview

The Animals microservice handles all animal-related operations in the CatMatch ecosystem, including:

- **Location-based search**: Find adoptable animals near you using IP geolocation, device location, or custom coordinates
- **Advanced filtering**: Search by gender, age range, neutered status, and distance
- **Detailed profiles**: Access complete animal information including photos, characteristics, and location
- **Secure access**: Authentication and authorization for all endpoints
- **Optimized performance**: Redis caching for improved response times

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js v5
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: Supabase (for animal photos)
- **Cache**: Upstash Redis
- **Geolocation**: ngeohash for location-based queries
- **Testing**: Vitest with coverage support
- **API Documentation**: Swagger/OpenAPI
- **Validation**: Zod schemas

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Supabase account (for photo storage)
- Upstash Redis instance

### Installation

```bash
# Clone the repository
git clone https://github.com/jj-int-dev/CatMatch.MicroServices.Animals.git
cd CatMatch.MicroServices.Animals

# Install dependencies
npm install

# Set up environment variables (see Configuration section)
cp .env.example .env
```

### Configuration

Create a `.env` file with the following variables:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=your_postgres_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
REDIS_URL=your_upstash_redis_url
AUTHORIZED_CALLER=https://your-frontend-domain.com
```

### Database Setup

```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Open Drizzle Studio to view/edit database
npm run db:studio
```

### Running the Service

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

The service will be available at `http://localhost:3000` (or your configured PORT).

## API Documentation

Once the service is running, access the interactive Swagger documentation at:

```
http://localhost:3000/api-docs
```

### Key Endpoints

- `GET /api/animals/:animalId` - Get a single animal by ID
- `POST /api/animals` - Search for adoptable animals with filters
- `POST /api/rehomers/animals` - Create a new animal listing (rehomer only)
- `PUT /api/rehomers/animals/:animalId` - Update animal details
- `DELETE /api/rehomers/animals/:animalId` - Remove an animal listing

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## Project Structure

```
src/
├── actions/          # Business logic layer
├── commands/         # Data access layer
├── config/           # Configuration files
├── database-migrations/ # Drizzle ORM migrations
├── dtos/            # Data transfer objects
├── mappers/         # Data transformation utilities
├── routes/          # Express route handlers
├── utils/           # Shared utilities (DB, cache, storage clients)
└── validators/      # Request/response validation schemas

tests/
├── api/             # Integration tests
├── unit/            # Unit tests
├── fixtures/        # Test data
└── mocks/           # Mock implementations
```

## Key Features

### Location-Based Search

The service supports three location sources:

- **client-ip**: Automatic geolocation using client's IP address
- **client-current-location**: Uses device GPS coordinates
- **client-custom-location**: User-specified location with coordinates

Distance-based filtering uses geohash for efficient spatial queries.

### Caching Strategy

Redis caching is implemented for:

- Frequently accessed animal data
- Search results (normalized by location buckets)
- Geolocation lookups

### Image Management

Animal photos are stored in Supabase Storage with:

- Automatic file upload handling
- Multiple photos per animal
- Secure access controls
