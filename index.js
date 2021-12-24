const ethers = require('ethers')
const express = require('express')

const totalSupplyABI = {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
};
const CirculatingSupply = {
    inputs: [],
    name: "CirculatingSupply",
    outputs: [{ internalType: "uint256",  name: "",  type: "uint256" }],
    stateMutability: "view",
    type: "function",
};

const port = 3000
const bscRPC = "https://bsc-dataseed.binance.org/"
const zdERC20 = '0x98051143830fa99848E7059E97AcB03B3cc62403'
const circSupply = '0x260D8CfB7EFe867245e18bbD20068c67c16203c9'

const provider = new ethers.providers.JsonRpcProvider(bscRPC);
const zdContract = new ethers.Contract(zdERC20, [totalSupplyABI], provider);
const circSupplyContract = new ethers.Contract(circSupply, [CirculatingSupply], provider);

let totalSupply = 0
let circulatingSupply = 0

const fetchSupply = async () => {
    totalSupply = (await zdContract.totalSupply()) / Math.pow(10, 9)
    circulatingSupply = (await circSupplyContract.CirculatingSupply()) / Math.pow(10, 9)
    console.log(circulatingSupply, '/', totalSupply)
}

fetchSupply()
setInterval(fetchSupply, 1000 * 300)

const app = express()

app.get('/totalSupply', (req, res) => {
    res.send(`${totalSupply}`)
})

app.get('/circulatingSupply', (req, res) => {
    res.send(`${circulatingSupply}`)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})