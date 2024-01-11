# BLOX Meta Protocol on PIPE

This module is in the experimental phase, use it with caution. No modifications to the core of the PIPE indexer have been made. Blox sits as an additional validation layer on top of the PIPE protocol indexing, allowing for additional validations/indexing on the data. Additional data is stored in a separate database, and no data from the PIPE indexer is altered, thus respecting the [PIPE protocol specifications](https://github.com/BennyTheDev/pipe-specs).

## How it Works

With Blox on PIPE, there are only three elements that really matter in a token for indexing and validation: the ticker, the MAX of the token, and its decimals (the ID is already managed by PIPE).

Identification data is primarily stored in the token's ticker, and its supply consists of tokenized data from the blockchain. The decimal can be used as a validation element to standardize tokens for their use.

**Example with PIPEBLOCK:**

**TICKER:** BLOXPA

- **BLOX:** Protocol header, a pre-filter to identify tokens from the protocol to verify.
- **P:** Validation/indexing method to use; in this case, P represents PIPEBLOCK.
- **A:** Data encoded according to the method used; for Pipeblock, in base 26, A=0, Z=25, which gives the block number 0.

**MAX:** 141
**DEC:** 8

The supply represents the tokenized data of method P for our token. In our case, the vbytes for block 0 must be strictly equal to the rounded sum of the vbytes of the transactions contained in the block, or they will be ignored. PIPEBLOCK uses 8 decimals; any other number will be ignored by the indexer.

The PIPEBLOCK method indexes the transaction history on the PIPE protocol per block and adds up the transaction sizes to use them as tokens. Blocks with 0 transactions arbitrarily have 1 vbyte in supply. Any user can later use this data to claim ownership of this pipeblock by minting it.   

For a Pipeblock to be claimed, it must have a correctly encoded ticker, a correct supply representing the vbytes of the respective pipeblock, and 8 decimals. Whether it is minted as PIPE Art or pure token does not matter. During the first mint, Pipe Art was used to save on transaction fees.   

A PIPEBLOCK belongs entirely to the holder only if they hold all the vbytes. It is only indexable at block + 1.   

Only one validation/indexing method running per indexer.

## Installation

To use the indexer, a few prerequisites are necessary:

- A synchronized Bitcoin node with txindex=1, [tutorial for Windows](https://github.com/SonOfLiberty-99/pipewallet_setup)
- A recent version of [NodeJS](https://nodejs.org/en/download) installed
- [MongoDB](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/#procedure) installed
- [MongoDB Compass](https://www.mongodb.com/try/download/compass) (optional for viewing data)

Start by downloading the [source code](https://github.com/PIPELINE-BTC/Blox-on-PIPE/archive/refs/heads/master.zip) and unzipping it. Open the config file in the config folder of the indexer and specify the path to your Bitcoin-cli.

Then, open a command terminal at the root of the folder, and type the following command:

```bash
npm install
```

This command will install the necessary dependencies to make the indexer work.

That's it! If everything is in order, you just need to launch the PIPE indexer as you normally would, and it will also launch Blox. Check out this [tutorial](https://github.com/SonOfLiberty-99/pipewallet_setup) for more details on how to launch the PIPE indexer.

With MongoDB Compass, you can view the data by connecting to 127.0.0.1.

You also have a [basic example](https://github.com/PIPELINE-BTC/Blox-on-PIPE/tree/master/example/pipeblock_minter) for claiming a PIPEBLOCK in the source code.

If you want to use this module on an existing PIPE indexer, you still need to use the provided PIPE.mjs file in the source code.

## Viewing Data with MongoDB Compass?

Once you have a functional indexer, you can view the indexing of data in real-time via MongoDB Compass or any other tools supporting MongoDB.

Assuming you have already installed MongoDB Compass, once launched, you need to configure your connection locally with the following URI:

```
mongodb://localhost:27017
```

Connect using this link, and if all goes well, you will be redirected to the database. Then click on Blox -> pipeblock, and you are now ready to conduct searches in the pipeblock data. Here are some useful queries below to put in the "Filter" field.

Display only unclaimed pipeblocks:
```
{type:'b', t:{$exists:false}}
```

Display only pipeblocks that have already been minted:
```
{type:'b', t:{$exists:true}}
```

Display all pipeblocks without exception:
```
{type:'b'}
```

Display all the details, including transactions of a pipeblock, replace NUMBER with the pipeblock number:
```
{b:NUMBER}
```

