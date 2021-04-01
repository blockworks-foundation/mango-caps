import prisma from '../../../lib/prisma'

// PUT /api/order/:id
// Required fields in body: txHash
export default async function handle(req, res) {
  const orderId = req.query.id;
  const { txHash } = req.body;
  const post = await prisma.orders.update({
    where: { id: Number(orderId) },
    data: { txHash },
  });
  res.json(post);
}
