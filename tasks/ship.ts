import * as csv from "fast-csv"
import * as fs from "fs"
import prisma from "../lib/prisma"

async function ship(filePath: string, cb?: any) {
  const allOpenOrders = await prisma.orders.findMany({
    where: { fullfilled: false }
  });
  const allValidOrders = allOpenOrders.filter(o => !!o.txHash);

  csv.writeToPath(filePath, allValidOrders)
    .on('error', (err) => console.error(err))
    .on('finish', () => {
      console.log('write shipping info to', filePath);
      process.exit();
    });
}
ship('out.csv', () => process.exit());
