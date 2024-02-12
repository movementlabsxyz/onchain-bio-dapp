import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { useRef, useState, useEffect } from "react";
import { useWallet, InputTransactionData } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { ONCHAIN_BIO } from "./constants";
import './index.css';

// with custom configuration
const aptosConfig = new AptosConfig({ network: Network.CUSTOM });
const aptos = new Aptos(aptosConfig);

function App() {
  const { signAndSubmitTransaction, account } = useWallet();
  const name = useRef<HTMLInputElement>(null);
  const bio = useRef<HTMLTextAreaElement>(null);

  const [accountHasBio, setAccountHasBio] = useState(false);
  const [currentName, setCurrentName] = useState(null);
  const [currentBio, setCurrentBio] = useState(null);

  const fetchBio = async () => {
    if (!account) {
      console.log("No account")
      return [];
    }
  
    try {
      const bioResource = await aptos.getAccountResource(
        {
          accountAddress:account?.address,
          resourceType:`${ONCHAIN_BIO}::onchain_bio::Bio`
        }
      );
      console.log("Name:", bioResource.name, "Bio:", bioResource.bio);
      setAccountHasBio(true);
      if (bioResource) {
        setCurrentName(bioResource.name);
        setCurrentBio(bioResource.bio);
      } else {
        console.log("no bio")
      }
    } catch (e: any) {
      setAccountHasBio(false);
    }
  };

  async function registerBio() {
    if (bio.current !== null && name.current !== null) { 
      const onchainName = name.current.value;
      const onchainBio = bio.current.value;
      const transaction: InputTransactionData = {
        data: {
          function:`${ONCHAIN_BIO}::onchain_bio::register`,
          functionArguments:[onchainName, onchainBio]
        }
      }
      try {
        // sign and submit transaction to chain
        const response = await signAndSubmitTransaction(transaction);
        // wait for transaction
        console.log(`Success! View your transaction at https://explorer.aptoslabs.com/txn/${response.hash}`)
        await aptos.waitForTransaction({transactionHash:response.hash});
        fetchBio();
      } catch (error: any) {
        console.log("Error:", error)
      }
    }
  }

  return (
    <>
      <div className="navbar">
        <div className="navbar-text">Your Onchain Bio</div>
        <div>
          <WalletSelector />
        </div>
      </div>
      <div className="center-container">
        
        <div className="row">
          <h1>You Onchain Bio</h1>
        </div>

        <div className="row">
          <h3>Your name:</h3>
        </div>
        <div className="row">
          <input ref={name} type="text" className="name" placeholder="Enter your name"/>
        </div>

        <div className="row">
          <h3>Your Bio:</h3>
        </div>
        <div className="row">
          <textarea ref={bio} className="bio" placeholder="Your onchain bio"
          />
        </div>

        <div className="row">
          <button onClick={registerBio}>Register Bio</button>
        </div>

        <div className="row">
          <button onClick={fetchBio}>Fetch Bio</button>
        </div>


        <div className="row">
          <center>
            <h3>Your Name:</h3>
            <p>{currentName}</p>
          </center>
        </div>

        <div className="row">
          <center>
            <h3>Your Bio:</h3>
            <p>{currentBio}</p>
          </center>
        </div>

      </div>
    </>
  );
}

export default App;
