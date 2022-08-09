## Chia NFT Tool

This simple NodeJS tool accomplishes 4 tasks:

1) Create Individual NFTs using RPC calls
2) Bulk create NFTs using RPC calls (slow, ~75 seconds per NFT, but reliable)
3) Create Offers for NFTs
4) Bulk create offers for NFTs

Works with IPFS out of the box, must have images and metadata CIDs ready.

Powered by (Chia Agent)[https://github.com/Chia-Mine/chia-agent/blob/main/src/api/README.md]

-------------------------------------------------------------

### Get Started

Install deps
```
yarn
```

Set Constants in `utils/constants.js`

```
  WALLET_ID             // Chia wallet ID
  WALLET_FINGERPRINT    // Chia key fingerprint, used to login
  TARGET_ADDRESS        // XCH address to receive NFT
  ROYALTY_ADDRESS       // XCH address to receive Royalties
  ROYALTY_VALUE         // Royalty value - 10,000 = 100%
  TOTAL_SUPPLY          // Amount of NFTs to mint
  CREATE_FEE            // Fee paid to farmers. Test between 600000000 and 800000000 Mojos
```

Set `CURRENT_INDEX` in `createNFTs.js`

Modify `metadataCids.json` & `imgCids.json` to include IPFS CIDS.
Populate `/json` & `/images` with JSON metadata and images. Use sequential naming convention.

Make sure you have a Chia wallet and node running.

Create NFTs

```
node createNFTs.js
```

Create offers, outputs offer files to `/offers`

```
node createOffers.js
```

Feel free to raise an issue if something is broken!

Made for [Cacti](https://omakasea.com/cacti)
Made by ET at [Omakasea](https://twitter.com/Omakasea_) [Website](https://omakasea.com/)
