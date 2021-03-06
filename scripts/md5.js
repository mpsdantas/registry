function calculateMD5Hash(file, bufferSize) {
  var def = Q.defer();

  var fileReader = new FileReader();
  var fileSlicer = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
  var hashAlgorithm = new SparkMD5();
  var totalParts = Math.ceil(file.size / bufferSize);
  var currentPart = 0;
  var startTime = new Date().getTime();

  fileReader.onload = function (e) {
    currentPart += 1;

    def.notify({
      currentPart: currentPart,
      totalParts: totalParts
    });

    var buffer = e.target.result;
    hashAlgorithm.appendBinary(buffer);

    if (currentPart < totalParts) {
      processNextPart();
      return;
    }

    def.resolve({
      hashResult: hashAlgorithm.end(),
      duration: new Date().getTime() - startTime
    });
  };

  fileReader.onerror = function (e) {
    def.reject(e);
  };

  function processNextPart() {
    var start = currentPart * bufferSize;
    var end = Math.min(start + bufferSize, file.size);
    fileReader.readAsBinaryString(fileSlicer.call(file, start, end));
  }

  processNextPart();
  return def.promise;
}

function calculate(id, cb) {
  var input = document.getElementById(id);
  if (!input.files.length) {
    return;
  }

  var file = input.files[0];
  var bufferSize = Math.pow(1024, 2) * 10; // 10MB

  calculateMD5Hash(file, bufferSize).then(
    function (result) {
      result.fileName = file.name;
      cb(result, null)
    },
    function (err) {
      cb(null, err)
    },
    function (progress) {
      // We get notified of the progress as it is executed
      console.log(progress.currentPart, 'of', progress.totalParts, 'Total bytes:', progress.currentPart * bufferSize, 'of', progress.totalParts * bufferSize);
    });
}           