const { getNFTs } = require("./utils/rpcCalls")
const { RPCAgent } = require("chia-agent");
const { create_offer_for_ids } = require("chia-agent/api/rpc");
const fs = require("fs").promises
const path = require("path")

const {
  WALLET_ID,
  WALLET_FINGERPRINT,
  OFFER_AMOUNT_MOJOS,
  OFFER_IGNORE_LIST
} = require("./utils/constants")

const {
  login
} = require("./utils/rpcCalls")

const agent = new RPCAgent({
  service: "wallet",
});

async function createOffer(launcherID, index) {
  const params = {
    offer: {
      // assumes 1 is ID for XCH wallet
      "1": OFFER_AMOUNT_MOJOS,
      // launcher coin ID
      [launcherID]: -1
    },
    // only need a fee to expedite offer acceptance, not absolutely necessary
    // fee: 50000000,
  }
  const result = await create_offer_for_ids(agent, params)
  await fs.writeFile(path.join(__dirname, "offers", `offer_${index}.offer`), result.offer)
  return result
}

async function bulkCreateOffers() {
  await login(WALLET_FINGERPRINT)

  const nfts = await getNFTs(WALLET_ID)
  const nftsLength = nfts.nft_list.length
  
  const offerDir = await fs.readdir(path.join(__dirname, "offers"))
  const maxOfferIndex = offerDir.length - 1

  for (let i=maxOfferIndex + 1; i<nftsLength; i++) {
    const launcherID = nfts.nft_list[i].launcher_id
    if (launcherID in OFFER_IGNORE_LIST) continue
    await createOffer(launcherID, i)
  }
}

bulkCreateOffers()