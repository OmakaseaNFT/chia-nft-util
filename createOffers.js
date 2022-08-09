const { getNFTs } = require("./utils/rpcCalls")
const { RPCAgent } = require("chia-agent");
const { create_offer_for_ids } = require("chia-agent/api/rpc");
const fs = require("fs").promises
const path = require("path")

const {
  WALLET_ID,
  WALLET_FINGERPRINT,
  OFFER_IGNORE_LIST
} = require("./utils/constants")

const {
  login
} = require("./utils/rpcCalls")

const agent = new RPCAgent({
  service: "wallet",
});

async function createOffer(launcherID) {
  const params = {
    offer: {
      "1": 500000000000,
      //launcher coin ID
      [launcherID]: -1
    },
    // fee: 50000000,
  }
  const result = await create_offer_for_ids(agent, params)
  await fs.writeFile(path.join(__dirname, "offers", `offer_${launcherID}.offer`), result.offer)
  return result
}

async function bulkCreateOffers() {
  await login(WALLET_FINGERPRINT)

  const nfts = await getNFTs(WALLET_ID)
  const nftsLength = nfts.nft_list.length
  for (let i=0; i<nftsLength; i++) {
    const launcherID = nfts.nft_list[i].launcher_id
    if (launcherID in OFFER_IGNORE_LIST) continue
    await createOffer(launcherID)
  }
}

bulkCreateOffers()