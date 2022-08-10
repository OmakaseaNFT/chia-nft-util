const {RPCAgent, getDaemon} = require("chia-agent");
const {nft_mint_nft} = require("chia-agent/api/rpc");
const {on_state_changed_of_wallet} = require("chia-agent/api/ws");

const {
  WALLET_ID,
  WALLET_FINGERPRINT,
  TARGET_ADDRESS,
  ROYALTY_ADDRESS,
  ROYALTY_VALUE,
  TOTAL_SUPPLY,
  CREATE_FEE
} = require("./utils/constants")

const {
  getMetadataHash,
  getImageHash,
  constructURI,
  getCids,
  getFilenames,
  delay
} = require("./utils/utils")

const {
  login
} = require("./utils/rpcCalls")


// set to 1 if your collection starts at 0
let CURRENT_INDEX = 1

const agent = new RPCAgent({
  service: "wallet",
});

const daemon = getDaemon();

async function createNFT({
  imageURI,
  metadataURI,
  imageFilename,
  metadataFilename
}) {
  
  const imageHash = await getImageHash(imageFilename)
  const metadataHash = await getMetadataHash(metadataFilename)
  
  const params = {
    wallet_id: WALLET_ID,
    uris: [imageURI],
    hash: imageHash,
    meta_uris: [metadataURI],
    meta_hash: metadataHash,
    license_uris: ["https://raw.githubusercontent.com/Chia-Network/chia-blockchain/main/LICENSE"],
    license_hash: "30a358857da6b49f57cfe819c1ca43bfe007f528eb784df5da5cb64577e0ffc6",
    royalty_address: ROYALTY_ADDRESS,
    royalty_percentage: ROYALTY_VALUE,
    target_address: TARGET_ADDRESS,
    fee: CREATE_FEE
  }

  const result = await nft_mint_nft(agent, params)
  console.log(result)
  console.log("\n ------------------------------------------- \n")
}

async function bulkCreate() {
  const {
    imgCids,
    metadataCids
  } = await getCids()

  const {
    imageFilenames,
    metadataFilenames
  } = await getFilenames()

  await daemon.connect()
  await login(WALLET_FINGERPRINT)
  
  await createNFT({
    imageURI: constructURI(imgCids[CURRENT_INDEX - 1]),
    metadataURI: constructURI(metadataCids[CURRENT_INDEX - 1]),
    imageFilename: imageFilenames[CURRENT_INDEX - 1],
    metadataFilename: metadataFilenames[CURRENT_INDEX - 1]
  })

  await on_state_changed_of_wallet(daemon, async(event) => {
    if (
      event.data.state === "nft_coin_added" &&
      event.data.success
      ) {
      // exit if all NFTs minted
      if (CURRENT_INDEX === TOTAL_SUPPLY) {
        console.log("All NFTs Minted!")
        process.exit()
      }
      console.log("PREVIOUS INDEX MINTED: ", CURRENT_INDEX - 1)
      console.log("CURRENT PENDING INDEX: ", CURRENT_INDEX)

      // can experiment with this... sometimes the wallet client hasn't fully caught up even
      // after an event was fired
      await delay(6000)
      await createNFT({
        imageURI: constructURI(imgCids[CURRENT_INDEX]),
        metadataURI: constructURI(metadataCids[CURRENT_INDEX]),
        imageFilename: imageFilenames[CURRENT_INDEX],
        metadataFilename: metadataFilenames[CURRENT_INDEX]
      })
      CURRENT_INDEX += 1
    }
  
  });
}

bulkCreate()