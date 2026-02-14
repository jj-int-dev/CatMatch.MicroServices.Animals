import type { Options } from 'swagger-jsdoc';
import config from './config';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Animals API',
      version: '1.0.0',
      description: 'API documentation for the Cat Match Animals microservice'
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT access token for authentication'
        },
        refreshToken: {
          type: 'apiKey',
          in: 'header',
          name: 'refresh-token',
          description: 'Refresh token for authentication'
        }
      },
      schemas: {
        AnimalPhoto: {
          type: 'object',
          properties: {
            photoUrl: {
              type: 'string',
              format: 'uri',
              description: 'URL of the animal photo'
            },
            order: {
              type: 'integer',
              minimum: 0,
              description: 'Display order of the photo (0-based)'
            }
          },
          required: ['photoUrl', 'order']
        },
        Address: {
          type: 'object',
          properties: {
            latitude: {
              type: 'number',
              minimum: -90,
              maximum: 90,
              description: 'Latitude coordinate'
            },
            longitude: {
              type: 'number',
              minimum: -180,
              maximum: 180,
              description: 'Longitude coordinate'
            }
          },
          required: ['latitude', 'longitude']
        },
        AdoptableAnimal: {
          type: 'object',
          properties: {
            animalId: {
              type: 'string',
              description: 'Unique identifier for the animal'
            },
            name: {
              type: 'string',
              description: 'Name of the animal'
            },
            gender: {
              type: 'string',
              enum: ['Male', 'Female'],
              description: 'Gender of the animal'
            },
            ageInWeeks: {
              type: 'integer',
              minimum: 0,
              description: 'Age of the animal in weeks'
            },
            neutered: {
              type: 'boolean',
              description: 'Whether the animal is neutered/spayed'
            },
            description: {
              type: 'string',
              description: 'Description of the animal'
            },
            addressLatitude: {
              type: 'number',
              description: 'Latitude of animal location'
            },
            addressLongitude: {
              type: 'number',
              description: 'Longitude of animal location'
            },
            rehomerId: {
              type: 'string',
              description: 'ID of the rehomer who owns this animal'
            },
            animalPhotos: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/AnimalPhoto'
              },
              maxItems: 5,
              description: 'Photos of the animal (maximum 5)'
            }
          }
        },
        Animal: {
          type: 'object',
          properties: {
            animalId: {
              type: 'string',
              description: 'Unique identifier for the animal'
            },
            name: {
              type: 'string',
              description: 'Name of the animal'
            },
            gender: {
              type: 'string',
              enum: ['Male', 'Female'],
              description: 'Gender of the animal'
            },
            ageInWeeks: {
              type: 'integer',
              minimum: 0,
              description: 'Age of the animal in weeks'
            },
            neutered: {
              type: 'boolean',
              description: 'Whether the animal is neutered/spayed'
            },
            addressDisplayName: {
              type: 'string',
              description: 'Human-readable address display name'
            },
            description: {
              type: 'string',
              description: 'Description of the animal'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the animal was created'
            },
            addressLatitude: {
              type: 'number',
              description: 'Latitude of animal location'
            },
            addressLongitude: {
              type: 'number',
              description: 'Longitude of animal location'
            },
            animalPhotos: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/AnimalPhoto'
              },
              maxItems: 5,
              description: 'Photos of the animal (maximum 5)'
            }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              minimum: 1,
              description: 'Current page number'
            },
            pageSize: {
              type: 'integer',
              minimum: 1,
              maximum: 20,
              description: 'Number of items per page'
            },
            totalItems: {
              type: 'integer',
              minimum: 0,
              description: 'Total number of items'
            },
            totalPages: {
              type: 'integer',
              minimum: 0,
              description: 'Total number of pages'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: [],
        refreshToken: []
      }
    ]
  },
  apis: ['**/*.ts'] // Paths to the JSDoc-commented TypeScript files
};

export default swaggerOptions;
