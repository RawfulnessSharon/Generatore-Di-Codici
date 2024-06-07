document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const codeDisplay = document.getElementById('codeDisplay');
    const barcodeCanvas = document.getElementById('barcodeCanvas');
    const ctx = barcodeCanvas.getContext('2d');
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

    function updateBarcode(code) {
        ctx.clearRect(0, 0, barcodeCanvas.width, barcodeCanvas.height);
        JsBarcode(ctx, code, {
            format: "EAN13",
            displayValue: true
        });
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const newCode = generateUniqueCode();
            codeDisplay.textContent = newCode;
            updateBarcode(newCode);
        });
    }
});
