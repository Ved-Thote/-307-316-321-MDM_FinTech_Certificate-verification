import React, { useState } from 'react'
import { ethers } from 'ethers'
import CertificateRegistryAbi from '../abi/CertificateRegistry.json'

const CONTRACT_ADDRESS = "<REPLACE_WITH_DEPLOYED_ADDRESS>"

export default function VerifyCertificate(){
  const [certificateId, setCertificateId] = useState('')
  const [result, setResult] = useState(null)

  async function handleVerify(e){
    e.preventDefault()
    if (!certificateId) return
    if (!window.ethereum) return alert('Install MetaMask')
    const provider = new ethers.BrowserProvider(window.ethereum)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CertificateRegistryAbi, provider)

    const res = await contract.verifyCertificate(certificateId)
    setResult(res)
  }

  return (
    <div className="card">
      <h2>Verify Certificate</h2>
      <form onSubmit={handleVerify}>
        <label>Certificate ID (hex)</label>
        <input value={certificateId} onChange={e => setCertificateId(e.target.value)} placeholder="0x..." />
        <button type="submit">Verify</button>
      </form>
      {result && (
        <div className="result">
          <p>Exists: {result[0] ? 'Yes' : 'No'}</p>
          <p>Valid: {result[1] ? 'Yes' : 'No'}</p>
          <p>Issuer: {result[2]}</p>
          <p>Recipient: {result[3]}</p>
          <p>CID: {result[4]}</p>
          <p>IssuedAt: {result[5] ? new Date(Number(result[5]) * 1000).toLocaleString() : '-'}</p>
        </div>
      )}
    </div>
  )
}
