# Wallet App

## Install

```
git clone https://github.com/vitalyq/ya-wallet.git
cd ya-wallet
npm install
```

To run the app in production:

```
npm run build
npm start
```

## Develop

Set up a database:

```
mongoimport --db wallet --file setup/db/cards.json --jsonArray
mongoimport --db wallet --file setup/db/transactions.json --jsonArray
```

Run the server:

```
npm run dev
```

When developing API it might be useful to disable Webpack build:

```
npm run dev:api
```
