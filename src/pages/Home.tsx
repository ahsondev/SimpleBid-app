import React, { useEffect, useState } from 'react';
import { connectToWallet, contractAddress } from "web3_api";
import Loader from "pages/Loader";

interface PropsType {}

function Home(props: PropsType) {
  const [web3, setWeb3] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [bidCount, setBidCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await connectToWallet();
        setWeb3(res?.web3);
        setContract(res?.contract);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const onTryBid = async () => {
    const wnd = window as any;
    setLoading(true);
    try {
      if (wnd.ethereum && contract) {
        console.log(web3.utils);
        const addr = wnd.ethereum.selectedAddress;
        const to = addr;
        const value = 1;

        const hashedPayload = web3.utils.soliditySha3(web3.utils.encodePacked(to, value));
        const paddedMessage = web3.utils.soliditySha3("\x19Ethereum Signed Message:\n32", hashedPayload);

        const sig = String(await web3.eth.sign(paddedMessage, addr)).slice(2);
        const r = `0x${sig.slice(0, 64)}`
        const s = `0x${sig.slice(64, 128)}`
        const v = web3.utils.toDecimal('0x' + sig.slice(128, 130)) 

        const tx = {
          from: addr,
          to: contractAddress,
          data: contract.methods.tryBid(addr, 1, r, s, v).encodeABI()
        };

        await web3.eth.sendTransaction(tx);
      } else {
        alert('Not connected');
      }
    } catch (e) {
      alert(e);
    }
    setLoading(false);
  }

  const onGetBid = async () => {
    setLoading(true);
    try {
      const wnd = window as any;
      if (wnd.ethereum && contract) {
        const ret = await contract.methods.bidsMap(wnd.ethereum.selectedAddress).call();
        setBidCount(ret);
      } else {
        alert('Not connected to metamask or contract');
      }
    } catch (e) {
      alert(e);
    }
    setLoading(false);
  }

  return (
    <div className='home-page'>
      <button type='button' onClick={onTryBid}>Try Bid</button>
      <button type='button' onClick={onGetBid}>Get Bid</button>
      <div>Bid count: {bidCount} </div>

      {loading && <Loader />}
    </div>
  )
}

export default Home;

