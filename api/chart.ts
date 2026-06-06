import type { VercelRequest, VercelResponse } from '@vercel/node';
import { planetsHouses } from '../lib/houses';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { jd, lat, lon } = req.query;

  const time = typeof jd === 'number' ? new Date(jd) : new Date();

  const housesData = planetsHouses.getData(time);

  res.json(housesData);
}
