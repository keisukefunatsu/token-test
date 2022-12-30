import detectEthereumProvider from '@metamask/detect-provider'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Ethereum } from '../domains/type'
import Web3 from 'web3'
import styles from '../styles/Home.module.css'
import Layout from '../components/Layout'
import Head from 'next/head'
import { HANKOCONTRACT, HANKOCONTRACT_ABI } from '../domains/env'
import { BigNumber, ethers } from 'ethers'
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form"
import { WalletContext } from '../contexts/wallet'

let ethereum: Ethereum
if (typeof window !== "undefined") {
  ethereum = (window as any)?.ethereum
}

type MintForm = {
  hankoTime: string
}

type HankoNFT = {
  id: number
  hankoTime: string
}

export default function Home() {
  const [hankoList, setHankoList] = useState<Array<HankoNFT> | undefined>()
  const { register, handleSubmit, formState: { errors } } = useForm<MintForm>()
  const { connectMetamask, account, walletConnected } = useContext(WalletContext)

  const isValid: SubmitHandler<MintForm> = (data: MintForm) => {
    mint(data.hankoTime)
  }
  const isInValid: SubmitErrorHandler<MintForm> = (errors: any) => {
    console.log(errors)
    alert("mintできませんでした。日付を指定してください。")
  }
  const listNFT = async () => {
    if (!HANKOCONTRACT) {
      throw Error('Set HANKOCONTRACT')
    }
    let nfts: any[] = []
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(
      HANKOCONTRACT,
      HANKOCONTRACT_ABI,
      signer
    )
    await contract
      .listNFT()
      .then((res: any[][]) => {
        const [keys, vals] = res
        nfts = keys.map((h, i) => {
          return {
            id: h,
            hankoTime: vals[i]
          }
        })

      })
      .catch((err: any) => {
        console.log(err)
        alert('failed to List NFT')

      })
    return nfts
  }
  const mint = async (hankoTime: string): Promise<void> => {
    if (!HANKOCONTRACT) {
      throw Error('Set HANKOCONTRACT')
    }
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(
      HANKOCONTRACT,
      HANKOCONTRACT_ABI,
      signer
    )
    await contract
      .mint(await signer.getAddress(), hankoTime)
      .then((res: any) => {
        console.log(res)
      })
      .catch((err: any) => {
        console.log(err)
        alert('failed to mint')
      })
  }

  const f = useCallback(async () => {
    await connectMetamask()
  }, [connectMetamask])
  const g = useCallback(async () => {
    const nfts = await listNFT()
    setHankoList(nfts)
  }, [])
  useEffect(() => {
    if (account === '') {
      f()
    }
    if (account !== '' && !hankoList) {
      g()
    }
  }, [account, hankoList, connectMetamask, f, g])


  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <header>
            {walletConnected ?
              (<p>
                Your address: {account}
              </p>
              ) :
              (<button
                onClick={() => { () => connectMetamask() }}
              >
                Metamsk Login
              </button>)
            }

          </header>
          <h1 className={styles.title}>
            はんこ
          </h1>

          <form onSubmit={handleSubmit(isValid, isInValid)}>
            日付
            <div>
              <input type="date" {...register('hankoTime', { required: '日付指定が必要です' })} />
            </div>

            <button
              type='submit'
            >
              Mint
            </button>
          </form>

          <div>
            <h2>HankoList</h2>
            {
              hankoList?.map((h, i) => {
                return (
                  <div key={i}>
                    <p>id: {BigNumber.from(h.id).toString()}</p>
                    <p>time: {h.hankoTime || 'unknown'}</p>
                  </div>
                )
              })
            }
          </div>
        </main >

        <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
          </a>
        </footer>
      </div >
    </Layout>
  )
}
