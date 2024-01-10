# Decentralized Escrow Application

This is an Escrow Dapp adapted from [escrow-hardhat](https://github.com/alchemyplatform/escrow-hardhat) built with [Hardhat](https://hardhat.org/) and setup to run on the Georli Testnet.

## Project Layout

There are three top-level folders:

1. `/app` - contains the front-end application
2. `/contracts` - contains the solidity contract
3. `/tests` - contains tests for the solidity contract

## Setup

Install dependencies in the top-level directory with `npm install`.

After you have installed hardhat locally, you can use commands to test and compile the contracts, among other things. To learn more about these commands run `npx hardhat help`.

Compile the contracts using `npx hardhat compile`. The artifacts will be placed in the `/app` folder, which will make it available to the front-end. This path configuration can be found in the `hardhat.config.js` file.

Run `npx hardhat run scripts/deploy.js --network goerli` to deploy the escrow store contract to the Georli testnet(take note of the contract address)

## Front-End

`cd` into the `/app` directory and run `npm install`

create a `.env` file with a single variable `REACT_APP_ESCROWSTORE` set to the contract address you noted above.

To run the front-end application run `npm start` from the `/app` directory. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

