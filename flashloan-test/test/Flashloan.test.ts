import { ethers } from 'hardhat'


// Mainnet DAI Address
const DAI = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
// Address which has a lot of DAI
const DAI_WHALE = "0xdfD74E3752c187c4BA899756238C76cbEEfa954B";

const POOL_ADDRESS_PROVIDER = "0xa97684ead0e402dc232d5a977953df7ecbab3cdb";

describe('FlashLoan', function () {
  const deployFixture = async () => {
    const [deployer, ...signers] = await ethers.getSigners()
    const FlashLoanFactory = await ethers.getContractFactory('FlashLoanExample')
    const FlashLoan = await FlashLoanFactory.connect(deployer).deploy(POOL_ADDRESS_PROVIDER)

    return { FlashLoan, deployer, signers }
  }


  describe('FlashLoan', function () {
    it('', async () => {

    })
  })
})



