import { axiosGeoapifyClient } from '../utils/axiosClient';
import config from '../config/config';
import { cache } from '../utils/cacheClient';
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
    const cacheKey = `coordsForIP:${ipAddress}`;
    const cachedCoords = await cache.get<CoordinatesSchema>(cacheKey);

    if (cachedCoords) return cachedCoords;

    const locationData = await axiosGeoapifyClient.get(
      config.GEOAPIFY_IP_GEOLOCATION_API_URL_PATH,
      { params: { ip: ipAddress } }
    );

    const { success, error, data } =
      coordinatesValidator.safeParse(locationData);

    if (!success) {
      throw new Error(error.issues.map((issue) => issue.message).join('\n'));
    }

    await cache.set<CoordinatesSchema>(cacheKey, data, { ex: 86400 }); //24 hrs
    return data;
  } catch (error) {
    console.error(
      `Error fetching coordinates for IP address ${ipAddress}: ${(error as Error).message}`
    );
    return null;
  }
}
