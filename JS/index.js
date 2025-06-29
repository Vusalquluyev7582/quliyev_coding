$(document).ready(function () {

    //* intro animation hissəsi

    const introAnimationContainer = $('#intro-animation-container');
    const introYazi1 = $('.intro-yazi1');
    const introYazi2 = $('.intro-yazi2');

    let hasAnimationPlayedThisSession = sessionStorage.getItem('hasAnimationPlayedThisSession');
    const navigationType = performance.navigation.type;

    let shouldShowAnimation = false;


    if (navigationType === 1) {
        shouldShowAnimation = true;
        sessionStorage.removeItem('hasAnimationPlayedThisSession');
    } else if (navigationType === 0 && !hasAnimationPlayedThisSession) {
        shouldShowAnimation = true;
    }

    if (introAnimationContainer.length && shouldShowAnimation) {
        $('body').addClass('no-scroll');

        setTimeout(() => {
            introAnimationContainer.css({
                'opacity': '1',
                'visibility': 'visible',
                'pointer-events': 'auto'
            });
        }, 50);

        function animateTextByChar(element, initialDelay, charDelay) {
            let textToAnimate = element.text();
            element.empty();

            let chars = textToAnimate.split('');
            $.each(chars, function (i, char) {
                let charSpan = $('<span></span>').text(char).addClass('char');
                if (char === ' ') {
                    charSpan.html('&nbsp;');
                }
                charSpan.css({
                    'animation-name': 'slide-up',
                    'animation-duration': '0.8s',
                    'animation-fill-mode': 'forwards',
                    'animation-timing-function': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    'animation-delay': (initialDelay + i * charDelay) + 's'
                });
                element.append(charSpan);
            });
        }

        const firstTextStartDelay = 0.5;
        const charAnimationDelay = 0.08;

        const originalTextYazi1Length = introYazi1.text().length;
        animateTextByChar(introYazi1, firstTextStartDelay, charAnimationDelay);

        const totalCharsYazi1 = originalTextYazi1Length;
        const secondTextStartDelay = firstTextStartDelay + (totalCharsYazi1 * charAnimationDelay) + 0.3;

        const originalTextYazi2Length = introYazi2.text().length;
        animateTextByChar(introYazi2, secondTextStartDelay, charAnimationDelay);

        const totalCharsYazi2 = originalTextYazi2Length;
        const totalAnimationDuration = secondTextStartDelay + (totalCharsYazi2 * charAnimationDelay) + 1.5;

        setTimeout(function () {
            introAnimationContainer.css({
                'opacity': '0',
                'visibility': 'hidden',
                'pointer-events': 'none'
            });

            setTimeout(() => {
                introAnimationContainer.css('display', 'none');
                $('body').removeClass('no-scroll');
                sessionStorage.setItem('hasAnimationPlayedThisSession', 'true');
            }, 1000);
        }, totalAnimationDuration * 1000);
    } else {
        introAnimationContainer.css({
            'opacity': '0',
            'visibility': 'hidden',
            'pointer-events': 'none',
            'display': 'none'
        });
        $('body').removeClass('no-scroll');
    }


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