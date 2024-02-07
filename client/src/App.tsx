import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { useRef } from "react";
import { useWallet, InputTransactionData } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { ONCHAIN_POEMS } from "./constants";
import './index.css';

// with custom configuration
const aptosConfig = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(aptosConfig);

function App() {
  const { account, signAndSubmitTransaction } = useWallet();
  const poemAuthor = useRef<HTMLInputElement>(null);
  const poemTitle = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  async function registerPoem() {
    if (textAreaRef.current !== null && poemAuthor.current !== null && poemTitle.current !== null) { 
      const author = poemAuthor.current.value;
      const title = poemTitle.current.value;
      const text = textAreaRef.current.value;
      const transaction: InputTransactionData = {
        data: {
          function:`${ONCHAIN_POEMS}::onchain_poems::register`,
          functionArguments:[text, title, author]
        }
      }
      try {
        // sign and submit transaction to chain
        const response = await signAndSubmitTransaction(transaction);
        // wait for transaction
        await aptos.waitForTransaction({transactionHash:response.hash});
      } catch (error: any) {
        console.log("Error:", error)
      }
    }
  }

  return (
    <>
      <div className="navbar">
        <div className="navbar-text">Create Aptos Dapp</div>
        <div>
          <WalletSelector />
        </div>
      </div>
      <div className="center-container">
      <div className="row">
          <h1>Poems that Move You</h1>
        </div>

        <div className="row">
          <h3>Poem author:</h3>
        </div>
        <div className="row">
          <input ref={poemAuthor} type="text" className="poemName" placeholder="Enter your / the author's name"/>
        </div>
        
        <div className="row">
          <h3>Poem title:</h3>
        </div>
        <div className="row">
          <input ref={poemTitle} type="text" className="poemName" placeholder="Name your masterpiece"/>
        </div>

        <div className="row">
          <h3>The poem:</h3>
        </div>
        <div className="row">
          <textarea ref={textAreaRef} className="poemContents" placeholder="Unleash your creativity"
          />
        </div>

        <div className="row">
          <button onClick={registerPoem}>Register Poem</button>
        </div>
      </div>
    </>
  );
}

export default App;
