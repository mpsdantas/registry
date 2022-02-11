var autenticarSuccess = document.getElementById('autenticarSuccess');
var verifySuccess = document.getElementById('verifySuccess');
var verifyError = document.getElementById('verifyError');

autenticarSuccess.style.display = "none";
verifySuccess.style.display = "none";
verifyError.style.display = "none";

function sendDocument(id) {
    calculate(id, function (result, error) {
        if (error != null) {
            console.log(error);
            return
        }

        // TODO: send to blockchain

        document.getElementById("hashDocument").innerHTML = result.hashResult;
        autenticarSuccess.style.display = "block";
    })
}

function verifyDocument(id) {
    calculate(id, function (result, error) {
        if (error != null) {
            console.log(error);
            return
        }

        document.getElementById("createdBy").innerHTML = "xasadsdasdasdasd";
        document.getElementById("name").innerHTML = result.fileName;
        document.getElementById("hash").innerHTML = "asdadsasd";
        document.getElementById("createdAt").innerHTML = new Date();

        verifySuccess.style.display = "block";
    })
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