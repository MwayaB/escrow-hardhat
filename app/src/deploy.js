import { ethers } from 'ethers';
import Escrow from './artifacts/contracts/Escrow.sol/Escrow';

export default async function deploy(signer, arbiter, beneficiary, value) {
  const factory = new ethers.ContractFactory(
    Escrow.abi,
    Escrow.bytecode,
    signer
  );

  const amount = ethers.utils.parseEther(value, "Ether");
  return factory.deploy(arbiter, beneficiary, { value: amount });
}
