document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const codeDisplay = document.getElementById('codeDisplay');
    const barcode = document.getElementById('barcode');
    const codeList = document.getElementById('codeList');
    const searchBox = document.getElementById('searchBox');
    const searchBtn = document.getElementById('searchBtn');
    const resetBtn = document.getElementById('resetBtn');
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

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const newCode = generateUniqueCode();
            codeDisplay.textContent = newCode;
            JsBarcode(barcode, newCode, {
                format: "EAN13",
                displayValue: true
            });
        });
    }

    if (codeList) {
        function displayCodes(codes) {
            codeList.innerHTML = '';
            codes.forEach(code => {
                const listItem = document.createElement('li');
                listItem.textContent = code;
                codeList.appendChild(listItem);
            });
        }

        displayCodes(generatedCodes);

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = searchBox.value.trim();
                if (query) {
                    const filteredCodes = generatedCodes.filter(code => code.includes(query));
                    displayCodes(filteredCodes);
                    if (filteredCodes.length > 0) {
                        searchBox.style.backgroundColor = 'green';
                    } else {
                        searchBox.style.backgroundColor = 'red';
                    }
                } else {
                    displayCodes(generatedCodes);
                    searchBox.style.backgroundColor = '';
                }
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                localStorage.removeItem('generatedCodes');
                generatedCodes = [];
                displayCodes(generatedCodes);
            });
        }
    }
});


