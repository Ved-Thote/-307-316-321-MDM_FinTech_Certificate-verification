import React, { useState } from 'react'
import { ethers } from 'ethers'
import CertificateRegistryAbi from '../abi/CertificateRegistry.json'

const CONTRACT_ADDRESS = "<REPLACE_WITH_DEPLOYED_ADDRESS>"

export default function IssueCertificate(){
  const [recipient, setRecipient] = useState('')
  const [cid, setCid] = useState('')
  const [txHash, setTxHash] = useState('')

  async function handleIssue(e){
    e.preventDefault()
    if (!window.ethereum) return alert('Install MetaMask')
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CertificateRegistryAbi, signer)

    const certificateId = ethers.keccak256(ethers.toUtf8Bytes(recipient + cid + Date.now().toString()))

    const tx = await contract.issueCertificate(certificateId, recipient || ethers.ZeroAddress, cid)
    setTxHash(tx.hash)
    await tx.wait()
    alert('Issued: ' + certificateId)
  }

  return (
    <div className="card">
      <h2>Issue Certificate</h2>
      <form onSubmit={handleIssue}>
        <label>Recipient address (optional)</label>
        <input value={recipient} onChange={e=>setRecipient(e.target.value)} placeholder="0x..." />
        <label>CID / Metadata link</label>
        <input value={cid} onChange={e=>setCid(e.target.value)} placeholder="IPFS CID or JSON URL" />
        <button type="submit">Issue</button>
      </form>
      {txHash && <p>Tx: {txHash}</p>}
    </div>
  )
}
