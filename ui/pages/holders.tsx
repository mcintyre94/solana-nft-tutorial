import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useEffect } from "react"
import { COLLECTION_MINT_ADDRESS } from "../lib/constants"

export default function Holders() {
  const { connection } = useConnection()
  const wallet = useWallet()

  const metaplex = Metaplex
    .make(connection)
    .use(walletAdapterIdentity(wallet))

  const nfts = metaplex.nfts()

  async function getUserNfts() {
    if (!wallet.publicKey) return

    // Fetch all the user's NFTs
    const userNfts = await nfts
      .findAllByOwner({ owner: wallet.publicKey })

    // Filter to our collection
    const ourCollectionNfts = userNfts.filter(
      metadata =>
        metadata.collection !== null &&
        metadata.collection.verified &&
        metadata.collection.address.toBase58() === COLLECTION_MINT_ADDRESS.toBase58()
    )

    console.log("Got their NFTs!", ourCollectionNfts)
  }

  useEffect(() => {
    getUserNfts()
  }, [wallet.publicKey])


  return (
    <p className="text-lg text-white">Holders only! ☠️</p>
  )
}
