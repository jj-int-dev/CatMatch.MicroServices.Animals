import type { Request } from 'express';
import type { GetAdoptableAnimalsSchema } from '../validators/requests/getAdoptableAnimalsValidator';
import HttpResponseError from '../dtos/httpResponseError';
import getClientIPAddressCommand from '../commands/getClientIPAddressCommand';
import getCoordinatesForIPCommand from '../commands/getCoordinatesForIPCommand';
import { getAdoptableAnimalsCommand } from '../commands/getAdoptableAnimalsCommand';
import {
  toAdoptableAnimals,
  type AdoptableAnimals
} from '../mappers/adoptableAnimalsSchemaToAdoptableAnimals';

function logAnimalFilters(animalFilters: GetAdoptableAnimalsSchema) {
  console.log('Search filters:');
  for (const [key, value] of Object.entries(animalFilters)) {
    console.log(`${key}: ${value}`);
  }
}

async function populateCoordinates(
  animalFilters: GetAdoptableAnimalsSchema,
  req: Request
) {
  const clientIPAddress = getClientIPAddressCommand(req);
  const errorMsg = 'Could determine the area to look for adoptable animals in';

  if (!clientIPAddress) throw new HttpResponseError(500, errorMsg);

  const coords = await getCoordinatesForIPCommand(clientIPAddress);

  if (!coords) throw new HttpResponseError(500, errorMsg);

  const { city, location } = coords;
  console.log(
    `Found latitude ${location.latitude} and longitude ${location.longitude} for IP address ${clientIPAddress}`
  );

  animalFilters.latitude = location.latitude;
  animalFilters.longitude = location.longitude;
  animalFilters.locationDetails = city.name;
}

export type GetAdoptableAnimalsActionResponse = Promise<{
  animals: AdoptableAnimals;
  locationDisplay: string | null;
  pagination: {
    totalResults: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}>;

/**
 * @param req: the request object
 * @returns A {@link GetAdoptableAnimalsActionResponse} containing the animals and pagination metadata
 * @throws A {@link HttpResponseError} If an error occurred while fetching the animals from the database
 */
export async function getAdoptableAnimalsAction(
  req: Request
): GetAdoptableAnimalsActionResponse {
  console.log('Entering GetAdoptableAnimalsAction ...');

  const page = +req.query.page!;
  const pageSize = +req.query.pageSize!;
  const animalFilters = req.body as GetAdoptableAnimalsSchema;
  logAnimalFilters(animalFilters);

  // assuming the coordinates were provided and represent a precise location
  let geohashPrecision = 6;

  // if coordinates not provided, use client IP address to determine coordinates
  if (animalFilters.locationSource === 'client-ip') {
    await populateCoordinates(animalFilters, req);
    // reduce the precision since coordinates based on IP address won't be as accurate
    geohashPrecision = 5;
  }

  const {
    success,
    data,
    errorMsg,
    totalResults,
    page: resultPage,
    pageSize: resultPageSize
  } = await getAdoptableAnimalsCommand(
    animalFilters,
    geohashPrecision,
    page,
    pageSize
  );

  if (success && data) {
    const totalPages = Math.ceil(
      (totalResults || 0) / (resultPageSize || pageSize)
    );

    console.log(
      `Successfully retrieved ${data.length} adoptable animals (page ${resultPage || page}, size ${resultPageSize || pageSize})\nExiting GetAdoptableAnimalsAction ...`
    );

    return {
      animals: toAdoptableAnimals(data),
      locationDisplay:
        (animalFilters.locationSource === 'client-ip' ||
          animalFilters.locationSource === 'client-custom-location') &&
        Object.hasOwn(animalFilters, 'locationDetails')
          ? animalFilters.locationDetails!
          : null,
      pagination: {
        totalResults: totalResults || 0,
        page: resultPage || page,
        pageSize: resultPageSize || pageSize,
        totalPages
      }
    };
  }

  const baseErrorMsg = `Error occurred while fetching adoptable animals`;
  const moreDetails = errorMsg ? `: ${errorMsg}` : '';
  console.error(`${baseErrorMsg}${moreDetails}`);
  throw new HttpResponseError(500, baseErrorMsg);
}
