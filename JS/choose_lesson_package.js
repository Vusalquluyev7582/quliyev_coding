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


    //* main hissəsi

    const $checkboxes = $('.lesson-checkbox');
    const $selectedLessonsList = $('#selectedLessonsList');
    const $totalPriceElement = $('#totalPrice');
    const $totalDurationElement = $('#totalDuration');

    const updateSummary = function () {
        let totalPrice = 0;
        let totalWeeks = 0;
        $selectedLessonsList.empty();

        $checkboxes.each(function () {
            const $this = $(this);
            if ($this.is(':checked')) {
                const lessonName = $this.data('lesson');
                const lessonPrice = parseFloat($this.data('price'));
                const lessonWeeks = parseInt($this.data('weeks'));
                const lessonCount = parseInt($this.data('lessonsCount'));

                totalPrice += lessonPrice;
                totalWeeks += lessonWeeks;

                const listItem = `
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <span>${lessonName} (${lessonWeeks} həftə, ${lessonCount} dərs)</span>
                                <span>${lessonPrice.toFixed(2)} AZN</span>
                            </li>
                        `;
                $selectedLessonsList.append(listItem);
            }
        });

        if ($selectedLessonsList.children().length === 0) {
            const noSelectionItem = `
                        <li class="list-group-item">Heç bir dərs paketi seçilməyib.</li>
                    `;
            $selectedLessonsList.append(noSelectionItem);
        }

        const totalMonths = totalWeeks / 4;

        $totalPriceElement.text(`${totalPrice.toFixed(2)} AZN`);
        $totalDurationElement.text(`${totalWeeks} həftə (${totalMonths % 1 === 0 ? totalMonths : totalMonths.toFixed(1)} ay)`);
    }


    $checkboxes.on('change', updateSummary);

    updateSummary();


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