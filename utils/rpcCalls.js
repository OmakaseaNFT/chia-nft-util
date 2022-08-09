const {
  get_transactions,
  log_in,
  get_logged_in_fingerprint,
  delete_unconfirmed_transactions,
  get_all_offers,
  nft_get_nfts,
  nft_get_info
} = require("chia-agent/api/rpc/wallet");
const { RPCAgent } = require("chia-agent");
const agent = new RPCAgent({
  service: "wallet",
});

async function getTx(walletId) {
  const params = {wallet_id: walletId}
  const tx = await get_transactions(agent, params)
  console.log(tx)
}

async function getLoggedInFingerprint() {
  const finger = await get_logged_in_fingerprint(agent)
  console.log(finger)
}

async function login(fingerprint) {
  const params = { fingerprint }
  const finger = await log_in(agent, params)
  return finger
}

async function deleteUnconfirmedTx() {
  const params = {
    wallet_id: 3
  }
  const del = await delete_unconfirmed_transactions(agent, params)
  return del
}

async function getAllOffers() {
  const offers = await get_all_offers(agent)
  return offers
}
async function getNFTs(walletId) {
  const params = {
    wallet_id: walletId
  }
  const nfts = await nft_get_nfts(agent, params)
  console.log(nfts)
  return nfts
}

async function getNftInfo(coinId) {
  const params = {
    coin_id: coinId
  }
  const nftInfo = await nft_get_info(agent, params)
  return nftInfo
}

async function getOneNFT() {
  const nfts = await getNFTs()
  const nftInfo = await getNftInfo(nfts.nft_list[nfts.nft_list.length - 1].nft_coin_id)
  return nftInfo
}

module.exports = {
  getTx,
  getLoggedInFingerprint,
  login,
  deleteUnconfirmedTx,
  getAllOffers,
  getNFTs,
  getNftInfo,
  getOneNFT
}