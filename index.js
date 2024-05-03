document.addEventListener('DOMContentLoaded', function () {

    const cardNumberInput = document.getElementById('cc-number');
    const expDateInput = document.getElementById('cc-exp');
    const cvvInput = document.getElementById('cc-cvv');
    const cardIcon = document.getElementById('cc-icon');
    const form = document.querySelector('#ccForm');
    const submitBtn = document.getElementById('submit-btn');
    const ccError = `<span class="material-symbols-outlined text-danger">error</span>`
    const ccDefault = `<span class="material-symbols-outlined">credit_card</span>`

    cardNumberInput.focus()
    updateSubmitButtonState()

    const cardRegexList = [
        { vendor: "Visa", regex: /^4[0-9]*$/, src: 'visa' },
        { vendor: "Mastercard", regex: /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]*$/, src: 'mastercard' },
        { vendor: "American Express", regex: /^3[47][0-9]*$/, src: 'amEx', len: 15, cvv: 4 },
        { vendor: "Discover", regex: /^6(?:011|5[0-9]{2})[0-9]*$/, src: 'discover' },
        { vendor: "JCB", regex: /^(?:2131|1800|35\d{3})\d*$/, src: 'jcb' },
        { vendor: "Diners Club", regex: /^3(?:0[0-5]|[68][0-9])[0-9]*$/, src: 'diners', len: 14 },
        { vendor: "UnionPay", regex: /^622\d*$/, src: 'unionPay', len: 19 },
        { vendor: "UnionPay", regex: /^62[0-9]*$/, src: 'unionPay' },
        { vendor: "Maestro", regex: /^(?:5[0678]\d\d|6304|6390|67\d\d)\d*$/, src: 'maestro' },
        { vendor: "Elo", regex: /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})$/, src: 'elo' },
        { vendor: "Hipercard", regex: /^(606282\d{10}(\d{3})?)|(3841\d{15})$/, src: 'hipercard' },
        { vendor: "Aura", regex: /^(5078\d{11,12})$/ },
        { vendor: "Cabal", regex: /^(8763\d{10})$/ },
        { vendor: "Carnet", regex: /^(876\d{11,12})$/ },
        { vendor: "Carte Blanche", regex: /^(389\d{11,12})$/ },
        { vendor: "Dankort", regex: /^(5019\d{12})$/ }
    ];

    const ignoredExp = [
        /4005550000000001/,
        /4012888888881881/,
        /4111111111111111/,
        /4444333322221111/,
        /4539105011539664/,
        /4555400000555123/,
        /4564456445644564/,
        /4544182174537267/,
        /4716914706534228/,
        /4916541713757159/,
        /4916615639346972/,
        /4917610000000000/,
        /5100080000000000/,
        /5105105105105100/,
        /5111111111111118/,
        /5123456789012346/,
        /5123619745395853/,
        /5138495125550554/,
        /5274576394259961/,
        /5301745529138831/,
        /5311531286000465/,
        /5364587011785834/,
        /5404000000000001/,
        /5431111111111111/,
        /5454545454545454/,
        /5459886265631843/,
        /5460506048039935/,
        /5500939178004613/,
        /5555555555554444/,
        /5556400000551234/,
        /5565552064481449/,
        /5597507644910558/,
    ]

    const ignoredExpCheck = (cardNumber) => {
        return ignoredExp.some(element => {
            if (element.test(cardNumber)) {
                return true;
            }
        });
    }

    function validateCardNumber(cardNumber) {
        cardNumber = cardNumber.replace(/\D/g, '');
        if (cardNumber.length < 13 || cardNumber.length > 19) {
            return false;
        }
        let sum = 0;
        let doubleUp = false;
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let curDigit = parseInt(cardNumber.charAt(i), 10);

            if (doubleUp) {
                curDigit *= 2;
                if (curDigit > 9) {
                    curDigit -= 9;
                }
            }

            sum += curDigit;
            doubleUp = !doubleUp;
        }
        return (sum % 10 === 0) && !ignoredExpCheck(cardNumber);
    }

    function validateExpirationDate() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        const expDateParts = expDateInput.value.split('/');
        const enteredMonth = parseInt(expDateParts[0], 10);
        const enteredYear = parseInt(expDateParts[1], 10);

        if (isNaN(enteredMonth) || isNaN(enteredYear) || enteredMonth < 1 || enteredMonth > 12 || enteredYear < currentYear || (enteredYear === currentYear && enteredMonth < currentMonth)) {
            return false
        } else {
            updateSubmitButtonState();
            cvvInput.focus();
            return true
        }
    }

    function updateSubmitButtonState() {
        const isValidCardNumber = cardNumberInput.getAttribute("isValid") === "true";
        const isValidExpDate = expDateInput.getAttribute("isValid") === "true";
        const isValidCVV = cvvInput.getAttribute("isValid") === "true";
        submitBtn.disabled = !(isValidCardNumber && isValidExpDate && isValidCVV);
        return isValidCardNumber && isValidExpDate && isValidCVV
    }

    function submitForm () {
        let date = expDateInput.value.replace(/\D/g, ''),
        formCCNum = document.querySelector('#cardnr'),
        formCCExpM = document.querySelector('#validMonth'),
        formCCExpY = document.querySelector('#validYear');
        formCCNum.value = cardNumberInput.value.replace(/\D/g, '')
        formCCExpM.value = date.substring(0, 2)
        formCCExpY.value = date.substring(2, 4)

        const cvvHiddenInput = document.createElement('input');
        cvvHiddenInput.type = 'hidden';
        cvvHiddenInput.name = 'cvc2';
        cvvHiddenInput.value = cvvInput.value;

        form.appendChild(cvvHiddenInput);
        form.submit();
        form.removeChild(cvvHiddenInput);
        formCCNum.value = ''
        formCCExpM.value = ''
        formCCExpY.value = ''
    }

    function getCardVendor(cardNumber) {
        for (const card of cardRegexList) {
            if (card.regex.test(cardNumber)) {
                return card;
            }
        }
        return false;
    }

    cardNumberInput.addEventListener('input', function () {
        let cardNumber = cardNumberInput.value.replace(/\D/g, '');
        let maskedValue = cardNumber.replace(/\D/g, '').substring(0, 16);
        maskedValue = maskedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
        cardNumberInput.value = maskedValue;

        let isValidCardNumber = validateCardNumber(cardNumber);
        let cardVendor = getCardVendor(cardNumber);
        if (cardVendor) {
            cardIcon.innerHTML = `<img src="./assets/cardIcons/${cardVendor.src}.svg" width="24" alt="">`;
            cvvInput.setAttribute("maxlength", cardVendor.cvv ? 4 : 3);
        } else {
            cardNumber.length > 6 && (isValidCardNumber ? (cardIcon.innerHTML = `<span class="material-symbols-outlined">indeterminate_question_box</span>`) : cardIcon.innerHTML = ccError)
        }

        if (isValidCardNumber) {
            cardVendor.len ? cardVendor.len == cardNumber.length && (expDateInput.focus(), cardNumberInput.setAttribute("isValid", true)) : cardNumber.length == 16 && (expDateInput.focus(), cardNumberInput.setAttribute("isValid", true));
            cardNumberInput.parentElement.classList.toggle("not-valid", false)
            updateSubmitButtonState()
        } else {
            cardNumber.length > 14 && (cardNumberInput.parentElement.classList.toggle("not-valid", true), cardIcon.innerHTML = ccError)
        }
        cardNumberInput.setAttribute("isValid", isValidCardNumber)
        cardNumber == "" && (cardIcon.innerHTML = ccDefault)
    });

    cardNumberInput.addEventListener('change', function () {
        let cardNumber = cardNumberInput.value.replace(/\D/g, '');
        cardNumber.length < 14 && (cardIcon.innerHTML = ccDefault)
    });

    expDateInput.addEventListener('input', function () {
        let inputValue = expDateInput.value.replace(/\D/g, '').substring(0, 6);
        inputValue = inputValue.replace(/(\d{2})(?=\d)/g, '$1/');
        let enteredMonth = inputValue.substring(0, 2);
        if (enteredMonth.length === 1 && parseInt(enteredMonth, 10) > 1) {
            enteredMonth = '0' + enteredMonth;
        }
        let enteredYear = inputValue.substring(3);
        expDateInput.value = `${enteredMonth}${enteredYear ? '/' + enteredYear : ''}`;
        validateExpirationDate();
        expDateInput.setAttribute("isValid", validateExpirationDate());
        expDateInput.parentElement.classList.toggle("not-valid", !validateExpirationDate());
    });

    cvvInput.addEventListener('input', function () {
        cvvInput.value = cvvInput.value.replace(/\D/g, '');
        const cvv = cvvInput.value.trim();
        const isValidCVV = /^\d{3,4}$/.test(cvv);
        cvvInput.setAttribute("isValid", isValidCVV);
        updateSubmitButtonState();
    });

    cardNumberInput.addEventListener('keydown', function (event) {
        if (event.key === 'Backspace' && cardNumberInput.selectionStart === 0 && cardNumberInput.selectionEnd === 0 && cardNumberInput.value == "") {
            cardNumberInput.parentElement.classList.toggle("not-valid", false)
            cardIcon.innerHTML = ccDefault;
        }
    });

    expDateInput.addEventListener('keydown', function (event) {
        if (event.key === 'Backspace' && expDateInput.selectionStart === 0 && expDateInput.selectionEnd === 0) {
            cardNumberInput.focus();
        }
    });

    cvvInput.addEventListener('keydown', function (event) {
        if (event.key === 'Backspace' && cvvInput.selectionStart === 0 && cvvInput.selectionEnd === 0) {
            expDateInput.focus();
        }
    });

    submitBtn.addEventListener('click', function () {
        submitForm();
    });
});