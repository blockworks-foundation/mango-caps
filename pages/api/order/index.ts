import prisma from '../../../lib/prisma'

// POST /api/order
// Required fields in body: address, style
export default async function handle(req, res) {
  const { address, style } = req.body;

  const result = await prisma.orders.create({
    data: {
      address,
      style,
    },
  });
  res.json(result);
}
