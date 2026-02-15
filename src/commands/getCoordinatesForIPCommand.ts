import { axiosGeoapifyClient } from '../utils/axiosClient';
import config from '../config/config';
import { getFromCache, addToCache } from '../utils/cacheClient';
import { isPublicIPv4Command } from './isPublicIPv4Command';
import * as z from 'zod';

const coordinatesValidator = z.object({
  city: z.object({
    name: z.string().min(1, 'City not provided')
  }),
  location: z.object({
    latitude: z
      .number()
      .min(-90)
      .max(90, 'Latitude must be between -90 and 90'),
    longitude: z
      .number()
      .min(-180)
      .max(180, 'Longitude must be between -180 and 180')
  })
});

type CoordinatesSchema = z.infer<typeof coordinatesValidator>;

export default async function (
  ipAddress: string
): Promise<CoordinatesSchema | null> {
  try {
    // Geoapify doesn't support IP geolocation for localhost, return default location
    if (config.NODE_ENV === 'development') {
      return {
        city: { name: 'Dallas' },
        location: {
          latitude: 32.4963584,
          longitude: -96.8884422
        }
      };
    }

    // Geoapify IP geolocation doesn't work with certain IP addresses
    if (!isPublicIPv4Command(ipAddress)) {
      console.log('not a public IPv4 address, skipping geolocation');
      return null;
    }

    const cacheKey = `coordsForIP:${ipAddress}`;
    const cachedCoords = await getFromCache<CoordinatesSchema>(
      cacheKey,
      coordinatesValidator
    );

    if (cachedCoords) return cachedCoords;

    const locationData = await axiosGeoapifyClient.get(
      config.GEOAPIFY_IP_GEOLOCATION_API_URL_PATH,
      { params: { ip: ipAddress } }
    );
    console.log('axios response:');
    console.log({ ...locationData });
    const { success, error, data } = coordinatesValidator.safeParse(
      locationData.data
    );

    if (!success) {
      throw new Error(error.issues.map((i) => i.message).join('\n'));
    }

    await addToCache(cacheKey, data);
    return data;
  } catch (error) {
    console.log('full err0r:');
    console.log(error);
    console.error(
      `Error fetching coordinates for IP address ${ipAddress}: ${
        (error as Error).message
      }`
    );
    return null;
  }
}
