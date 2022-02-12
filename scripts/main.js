var autenticarSuccess = document.getElementById("autenticarSuccess");
var verifySuccess = document.getElementById("verifySuccess");
var verifyError = document.getElementById("verifyError");
var hashLoading = document.getElementById("hashLoading");

autenticarSuccess.style.display = "none";
verifySuccess.style.display = "none";
verifyError.style.display = "none";
hashLoading.style.display = "none";

function sendDocument(id) {
	calculate(id, function (result, error) {
		if (error != null) {
			console.log(error);
			return;
		}

		hashLoading.style.display = "block";

		DApp.contracts.Registry.methods
			.register(result.hashResult, result.fileName)
			.send({ from: DApp.account, value: 0 })
			.then((r) => {
				console.log(r);
				document.getElementById("hashDocument").innerHTML = result.hashResult;
				autenticarSuccess.style.display = "block";

				hashLoading.style.display = "none";

				loadEvents();
			})
			.catch((err) => {
				console.log(err);

				hashLoading.style.display = "none";
			});
	});
}

function verifyDocument(id) {
	calculate(id, function (result, error) {
		if (error != null) {
			console.log(error);
			return;
		}

		document.getElementById("result").innerHTML = "";

		DApp.contracts.Registry.methods
			.getRegisterCount(result.hashResult)
			.call()
			.then((count) => {
				if (count == 0) {
					verifyError.style.display = "block";
					return;
				}

				console.log(count);

				for (i = 0; i < count; i++) {
					DApp.contracts.Registry.methods
						.verify(result.hashResult, i)
						.call()
						.then((data) => {
							appendDivResult(data, result.hashResult);
							verifySuccess.style.display = "block";
							console.log(data);
						});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	});
}

function hideAutenticarSuccess() {
	autenticarSuccess.style.display = "none";
}

function hideVerifySuccess() {
	verifySuccess.style.display = "none";
}

function hideVerifyError() {
	verifyError.style.display = "none";
}

function toDateTime(secs) {
	var t = new Date(1970, 0, 1); // Epoch
	t.setSeconds(secs);
	return t;
}

function appendDivResult(data, hash) {
	const html = `<hr>
	Autenticado por: <strong><span>${data["0"]}</span></strong
	><br />
	Nome original: <strong><span>${data["1"]}</span></strong
	><br />
	Hash: <strong><span>${hash}</span></strong
	><br />
	Horário da autenticação: <strong><span id="createdAt">${toDateTime(data["2"]).toLocaleString("pt-BR")}</span></strong>
	<hr></hr>`;

	document.getElementById("result").innerHTML += html;
}
