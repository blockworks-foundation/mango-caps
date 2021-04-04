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

## Setup the NFT

```bash
spl-token create-token --decimals 0
# Creating token AEJKAaYxP1wY41nr6ZXRQChCLnKRvQG7ae8TEPTCQ4U8
spl-token create-account AEJKAaYxP1wY41nr6ZXRQChCLnKRvQG7ae8TEPTCQ4U8
spl-token mint AEJKAaYxP1wY41nr6ZXRQChCLnKRvQG7ae8TEPTCQ4U8 500
```


## Migrate DB

```bash
npx prisma db push  --preview-feature
```
