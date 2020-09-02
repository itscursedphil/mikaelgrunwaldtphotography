import { NextApiRequest, NextApiResponse } from 'next';

const helloApiRoute = (req: NextApiRequest, res: NextApiResponse): void => {
  res.statusCode = 200;
  res.json({ name: 'John Doe' });
};

export default helloApiRoute;
