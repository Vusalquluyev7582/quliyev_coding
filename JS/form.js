$(document).ready(function () {

    //* menu hissəsi 

    const mobileMenuToggle = $('#mobile-menu');
    const closeMenuBtn = $('#close-menu');
    const mobileNav = $('.mobile-nav');
    const mobileNavLinks = $('.mobile-menu-list .nav-link');

    function setActiveMenuItem() {
        const currentPath = window.location.pathname;
        let currentFileName = currentPath.substring(currentPath.lastIndexOf('/') + 1);

        if (currentFileName.includes('?')) {
            currentFileName = currentFileName.split('?')[0];
        }
        if (currentFileName.includes('#')) {
            currentFileName = currentFileName.split('#')[0];
        }
        if (currentFileName === '' || currentFileName === '/') {
            currentFileName = 'index.html';
        }

        console.log("setActiveMenuItem çağırıldı. Cari fayl adı (işlənmiş):", currentFileName);

        $('.nav-item').removeClass('active');

        $('.nav-link').each(function () {
            const linkHref = $(this).attr('href');

            if (linkHref) {
                if (linkHref === '#') {
                    console.log(`'#' linki atlandı: ${linkHref}`);
                    return true;
                }

                let linkFileName = linkHref.substring(linkHref.lastIndexOf('/') + 1);

                if (linkFileName.includes('?')) {
                    linkFileName = linkFileName.split('?')[0];
                }
                if (linkFileName.includes('#')) {
                    linkFileName = linkFileName.split('#')[0];
                }
                if (linkFileName === '' || linkFileName === '/') {
                    linkFileName = 'index.html';
                }

                console.log(`Müqayisə edilir: Cari URL faylı = "${currentFileName}" | Link URL faylı = "${linkFileName}"`);

                if (currentFileName === linkFileName) {
                    $(this).closest('.nav-item').addClass('active');
                    console.log(`Aktiv edildi: ${linkHref} üçün .nav-item`);
                }
            } else {
                console.warn("Boş 'href' atributu olan bir nav-link tapıldı:", this);
            }
        });
    }

    setActiveMenuItem();

    mobileMenuToggle.on('click', function () {
        $(this).addClass('is-active');
        mobileNav.addClass('is-open');
        $('body').addClass('no-scroll');

        mobileNavLinks.each(function (index) {
            const $this = $(this);

            $this.removeClass('animate-in').css('transition-delay', '');
            void $this[0].offsetWidth;
            $this.css('--animation-delay', (0.05 * index) + 's').addClass('animate-in');
        });

        setActiveMenuItem();
    });

    closeMenuBtn.on('click', function () {
        mobileMenuToggle.removeClass('is-active');
        mobileNav.removeClass('is-open');

        mobileNavLinks.each(function () {
            $(this).removeClass('animate-in').css('transition-delay', '0s');
        });

        setTimeout(() => {
            $('body').removeClass('no-scroll');
            setActiveMenuItem();
        }, 500);
    });


    $(window).on('resize', function () {
        if ($(window).width() > 1449 && mobileNav.hasClass('is-open')) {
            mobileMenuToggle.removeClass('is-active');
            mobileNav.removeClass('is-open');

            mobileNavLinks.removeClass('animate-in').css('transition-delay', '0s');

            $('body').removeClass('no-scroll');
            setActiveMenuItem();
        }
    });

    $('.mobile-menu-list .nav-link').on('click', function () {
        mobileMenuToggle.removeClass('is-active');
        mobileNav.removeClass('is-open');

        mobileNavLinks.removeClass('animate-in').css('transition-delay', '0s');

        setTimeout(() => {
            $('body').removeClass('no-scroll');
            setActiveMenuItem();
        }, 500);
    });


    //* form hissəsi

    function updateInputState($input, isValid, errorMessage = '') {
        const $label = $input.siblings('label');
        const $bar = $input.siblings('.bar');
        const $errorMessage = $input.siblings('.error-message');

        if ($input.is('input[type="checkbox"]')) {
            return;
        }

        const prefix = mobilePrefix;

        if ($input.attr('id') === 'mobile') {
            const currentVal = $input.val();
            const rawDigits = currentVal.substring(prefix.length).replace(/\D/g, '');

            if (currentVal.startsWith(prefix) && rawDigits.length < mobileExpectedDigitsAfterPrefix) {
                $input.addClass('has-value');
                $label.css({ 'top': '-20px', 'font-size': '12px', 'color': '#71b7e6' });
                $bar.css('width', '100%');
                $input.removeClass('invalid');
                $errorMessage.removeClass('active').text('');
            } else if (currentVal === prefix) {
                $input.removeClass('has-value invalid');
                if ($input.is(':focus')) {
                    $label.css({ 'top': '-20px', 'font-size': '12px', 'color': '#71b7e6' });
                    $bar.css('width', '100%');
                } else {
                    $label.css({ 'top': '10px', 'font-size': '16px', 'color': '#099' });
                    $bar.css('width', '0');
                }
                $errorMessage.removeClass('active').text('');
            } else {
                $input.addClass('has-value');
                $label.css({ 'top': '-20px', 'font-size': '12px', 'color': '#71b7e6' });
                $bar.css('width', '100%');
                $input.removeClass('invalid');
                $errorMessage.removeClass('active').text('');
            }
        } else {
            if ($input.val() === '') {
                $input.removeClass('has-value');
                if ($input.is(':focus')) {
                    $label.css({ 'top': '-20px', 'font-size': '12px', 'color': '#71b7e6' });
                    $bar.css('width', '100%');
                } else {
                    $label.css({ 'top': '10px', 'font-size': '16px', 'color': '#099' });
                    $bar.css('width', '0');
                }
                $input.removeClass('invalid');
                $errorMessage.removeClass('active').text('');
            } else {
                $input.addClass('has-value');
                $label.css({ 'top': '-20px', 'font-size': '12px', 'color': '#71b7e6' });
                $bar.css('width', '100%');

                $input.removeClass('invalid');
                $errorMessage.removeClass('active').text('');
            }
        }

        if (!isValid && errorMessage) {
            $input.addClass('invalid');
            $errorMessage.text(errorMessage).addClass('active');
        } else if (isValid && !errorMessage) {
            $input.removeClass('invalid');
            $errorMessage.removeClass('active').text('');
        }
    }

    function formatMobileDigits(digits) {
        let formattedDigits = '';
        if (digits.length > 0) {
            formattedDigits += digits.substring(0, 2);
        }
        if (digits.length > 2) {
            formattedDigits += ' ' + digits.substring(2, 5);
        }
        if (digits.length > 5) {
            formattedDigits += ' ' + digits.substring(5, 7);
        }
        if (digits.length > 7) {
            formattedDigits += ' ' + digits.substring(7, 9);
        }
        return formattedDigits;
    }

    const mobilePrefix = '+994 0';
    const mobilePrefixLength = mobilePrefix.length;
    const mobileExpectedDigitsAfterPrefix = 9;

    $('#mobile').val(mobilePrefix);
    updateInputState($('#mobile'), true);

    $('.input-group input').on('focus blur input', function () {
        const $this = $(this);

        if ($this.attr('id') === 'mobile') {
            let currentValue = $this.val();

            if (!currentValue.startsWith(mobilePrefix)) {
                let rawDigits = currentValue.replace(/\D/g, '');
                let cleanedDigits = '';

                if (rawDigits.startsWith('9940')) {
                    cleanedDigits = rawDigits.substring(4);
                } else {
                    cleanedDigits = rawDigits;
                }

                currentValue = mobilePrefix + formatMobileDigits(cleanedDigits);
                $this.val(currentValue);
            } else if (currentValue.length < mobilePrefixLength) {
                $this.val(mobilePrefix);
            }

            if ($this.is(':focus')) {
                const input = $this[0];
                const cursorPosition = input.selectionStart;
                if (cursorPosition < mobilePrefixLength) {
                    input.setSelectionRange(mobilePrefixLength, mobilePrefixLength);
                }
            }
            updateInputState($this, true);
        } else if (!$this.is('input[type="checkbox"]')) {
            updateInputState($this, true);
        }
    });

    $('#name').on('input', function () {
        let currentVal = $(this).val();
        currentVal = currentVal.replace(/[^a-zA-ZəüğıçöşƏÜĞIÇÖŞ\s]/g, '');
        currentVal = currentVal.replace(/\s{2,}/g, ' ');
        if (currentVal.startsWith(' ')) {
            currentVal = currentVal.trimStart();
        }
        $(this).val(currentVal);
    });

    $('#mobile').on('keydown', function (e) {
        const $this = $(this);
        let currentValue = $this.val();
        let cursorPosition = this.selectionStart;

        if (['ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key) || e.ctrlKey || e.metaKey) {
            return;
        }

        if (e.key === 'Backspace' && cursorPosition <= mobilePrefixLength) {
            e.preventDefault();
            return;
        }

        if (e.key === 'Delete' && cursorPosition < mobilePrefixLength) {
            e.preventDefault();
            return;
        }

        let rawDigits = currentValue.substring(mobilePrefixLength).replace(/\D/g, '');
        if (rawDigits.length >= mobileExpectedDigitsAfterPrefix && !['Backspace', 'Delete'].includes(e.key)) {
            e.preventDefault();
            return;
        }

        if (!/^\d$/.test(e.key) && !['Backspace', 'Delete'].includes(e.key)) {
            e.preventDefault();
        }
    }).on('input', function (e) {
        const $this = $(this);
        let currentValue = $this.val();
        let oldCursorPosition = this.selectionStart;

        if (!currentValue.startsWith(mobilePrefix)) {
            let rawDigits = currentValue.replace(/\D/g, '');
            let cleanedDigits = '';
            if (rawDigits.startsWith('9940')) {
                cleanedDigits = rawDigits.substring(4);
            } else {
                cleanedDigits = rawDigits;
            }
            currentValue = mobilePrefix + formatMobileDigits(cleanedDigits.replace(/\D/g, ''));
            $this.val(currentValue);
            this.setSelectionRange(mobilePrefixLength, mobilePrefixLength);
            return;
        }

        let rawDigits = currentValue.substring(mobilePrefixLength).replace(/\D/g, '');

        if (rawDigits.length > mobileExpectedDigitsAfterPrefix) {
            rawDigits = rawDigits.slice(0, mobileExpectedDigitsAfterPrefix);
        }

        const newFormattedValue = mobilePrefix + formatMobileDigits(rawDigits);
        $this.val(newFormattedValue);

        let newCursorPosition = mobilePrefixLength;
        let digitsCounted = 0;
        let originalDigitsBeforeCursor = currentValue.substring(mobilePrefixLength, oldCursorPosition).replace(/\D/g, '').length;

        for (let i = mobilePrefixLength; i < newFormattedValue.length; i++) {
            if (digitsCounted === originalDigitsBeforeCursor) {
                newCursorPosition = i;
                break;
            }
            if (newFormattedValue[i] !== ' ') {
                digitsCounted++;
            }
            newCursorPosition++;
        }
        if (oldCursorPosition >= newFormattedValue.length) {
            newCursorPosition = newFormattedValue.length;
        }

        this.setSelectionRange(newCursorPosition, newCursorPosition);

        updateInputState($this, true);
    });

    $('#mobile').on('paste', function (e) {
        e.preventDefault();
        const pasteData = e.originalEvent.clipboardData.getData('text');
        const $this = $(this);

        let digitsOnlyPasted = pasteData.replace(/\D/g, '');

        if (digitsOnlyPasted.startsWith('9940')) {
            digitsOnlyPasted = digitsOnlyPasted.substring(4);
        }
        else if (digitsOnlyPasted.startsWith('0')) {
            digitsOnlyPasted = digitsOnlyPasted.substring(1);
        }

        let currentRawDigits = $this.val().substring(mobilePrefixLength).replace(/\D/g, '');

        let combinedRawDigits = currentRawDigits + digitsOnlyPasted;

        if (combinedRawDigits.length > mobileExpectedDigitsAfterPrefix) {
            combinedRawDigits = combinedRawDigits.substring(0, mobileExpectedDigitsAfterPrefix);
        }

        const newFormattedValue = mobilePrefix + formatMobileDigits(combinedRawDigits);
        $this.val(newFormattedValue);

        this.setSelectionRange(newFormattedValue.length, newFormattedValue.length);

        updateInputState($this, true);
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    $('#password').on('input', function () {
        const $passwordInput = $(this);
        const passwordLength = $passwordInput.val().length;

        $passwordInput.removeClass('password-weak password-medium password-strong');
        $passwordInput.siblings('.error-message').removeClass('active').text('');

        if (passwordLength > 0) {
            if (passwordLength < 8) {
                $passwordInput.addClass('password-weak');
            } else if (passwordLength === 8) {
                $passwordInput.addClass('password-medium');
            } else if (passwordLength > 8) {
                $passwordInput.addClass('password-strong');
            }
        }
    });

    $('#myForm').submit(function (event) {
        event.preventDefault();

        let isValidForm = true;

        const $nameInput = $('#name');
        const nameValue = $nameInput.val().trim();
        const containsNonLetters = /[^a-zA-ZəüğıçöşƏÜĞIÇÖŞ\s]/.test(nameValue);

        if (nameValue === '') {
            updateInputState($nameInput, false, 'Adınız boş buraxıla bilməz.');
            isValidForm = false;
        } else if (nameValue.length < 3) {
            updateInputState($nameInput, false, 'Adınız ən az 3 hərfdən ibarət olmalıdır.');
            isValidForm = false;
        } else if (containsNonLetters) {
            updateInputState($nameInput, false, 'Adınız yalnız hərflərdən ibarət olmalıdır.');
            isValidForm = false;
        }
        else {
            updateInputState($nameInput, true);
        }

        const $emailInput = $('#email');
        const emailValue = $emailInput.val().trim();
        if (emailValue === '') {
            updateInputState($emailInput, false, 'E-poçtunuz boş buraxıla bilməz.');
            isValidForm = false;
        } else if (!isValidEmail(emailValue)) {
            updateInputState($emailInput, false, 'Düzgün bir e-poçt adresi daxil edin.');
            isValidForm = false;
        } else {
            updateInputState($emailInput, true);
        }

        const $passwordInput = $('#password');
        const passwordValue = $passwordInput.val().trim();
        const passwordLength = passwordValue.length;

        $passwordInput.removeClass('password-weak password-medium password-strong');

        if (passwordValue === '') {
            updateInputState($passwordInput, false, 'Şifrə boş buraxıla bilməz.');
            isValidForm = false;
        } else if (passwordLength < 8) {
            updateInputState($passwordInput, false, 'Şifrə ən az 8 simvol olmalıdır.');
            isValidForm = false;
        } else {
            updateInputState($passwordInput, true);
            if (passwordLength === 8) {
                $passwordInput.addClass('password-medium');
            } else if (passwordLength > 8) {
                $passwordInput.addClass('password-strong');
            }
        }

        const $mobileInput = $('#mobile');
        const mobileValue = $mobileInput.val();

        const rawDigits = mobileValue.substring(mobilePrefix.length).replace(/\s/g, '');

        if (rawDigits.length === 0) {
            updateInputState($mobileInput, false, 'Nömrə boş buraxıla bilməz.');
            isValidForm = false;
        } else if (rawDigits.length !== mobileExpectedDigitsAfterPrefix) {
            updateInputState($mobileInput, false, `Düzgün mobil nömrə daxil edin (${mobilePrefix}XX XXX XX XX formatında ${mobileExpectedDigitsAfterPrefix} rəqəm olmalıdır).`);
            isValidForm = false;
        } else {
            updateInputState($mobileInput, true);
        }

        const $ageInput = $('#age');
        const ageValue = $ageInput.val().trim();

        if (ageValue === '') {
            updateInputState($ageInput, false, 'Yaşınız boş buraxıla bilməz.');
            isValidForm = false;
        } else {
            const parsedAge = parseInt(ageValue, 10);
            if (isNaN(parsedAge)) {
                updateInputState($ageInput, false, 'Düzgün yaş daxil edin.');
                isValidForm = false;
            } else if (parsedAge < 13) {
                updateInputState($ageInput, false, 'Yaşınız 13-dən azdır. Yaş həddi 13-35.');
                isValidForm = false;
            } else if (parsedAge > 35) {
                updateInputState($ageInput, false, 'Yaşınız 35-dən çoxdur. Yaş həddi 13-35.');
                isValidForm = false;
            } else {
                updateInputState($ageInput, true);
            }
        }

        const $checkboxGroup = $('.checkbox-group');
        const $checkboxes = $checkboxGroup.find('input[type="checkbox"]');
        const $checkboxError = $checkboxGroup.find('.error-message.checkbox-error');

        const isAnyCheckboxChecked = $checkboxes.is(':checked');

        if (!isAnyCheckboxChecked) {
            isValidForm = false;
            $checkboxGroup.addClass('invalid');
            $checkboxError.text('Xahiş edirik, ən azı bir kurs seçin.').addClass('active');
        } else {
            $checkboxGroup.removeClass('invalid');
            $checkboxError.removeClass('active').text('');
        }

        if (isValidForm) {
            const $button = $(this).find('button[type="submit"]');
            const originalText = $button.text();

            $button.text('Göndərilir...').prop('disabled', true);
            $button.css('background', 'linear-gradient(45deg, #6cb3e0, #8a48a0)');

            setTimeout(function () {
                $button.text('Göndərildi!').css('background', 'linear-gradient(45deg, #4CAF50, #8BC34A)');
                alert('Form göndərildi! (Demo)');

                setTimeout(function () {
                    $button.text(originalText).prop('disabled', false);
                    $button.css('background', 'linear-gradient(45deg, #71b7e6, #9b59b6)');
                    $('#myForm')[0].reset();
                    $('.input-group input').each(function () {
                        const $input = $(this);
                        if (!$input.is('input[type="checkbox"]')) {
                            $input.removeClass('has-value invalid password-weak password-medium password-strong');
                            $input.siblings('label').css({
                                'top': '10px',
                                'font-size': '16px',
                                'color': '#099'
                            });
                            $input.siblings('.bar').css('width', '0');
                            $input.siblings('.error-message').removeClass('active').text('');
                        }
                        if ($input.attr('id') === 'mobile') {
                            $input.val(mobilePrefix);
                            updateInputState($input, true);
                        }
                    });

                    $checkboxGroup.removeClass('invalid');
                    $checkboxError.removeClass('active').text('');
                    $checkboxes.prop('checked', false);

                }, 1500);

            }, 2000);
        }
    });


    //* checkbox hissəsi

    $('.checkbox-options input[type="checkbox"]').on('change', function () {
        const $this = $(this);
        const isChecked = $this.prop('checked');

        if (isChecked) {
            $('.checkbox-options input[type="checkbox"]').not($this).prop('checked', false);
        }
        const $checkboxGroup = $('.checkbox-group');
        const $checkboxes = $checkboxGroup.find('input[type="checkbox"]');
        const $checkboxError = $checkboxGroup.find('.error-message.checkbox-error');
        const isAnyCheckboxChecked = $checkboxes.is(':checked');

        if (isAnyCheckboxChecked) {
            $checkboxGroup.removeClass('invalid');
            $checkboxError.removeClass('active').text('');
        }
    });


    //* kart hissəsi

    let $cardNumberInput = $('#cardNumber');
    let $cardHolderInput = $('#cardHolder');
    let $monthSelect = $('#cardMonth');
    let $yearSelect = $('#cardYear');
    let $cvvInput = $('#cardCvv');

    let $cardNumberDisplay = $('#card-number-box');
    let $cardHolderNameDisplay = $('#card-holder-name');
    let $cardExpiryDisplay = $('#expiration-date');
    let $cardTypeImageFront = $('#cardTypeImage');

    let $displayedCardCvv = $('#displayedCardCvv');
    let $cardTypeImageBack = $('#cardTypeImageBack');

    let cardLogos = {};

    let updateCardDisplay = function () {
        let currentNumber = $cardNumberInput.val().replace(/\s/g, '');
        let formattedNumber = '';
        let maxLength = 16;

        if (currentNumber.length === 0) {
            formattedNumber = '#### #### #### ####';
        } else {
            for (let i = 0; i < maxLength; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedNumber += ' ';
                }
                if (i < currentNumber.length) {
                    formattedNumber += currentNumber[i];
                } else {
                    formattedNumber += '#';
                }
            }
        }
        $cardNumberDisplay.text(formattedNumber);

        let currentHolder = $cardHolderInput.val().toLocaleUpperCase('az-AZ');
        if (currentHolder.length === 0) {
            $cardHolderNameDisplay.text('FULL NAME');
        } else {
            $cardHolderNameDisplay.text(currentHolder);
        }

        let selectedMonth = $monthSelect.val();
        let selectedYear = $yearSelect.val();
        let expiryText = 'MM/YY';

        if (selectedMonth && selectedMonth !== "" && selectedYear && selectedYear !== "") {
            expiryText = selectedMonth + '/' + selectedYear.substring(2);
        } else if (selectedMonth && selectedMonth !== "") {
            expiryText = selectedMonth + '/YY';
        } else if (selectedYear && selectedYear !== "") {
            expiryText = 'MM/' + selectedYear.substring(2);
        }
        $cardExpiryDisplay.text(expiryText);

        let currentCvv = $cvvInput.val();
        if (currentCvv.length === 0) {
            $displayedCardCvv.text('###');
        } else {
            $displayedCardCvv.text(currentCvv.padEnd(3, '#'));
        }
    }

    $cardNumberInput.on('input', function () {
        let currentVal = $(this).val();
        currentVal = currentVal.replace(/\D/g, '');

        let formattedVal = '';
        let effectiveLength = Math.min(currentVal.length, 16);

        for (let i = 0; i < effectiveLength; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedVal += ' ';
            }
            formattedVal += currentVal[i];
        }

        if (formattedVal.length > 19) {
            formattedVal = formattedVal.substring(0, 19);
        }

        $(this).val(formattedVal);
        updateCardDisplay();
    });

    $cardHolderInput.on('input', function () {
        let currentVal = $(this).val();
        const MAX_CHARS_HOLDER = 20;

        currentVal = currentVal.replace(/[^a-zA-ZəüğıçöşƏÜĞIÇÖŞ\s]/g, '');

        currentVal = currentVal.replace(/\s{2,}/g, ' ');

        if (currentVal.startsWith(' ')) {
            currentVal = currentVal.trimStart();
        }

        let parts = currentVal.split(' ');
        if (parts.length > 2) {
            currentVal = parts[0] + ' ' + parts.slice(1).join('');
        }

        let processedVal = '';
        let charCount = 0;

        for (let i = 0; i < currentVal.length; i++) {
            if (currentVal[i] === ' ') {
                if (processedVal.indexOf(' ') === -1) {
                    processedVal += ' ';
                }
            } else {
                if (charCount < MAX_CHARS_HOLDER) {
                    processedVal += currentVal[i];
                    charCount++;
                }
            }
        }
        currentVal = processedVal;

        $(this).val(currentVal);
        updateCardDisplay();
    });

    $monthSelect.on('change', function () {
        updateCardDisplay();
    });
    $yearSelect.on('change', function () {
        updateCardDisplay();
    });

    $cvvInput.on('input', function () {
        let currentCvv = $(this).val();
        currentCvv = currentCvv.replace(/\D/g, '');
        if (currentCvv.length > 3) {
            currentCvv = currentCvv.substring(0, 3);
        }
        $(this).val(currentCvv);
        updateCardDisplay();
    });

    let populateMonths = function () {
        $monthSelect.empty();
        $monthSelect.append('<option value="" disabled selected>MM</option>');

        for (let i = 1; i <= 12; i++) {
            const month = i < 10 ? '0' + i : i;
            $monthSelect.append(`<option value="${month}">${month}</option>`);
        }
    }

    let populateYears = function () {
        $yearSelect.empty();
        $yearSelect.append('<option value="" disabled selected>YY</option>');

        const currentYear = new Date().getFullYear();
        for (let i = 0; i < 10; i++) {
            const year = (currentYear + i).toString();
            $yearSelect.append(`<option value="${year}">${year.substring(2)}</option>`);
        }
    }

    populateMonths();
    populateYears();

    updateCardDisplay();

    $cvvInput.on('focus', function () {
        const $creditCard = $('#creditCard');
        $creditCard.addClass('-active');
    });

    $cvvInput.on('blur', function () {
        const $creditCard = $('#creditCard');
        $creditCard.removeClass('-active');
    });

    $cardNumberInput.on('focus', function () { const $creditCard = $('#creditCard'); $creditCard.removeClass('-active'); });
    $cardHolderInput.on('focus', function () { const $creditCard = $('#creditCard'); $creditCard.removeClass('-active'); });
    $monthSelect.on('focus', function () { const $creditCard = $('#creditCard'); $creditCard.removeClass('-active'); });
    $yearSelect.on('focus', function () { const $creditCard = $('#creditCard'); $creditCard.removeClass('-active'); });


    //* yuxarı çıx hissəsi

    function toggleGoUpstairsButton() {
        let distance = $(window).scrollTop();

        if (distance > 100) {
            $(".go-upstairs").fadeIn();
        } else {
            $(".go-upstairs").fadeOut();
        }
    }

    if ($(window).scrollTop() > 100) {
        $(".go-upstairs").show();
    } else {
        $(".go-upstairs").hide();
    }

    $(window).scroll(function () {
        toggleGoUpstairsButton();
    });


    $(".go-upstairs").click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, "slow");
    });


    //* sosial media ikonlarının deaktiv hissəsi

    $('.sosial-media a').on('click', function (event) {
        if ($(this).attr('href') === '#') {
            event.preventDefault();
        }
    });

});