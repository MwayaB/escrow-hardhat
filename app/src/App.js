import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Escrow from './Escrow';
import EscrowContract from './artifacts/contracts/Escrow.sol/Escrow';
import EscrowStore from './artifacts/contracts/EscrowStore.sol/EscrowStore';
import deploy from './deploy';

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  useEffect(() => {

  const signer = provider.getSigner();
  const escrowStoreAddress = process.env.REACT_APP_ESCROWSTORE;
  const escrowStoreContract = new ethers.Contract(escrowStoreAddress, EscrowStore.abi, signer);

  async function getEscrowCount() {
    try {
      const escrowCount = await escrowStoreContract.escrowCount();
      return parseInt(escrowCount, 16);
    } catch (error) {
      console.error('Error retrieving escrow count:', error);
      return 0; // Return a default value or handle the error accordingly
    }
  }

  async function getEscrowDetails(id) {
    try {
      const escrowAddress = await escrowStoreContract.escrows(id);
      const escrowContract = new ethers.Contract(escrowAddress, EscrowContract.abi, signer);
      const [arbiter, beneficiary, balance] = await Promise.all([
        escrowContract.arbiter(),
        escrowContract.beneficiary(),
        provider.getBalance(escrowAddress),
      ]);
      const value = balance.toString();
      const escrowDetails = { escrowAddress, arbiter, beneficiary, value };
      return escrowDetails;
    } catch (error) {
      console.error('Error retrieving escrow details:', error);
      return null;
    }
  }

  async function getEscrows() {
    const totalEscrows = await getEscrowCount();
    console.log('Total Escrows:', totalEscrows);

    if(totalEscrows > 0){
    const escrowDetailsPromises = Array.from({ length: totalEscrows }, (_, i) => getEscrowDetails(i));

    const escrowDetailsArray = await Promise.all(escrowDetailsPromises);
    const filteredEscrows = escrowDetailsArray.filter(escrowDetails => escrowDetails && escrowDetails.value > 0)
    setEscrows(filteredEscrows);
  }
  }
  getEscrows();

}, [setEscrows]);


  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const value = document.getElementById('eth').value;
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);
    const amount = ethers.utils.parseEther(value, "Ether");

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: amount.toString(),
    };

    setEscrows([...escrows, escrow]);
  }

  async function handleApprove (escrowAddress, signer) {
    const contract = new ethers.Contract(escrowAddress, EscrowContract.abi, signer);;
    contract.on('Approved', () => {
      document.getElementById(escrowAddress).className =
        'complete';
      document.getElementById(escrowAddress).innerText =
        "✓ It's been approved!";
    });

    await approve(contract, signer);
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Eth)
          <input type="text" id="eth" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
        <Escrow escrows={escrows} handleApprove={handleApprove} />
        </div>
      </div>
    </>
  );
}

export default App;
