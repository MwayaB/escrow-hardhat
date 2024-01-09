import { ethers } from 'ethers';
import Escrow from './artifacts/contracts/Escrow.sol/Escrow';
import EscrowStore from './artifacts/contracts/EscrowStore.sol/EscrowStore';

export default async function deploy(signer, arbiter, beneficiary, value) {
  const escrowfactory = new ethers.ContractFactory(
    Escrow.abi,
    Escrow.bytecode,
    signer
  );

  const escrowStoreAddress = process.env.REACT_APP_ESCROWSTORE;
  const escrowStoreContract = new ethers.Contract(escrowStoreAddress, EscrowStore.abi, signer);

  const deployerAddress = await signer.getAddress();
  const transactionCount = await signer.getTransactionCount();

  // gets the address of the token before it is deployed
  const futureAddress = ethers.utils.getContractAddress({
    from: deployerAddress,
    nonce: transactionCount + 1
  });

  const tx = await escrowStoreContract.createEscrow(futureAddress); 
  const receipt = await tx.wait();

  const event = receipt.events.find(x => x.event === 'EscrowCreated');
  const { id, depositor, escrowAddress } = event.args;

  console.log(`EscrowId: ${id}, Depositor Address: ${depositor}, Escrow Contract Address: ${escrowAddress}`);

  const amount = ethers.utils.parseEther(value, "Ether");
  return escrowfactory.deploy(arbiter, beneficiary, { value: amount });
}
