const fs = require("fs").promises
const crypto = require("crypto")
const path = require("path")

function getHash(input) {
  const hash = crypto.createHash('sha256').update(input).digest('hex');
  return hash
}

async function getMetadataHash(filename) {
  const metadata = await fs.readFile(path.join(__dirname, "../metadata", `${filename}`))
  // metadata must not contain any spaces
  const metadataHash = getHash(JSON.stringify(JSON.parse(metadata), null, 0))
  return metadataHash
}

async function getImageHash(filename) {
  const image = await fs.readFile(path.join(__dirname, "../images", `${filename}`))
  const imageHash = getHash(image)
  return imageHash
}

function constructURI(cid) {
  return `https://ipfs.io/ipfs/${cid}`
}

async function getCids() {
  const img = await fs.readFile(path.join(__dirname, "../imgCids.json"))
  const metadata = await fs.readFile(path.join(__dirname, "../metadataCids.json"))
  const imgCids = JSON.parse(img)
  const metadataCids = JSON.parse(metadata)

  return {
    imgCids,
    metadataCids
  }
}

async function getFilenames() {
  const images = await fs.readdir(path.join(__dirname, "../images"))
  const metadata = await fs.readdir(path.join(__dirname, "../metadata"))

  const metadataFilenames = metadata.sort((a, b) => {
    const aNumber = a.split(".")[0]
    const bNumber = b.split(".")[0]
    return aNumber - bNumber
  })

  const imageFilenames = images.sort((a, b) => {
    const aNumber = a.split(".")[0]
    const bNumber = b.split(".")[0]
    return aNumber - bNumber
  })
  return {
    imageFilenames,
    metadataFilenames
  }  
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  getHash,
  getMetadataHash,
  getImageHash,
  constructURI,
  getCids,
  getFilenames,
  delay
}