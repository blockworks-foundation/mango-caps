import prisma from '../../../lib/prisma'

// POST /api/order
// Required fields in body: address
export default async function handle(req, res) {
  const { address } = req.body;

  const result = await prisma.orders.create({
    data: {
      address,
    },
  });
  res.json(result);
}
