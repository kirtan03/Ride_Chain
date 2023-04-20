import Web3 from "web3"

const web3 = new Web3(window.web3.currentProvider);
const contractAddress = '0x9071842918fE009E2635872F275b60b250347BC6'
const abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_rootDriverOfferHash",
				"type": "string"
			}
		],
		"name": "setRootDriverOfferHash",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_rootRiderRequestHash",
				"type": "string"
			}
		],
		"name": "setRootRiderRequestHash",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_rootUserHash",
				"type": "string"
			}
		],
		"name": "setRootUserHash",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getRootDriverOfferHash",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getRootRiderRequestHash",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getRootUserHash",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
const contract = new web3.eth.Contract(abi, contractAddress)
export default contract