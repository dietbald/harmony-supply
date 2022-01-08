# Harmony mainnet faucet server/frontend

App available at https://harmony.supply 

built upon: [polygon-faucet](https://github.com/TamtamHero/polygon-faucet) 

supports ONE transfers on Harmony mainnet

- payout frequency: 8 hours
- max amount on account to be able to claim: 0.005 ONE 
- Runway 30 days (goal 365 days) 

![screenshot](screen.png)

# installing

```
$ git clone https://github.com/dietbald/harmony-supply.git
$ cd harmony-supply && cd frontend && npm install
$ cd ..
```

## Configuring the faucet API

Faucet API is deployed on AWS lambda, to be added later.

Start your faucet:

```
node index.js
```

## Configuring the faucet frontend

edit the file `client/src/config.js` and specify the base URL for your API. Run `npm run start`

# API

## Endpoints

### ```GET https://<FAUCET-URL>/api```

POST data : 
{ address: "0x....", captcha: "captcha solving code" }

- #### Harmony address
your Harmony address in hex 

#### Response format
Status code: 200
```
{ 
	hash: 0x2323... 
}
```
Status code: 500
```
{
	err: {
		...
	}
}
```
* `hash` transaction hash 


## HTTP Return / error codes

* `200` : Request OK
* `500` : error (greylisted/ tx error)
