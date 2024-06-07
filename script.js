document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const codeDisplay = document.getElementById('codeDisplay');
    const barcode = document.getElementById('barcode');
    let generatedCodes = JSON.parse(localStorage.getItem('generatedCodes')) || [];

    function generateCheckDigit(upc) {
        let sumOdd = 0;
        let sumEven = 0;
        for (let i = 0; i < upc.length; i++) {
            if (i % 2 === 0) {
                sumOdd += parseInt(upc[i]);
            } else {
                sumEven += parseInt(upc[i]);
            }
        }
        const total = sumOdd * 3 + sumEven;
        return (10 - (total % 10)) % 10;
    }

    function generateUniqueCode() {
        let code;
        do {
            let upc = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
            let checkDigit = generateCheckDigit(upc);
            code = upc + checkDigit;
        } while (generatedCodes.includes(code));
        generatedCodes.push(code);
        localStorage.setItem('generatedCodes', JSON.stringify(generatedCodes));
        return code;
    }

    // Funzione per aggiornare il codice a barre
    function updateBarcode(code) {
        JsBarcode("#barcode", code, {
            format: "ean13",
            displayValue: true
        });
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            // Genera il nuovo codice unico
            const newCode = generateUniqueCode();

            // Visualizza il codice numerico
            codeDisplay.textContent = newCode;

            // Aggiorna il codice a barre
            updateBarcode(newCode);
        });
    }
});
