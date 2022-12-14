import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [numberOfWhitelisted,setNumOfWhitelisted] = useState(0);
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();   

  const getProviderOrSigner = async (needSigner=false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const addAddressToWhiteList = async() =>{
    try{
      const signer = await getProviderOrSigner(true);
      const whiteListContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const tx = whiteListContract.permitting();
      setLoading(true);

      await tx.wait();
      setLoading(false);

      await getNumberOfWhiteListed();
      setJoinedWhitelist(true)
    }catch(err){
      console.error(err)
    }
  }

  const checkIfAddressIsWhiteListed = async () => {
    try{
      const signer = await getProviderOrSigner(true);
      const whiteListContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,abi,signer
      );

      const address = await signer.getAddress();
      const _joinedWhiteList = await whiteListContract.permitting(address);
      setJoinedWhitelist(_joinedWhiteList);
    }catch(e){
      console.error(e);
    }
  }

  const getNumberOfWhiteListed = async () => {
    try{
      const provider = await getProviderOrSigner();
      const whiteListContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      )

      const _numberofWhiteListed = await whiteListContract.numAddressesWhitelisted();
    setNumOfWhitelisted(_numberofWhiteListed);
    }catch(err){
      console.error(err);
    }
  }

  const connectWallet = async() => {
    try{
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressIsWhiteListed();
      getNumberOfWhiteListed();
    }catch(e){
      console.error(e)
    }
  }

  const renderButton = () => {
    if (walletConnected){
      if (joinedWhitelist){
        return (
          <div className={styles.description}>
            Thanks for joining the Whitelist!
          </div>
        )
      }else if (loading){
        return <button className={styles.button}>Loading...</button>
      }else{
        return(
          <button onClick={addAddressToWhiteList} className={styles.button}>
            JOIN THE WHITELIST
          </button>
        );
      }
    }else{
      return(
        <button onClick = {connectWallet} className = {styles.button}>
          Connect to Wallet
        </button>
      )
    }
  }

  useEffect(() => {
    if (!walletConnected){
      web3ModalRef.current = new Web3Modal({
        network:"goerli",
        providerOptions: {},
        disableInjectedProvider:false,
      });
      connectWallet();
    }
  },[walletConnected]);

  return (
    <div>
      <Head>
        <title>
          Whitelist dApp
        </title>
      </Head>
      <>
      <div className={styles.main}>
        <div className={styles.Heading}>
          <h1 className={styles.title}>CRYPTO ATTIC</h1>
          <p className={styles.description}><span className={styles.WHITE}>_0x416B68696C_</span> INVITES YOU</p>
        </div>
        <div className={styles.description1}>
            Its an NFT collection for developers in Crypto.
        </div>
        <div className={styles.description2}>
            <span className={styles.WHITE}>{numberOfWhitelisted}</span> have already joined the <span className={styles.WHITE}>WHITELIST</span>
        </div>
          {renderButton()}
        </div>
      
      <div className={styles.biggestCircle}></div>
      <div className={styles.smallCircle1}></div>
      <div className={styles.smallCircle2}></div>
      </>
    </div>
    
  );
}