import prisma from "../../../lib/prisma"

// POST /api/order
// Required fields in body: address, style
export default async function handle(req, res) {
  const result = await prisma.orders.create({
    data: req.body,
  })
  res.json(result)
}
