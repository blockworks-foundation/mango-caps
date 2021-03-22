This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



## Setup the NFT

```bash
spl-token create-token --decimals 0
# Creating token AEJKAaYxP1wY41nr6ZXRQChCLnKRvQG7ae8TEPTCQ4U8
spl-token create-account AEJKAaYxP1wY41nr6ZXRQChCLnKRvQG7ae8TEPTCQ4U8
spl-token mint AEJKAaYxP1wY41nr6ZXRQChCLnKRvQG7ae8TEPTCQ4U8 500
```


