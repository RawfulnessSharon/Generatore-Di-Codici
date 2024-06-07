document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const codeDisplay = document.getElementById('codeDisplay');
    const barcode = document.getElementById('barcode');
    const downloadBtn = document.getElementById('downloadBtn');
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
        JsBarcode(barcode, code, {
            format: "EAN13",
            displayValue: true
        });
        barcode.style.display = 'block';
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const newCode = generateUniqueCode();
            codeDisplay.textContent = newCode;
            updateBarcode(newCode);
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const canvas = document.createElement('canvas');
            JsBarcode(canvas, codeDisplay.textContent, {
                format: "EAN13",
                displayValue: true
            });
            const url = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            const link = document.createElement('a');
            link.href = url;
            link.download = 'barcode.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
});
