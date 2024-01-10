import { ethers } from 'ethers';

export default function Escrow({ escrows, handleApprove }) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  return (
    <div className="existing-contract">
      {escrows.map((escrow, index) => (
        <ul key={index} className="fields">
          <li>
            <div> Arbiter </div>
            <div> {escrow.arbiter} </div>
          </li>
          <li>
            <div> Beneficiary </div>
            <div> {escrow.beneficiary} </div>
          </li>
          <li>
            <div> Value </div>
            <div> {escrow.value} Wei </div>
          </li>
          <div
            className="button"
            id={escrow.escrowAddress}
            onClick={(e) => {
              e.preventDefault();
              handleApprove(escrow.escrowAddress, signer);
            }}
          >
            Approve
          </div>
        </ul>
      ))}
    </div>
  );
}
