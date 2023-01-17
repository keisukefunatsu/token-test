import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'



describe('ERC1155', function () {
  const deployFixture = async () => {
    const [deployer, ...signers] = await ethers.getSigners()
    const Erc1155SampleFactory = await ethers.getContractFactory('Erc1155Sample')
    const Erc1155Sample = await Erc1155SampleFactory.connect(deployer).deploy()
    await Erc1155Sample.deployed()

    return { Erc1155Sample, deployer, signers }
  }

  it('Should mint', async () => {
    const { Erc1155Sample, deployer } = await loadFixture(deployFixture)
    await Erc1155Sample.connect(deployer).setTokenUri(1, 'ThisIsUriForxxx')
    const uri = await Erc1155Sample.connect(deployer).callStatic.uri(1)
    expect(uri).to.equal('ThisIsUriForxxx')
    await expect(Erc1155Sample.connect(deployer).setTokenUri(1, 'ThisIsUriForxxx')).to.be.revertedWith('Cannot set uri twice')

    const a = await Erc1155Sample.connect(deployer).uri
  })
})



