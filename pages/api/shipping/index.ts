import prisma from "../../../lib/prisma"

// POST /api/shipping
// Required fields in body: owner
export default async function handle(req, res) {
  const { owner } = req.body;

  if (owner) {
    const allOrders = await prisma.orders.findMany({
      where: { owner }
    });

    const result = allOrders.map(o => {
      const { id, style, fullfilled, createdAt, updatedAt } = o;
      return { id, style, fullfilled, createdAt, updatedAt };
    });

    console.log(result);
    res.json(result)
  } else {
    res.json([])
  }
}

