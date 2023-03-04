deploy sample

```
npx hardhat run --network polygon scripts/deploy.ts
```


verify sample

```
npx hardhat verify --contract "contracts/token.sol:TestToken" <ContractAddress> "Testtoken" "TT" --network polygon  
```
