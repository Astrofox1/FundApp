import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectbtn = document.querySelector('#connectbtn')
const fundbtn = document.querySelector('#fund')
const ethAmount = document.querySelector('#ethAmount')
const balancebtn = document.querySelector('#balance')
const withdrawbtn = document.querySelector('#withdraw')

connectbtn.onclick = connect
fundbtn.onclick = fund
balancebtn.onclick = balance
withdrawbtn.onclick = withdraw

// Connect to MetaMask
async function connect(){
    if(typeof window.ethereum !== "undefined"){
        await window.ethereum.request({
            method: "eth_requestAccounts"
        })
        connectbtn.innerHTML = "Connected!"
    } else {
        connectbtn.innerHTML = "Please Install MetaMask"
    }   
}

// Fund the contract 
/*
    for that we need : 
        * provider / connection to the blockchain
        * signer / wallet / someone with gas
        * contract that we are interacting with
        * ^ ABI & Adddress
*/
async function fund(){
    if(typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try{
            const transactionResponse = await contract.Fund({
                value: ethers.utils.parseEther(ethAmount.value),
            })
            await MiningTx(transactionResponse, provider)
            console.log("Done!");
        } catch (error) {
            console.log(error)
        }
    }
}

function MiningTx(transactionResponse, provider){
    console.log(`Minting ${transactionResponse.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

async function balance(){
    if(typeof window.ethereum !== "undefined"){
        console.log("Getting balance...");
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const scbalance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(scbalance))
    }
}


async function withdraw() {
    if(typeof window.ethereum !== "undefined"){
        console.log("Withdrawing...");
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try{
            const transactionResponse = await contract.withdraw()
            await MiningTx(transactionResponse, provider)
            console.log("Done!");
        } catch (error) {
            console.log(error)
        }
    }
}