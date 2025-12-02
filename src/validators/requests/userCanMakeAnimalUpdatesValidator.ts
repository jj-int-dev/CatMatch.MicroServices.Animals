import type { Request, Response, NextFunction } from 'express';
import { supabase } from '../../utils/supabaseClient';

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers['authorization'] as string;
    const accessToken = authHeader.replace('Bearer ', '');
    const userId = req.params.userId!;

    const userData = await supabase.auth.getUser(accessToken);
    if (
      !userData.error &&
      userData.data?.user?.aud === 'authenticated' &&
      userData.data?.user?.id === userId
    ) {
      return next();
    }

    console.log(
      `The user ID from the request URL does not match the user ID derived from the access token.` +
        `\nUser ID from request URL: ${userId}\nAccess token from request headers: ${accessToken}` +
        `\nUser data derived from access token:\n${userData}`
    );
    return res
      .status(401)
      .json({ message: 'Insufficient access to make animal updates' });
  } catch (err) {
    console.log(`Error during animal update access check middleware: ${err}`);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
