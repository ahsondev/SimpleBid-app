import SimpleBidABI from 'contracts/abi.json';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

let web3: any;
export const contractAddress = "0xAFd335F5B92Be72DFFFad6afb4eaf0bAc32856C6";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.REACT_APP_INFURA_ID,
    },
  },
};

const web3Modal = new Web3Modal({
  network: 'mainnet', // optional
  cacheProvider: false, // optional
  providerOptions, // required
});

export const connectToWallet = async () => {
  try {
    // await onboard.walletSelect();
    // await onboard.walletCheck();

    const provider = await web3Modal.connect();
    web3 = new Web3(provider);
    const contract = new web3.eth.Contract(
      SimpleBidABI,
      contractAddress
    );
    return { web3, contract };
  } catch (switchError) {
    console.log(switchError);
  }

  return null;
};

export const getEthBalance = (addr: string) =>
  new Promise((resolve: (val: number) => void, reject: any) => {
    web3.eth.getBalance(addr).then(
      (_balance: any) => {
        const balance = web3.utils.fromWei(_balance, 'ether');
        resolve(balance);
      },
      (err: any) => {}
    );
  });
