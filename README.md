This is the deployed version of initialcapoffering.com

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Create a local `.env` file that sets `DATABASE_URL=` with the heroku
postgres url: https://dashboard.heroku.com/apps/mango-caps/resources

```bash
yarn # install dependencies
npx prisma generate # generate DB client code
yarn dev # launch dev server
npx prisma studio # launch DB admin panel
```

## Setup the Token

```bash
spl-token create-token --decimals 0
# Creating token 2prC8tcVsXwVJAinhxd2zeMeWMWaVyzPoQeLKyDZRFKd
spl-token create-account 2prC8tcVsXwVJAinhxd2zeMeWMWaVyzPoQeLKyDZRFKd
spl-token mint 2prC8tcVsXwVJAinhxd2zeMeWMWaVyzPoQeLKyDZRFKd 500
spl-token authorize 2prC8tcVsXwVJAinhxd2zeMeWMWaVyzPoQeLKyDZRFKd mint --disable
```

## Migrate DB

```bash
npx prisma db push  --preview-feature
```
