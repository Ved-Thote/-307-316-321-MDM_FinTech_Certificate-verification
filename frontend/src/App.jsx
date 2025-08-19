import React from 'react'
import Header from './components/Header'
import IssueCertificate from './components/IssueCertificate'
import VerifyCertificate from './components/VerifyCertificate'

export default function App(){
  return (
    <div className="app">
      <Header />
      <main>
        <div className="card-row">
          <IssueCertificate />
          <VerifyCertificate />
        </div>
      </main>
    </div>
  )
}
