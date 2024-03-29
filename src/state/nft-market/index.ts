import { TransactionResponse } from "@ethersproject/abstract-provider";
import { Contract, Transaction } from "ethers";
import { CreationValues } from "modules/CreationPage/CreationForm";
import NFT_MARKET from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import useSigner from "state/signers";

const NFT_MARKET_ADDRESS = process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS as string;

const useNFTMarket = () => {
  const { signer } = useSigner();

  const nftMarket = new Contract(NFT_MARKET_ADDRESS, NFT_MARKET.abi, signer);

  const createNFT = async (values: CreationValues) => {
    try {
      const data = new FormData();
      data.append("name", values.name);
      data.append("description", values.description);
      data.append("image", values.image!);

      const response = await fetch("/api/nft-storage", {
        method: "POST",
        body: data,
      });

      if (response.status == 201) {
        const json = await response.json();
        const transaction: TransactionResponse = await nftMarket.createNFT(
          json.uri
        );
        await transaction.wait();
      }
    } catch (e) {
      console.log(e);
    }
  };
  return { createNFT };
};

export default useNFTMarket;
