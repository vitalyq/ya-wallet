# Wallet App

## Install

```
git clone https://github.com/vitalyq/ya-wallet.git
cd ya-wallet
npm install
```

MongoDB instance is required to run the app. Load the sample data:

```
mongoimport --db wallet --file setup/db/cards.json --jsonArray
mongoimport --db wallet --file setup/db/transactions.json --jsonArray
```

Run the app in production:

```
npm run build
npm start
```

## Develop

Run the server:

```
npm run dev
```

When developing API it might be useful to disable Webpack build:

```
npm run dev:api
```
