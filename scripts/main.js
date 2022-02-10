var autenticarSuccess = document.getElementById('autenticarSuccess');

autenticarSuccess.style.display = "none";

function sendDocument() {
    calculate(function (result, error) {
        if (error != null) {
            console.log(error);
            return
        }

        document.getElementById("hashDocument").innerHTML = result.hashResult;
        autenticarSuccess.style.display = "block";
    })
}

function hideAutenticarSuccess() {
    autenticarSuccess.style.display = "none";
}