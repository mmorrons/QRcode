document.addEventListener('DOMContentLoaded', function() {
  // Initialize Materialize select elements
  var elems = document.querySelectorAll('select');
  M.FormSelect.init(elems);

  // Language texts for English and Italian
  var texts = {
    en: {
      pageTitle: "Customizable QR Code Generator with Logo",
      urlLabel: "URL",
      urlPlaceholder: "Enter URL here",
      sizeLabel: "QR Code Size (px)",
      formatLabel: "Output Format",
      colorDarkLabel: "Dark Color (hex)",
      colorLightLabel: "Light Color (hex)",
      errorCorrectionLabel: "Error Correction Level",
      logoScaleLabel: "Logo Scale (% of QR)",
      logoBtnLabel: "Select Logo (optional)",
      generateBtn: "Generate QR Code",
      downloadBtn: "Download QR Code",
      emptyUrl: "Please enter a URL."
    },
    it: {
      pageTitle: "Generatore di QR Code personalizzabile con logo",
      urlLabel: "URL",
      urlPlaceholder: "Inserisci URL qui",
      sizeLabel: "Dimensione QR Code (px)",
      formatLabel: "Formato di output",
      colorDarkLabel: "Colore scuro (hex)",
      colorLightLabel: "Colore chiaro (hex)",
      errorCorrectionLabel: "Livello di correzione",
      logoScaleLabel: "Scala del logo (% del QR)",
      logoBtnLabel: "Seleziona logo (opzionale)",
      generateBtn: "Genera QR Code",
      downloadBtn: "Scarica QR Code",
      emptyUrl: "Inserisci un URL."
    }
  };

  var currentLang = 'en';

  // Update UI text based on selected language
  function updateLanguage() {
    currentLang = document.getElementById('languageSelect').value;
    var t = texts[currentLang];
    document.getElementById('pageTitle').textContent = t.pageTitle;
    document.getElementById('urlLabel').textContent = t.urlLabel;
    document.getElementById('urlInput').placeholder = t.urlPlaceholder;
    document.querySelector("label[for='sizeInput']").textContent = t.sizeLabel;
    document.querySelector("label[for='formatSelect']").textContent = t.formatLabel;
    document.querySelector("label[for='colorDarkInput']").textContent = t.colorDarkLabel;
    document.querySelector("label[for='colorLightInput']").textContent = t.colorLightLabel;
    document.querySelector("label[for='errorCorrectionSelect']").textContent = t.errorCorrectionLabel;
    document.querySelector("label[for='logoScaleInput']").textContent = t.logoScaleLabel;
    document.getElementById('logoBtnLabel').textContent = t.logoBtnLabel;
    document.getElementById('generateBtn').textContent = t.generateBtn;
    document.getElementById('downloadBtn').textContent = t.downloadBtn;
  }

  document.getElementById('languageSelect').addEventListener('change', function() {
    updateLanguage();
  });
  updateLanguage();

  // Create a QRCodeStyling instance variable
  let qrCode;

  // Generate the QR code when the button is clicked
  document.getElementById('generateBtn').addEventListener('click', function() {
    var url = document.getElementById('urlInput').value.trim();
    if (!url) {
      M.toast({html: texts[currentLang].emptyUrl});
      return;
    }
    var size = parseInt(document.getElementById('sizeInput').value) || 300;
    var format = document.getElementById('formatSelect').value; // png, jpg, svg
    var colorDark = document.getElementById('colorDarkInput').value || "#000000";
    var colorLight = document.getElementById('colorLightInput').value || "#ffffff";
    var ecLevel = document.getElementById('errorCorrectionSelect').value || "H";
    var logoScale = parseInt(document.getElementById('logoScaleInput').value) || 20;
    var logoFile = document.getElementById('logoInput').files[0];

    if (logoFile) {
      var reader = new FileReader();
      reader.onload = function(e) {
        generateQRCode(url, size, format, colorDark, colorLight, ecLevel, logoScale, e.target.result);
      };
      reader.readAsDataURL(logoFile);
    } else {
      generateQRCode(url, size, format, colorDark, colorLight, ecLevel, logoScale, "");
    }
  });

  // Function to generate the QR code using qr-code-styling
  function generateQRCode(url, size, format, colorDark, colorLight, ecLevel, logoScale, logoDataUrl) {
    // Clear any previous QR code
    document.getElementById('qrContainer').innerHTML = "";

    qrCode = new QRCodeStyling({
      width: size,
      height: size,
      data: url,
      image: logoDataUrl,
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 0,
        imageSize: logoScale / 100 // relative size (e.g., 0.2 for 20%)
      },
      qrOptions: {
        ecLevel: ecLevel,
      },
      dotsOptions: {
        color: colorDark,
        type: "rounded"
      },
      backgroundOptions: {
        color: colorLight,
      }
    });

    qrCode.append(document.getElementById('qrContainer'));
    document.getElementById('downloadBtn').style.display = "inline-block";
  }

  // Download the QR code in the selected format
  document.getElementById('downloadBtn').addEventListener('click', function() {
    var format = document.getElementById('formatSelect').value; // png, jpg, svg
    qrCode.download({ name: "qr_code", extension: format });
  });
});
