// ENDEREÇO EHTEREUM DO CONTRATO
var contractAddress = "0x58db987051e91ae9a027ad60d3bc695449b4b095";

// Inicializa o objeto DApp
document.addEventListener("DOMContentLoaded", onDocumentLoad);
function onDocumentLoad() {
	DApp.init(function () {
		loadEvents();
	});
}

// Nosso objeto DApp que irá armazenar a instância web3
const DApp = {
	web3: null,
	contracts: {},
	account: null,

	init: function (cb) {
		return DApp.initWeb3(cb);
	},

	// Inicializa o provedor web3
	initWeb3: async function (cb) {
		if (typeof window.ethereum !== "undefined") {
			try {
				const accounts = await window.ethereum.request({
					// Requisita primeiro acesso ao Metamask
					method: "eth_requestAccounts",
				});
				DApp.account = accounts[0];
				document.getElementById("account").innerHTML = DApp.account;
				window.ethereum.on("accountsChanged", DApp.updateAccount); // Atualiza se o usuário trcar de conta no Metamaslk
			} catch (error) {
				console.error("Usuário negou acesso ao web3!");
				return;
			}
			DApp.web3 = new Web3(window.ethereum);
		} else {
			console.error("Instalar MetaMask!");
			return;
		}

		return DApp.initContract(cb);
	},
	// Atualiza 'DApp.account' para a conta ativa no Metamask
	updateAccount: async function () {
		DApp.account = (await DApp.web3.eth.getAccounts())[0];
	},
	// Associa ao endereço do seu contrato
	initContract: async function (cb) {
		DApp.contracts.Registry = new DApp.web3.eth.Contract(abi, contractAddress);
		cb();
	},
};

function loadEvents() {
	DApp.contracts.Registry.getPastEvents("Register", { fromBlock: 0, toBlock: "latest" }).then((result) => {
		let row = "";
		result.slice().reverse().forEach((evt, index) => {
			if (index > 10){
				return;
			}
			
			const data = evt.returnValues;
			row += `<tr>
				<th scope="row">${index + 1}</th>
				<td>${data["1"]}</td>
				<td>${data["0"]}</td>
				<td>${toDateTime(data["2"]).toLocaleString("pt-BR")}</td>
			</tr>`;
		});

		document.getElementById("table-body").innerHTML = row;
	});
}
