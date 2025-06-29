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


    //* scrrll probleminin həlli

    let lastClickedAccordionToggle = null;

    $('.accordion-header button').on('click', function () {
        lastClickedAccordionToggle = this;
    });


    //* avtomatik yazı hissəsi

    let parseHtmlIntoBlocks = function (htmlString) {
        const blocks = [];
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        Array.from(doc.body.childNodes).forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                blocks.push(node.outerHTML);
            } else if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim().length > 0) {
                const sentences = node.nodeValue.split(/([.?!;]\s*)/).filter(Boolean);
                sentences.forEach(s => {
                    if (s.trim().length > 0 || /^\s+$/.test(s)) {
                        blocks.push(s);
                    }
                });
            } else if (node.nodeType === Node.TEXT_NODE && /^\s+$/.test(node.nodeValue)) {
                blocks.push(node.nodeValue);
            }
        });
        return blocks;
    };

    let typeWriterEffect = function (element) {
        const $element = $(element);
        const $accordionBody = $element.find('.accordion-body');

        if ($accordionBody.length === 0) {
            console.warn("typeWriterEffect: .accordion-body not found inside", element[0].id);
            return;
        }

        const originalInnerHTML = $accordionBody.data('original-inner-html');
        const contentBlocks = parseHtmlIntoBlocks(originalInnerHTML);

        $accordionBody.html('');
        $accordionBody.css('opacity', 1);

        let blockIndex = 0;
        const delayBetweenBlocks = 100;

        let typeNextBlock = function () {
            if ($element.hasClass('show') && blockIndex < contentBlocks.length) {
                const currentBlock = contentBlocks[blockIndex];

                let $newElement;
                if (currentBlock.startsWith('<') && currentBlock.endsWith('>')) {
                    $newElement = $(currentBlock);
                } else {
                    $newElement = $('<span></span>').html(currentBlock);
                }

                $newElement.css('opacity', 0);
                $accordionBody.append($newElement);

                setTimeout(() => {
                    $newElement.css('opacity', 1);
                }, 10);

                blockIndex++;
                setTimeout(typeNextBlock, delayBetweenBlocks);

            } else if (!($element.hasClass('show'))) {
                $accordionBody.html(originalInnerHTML);
                console.log('Typing stopped for:', element[0].id, 'as parent is hidden. Restored full content.');
            } else if (blockIndex >= contentBlocks.length) {
                $accordionBody.html(originalInnerHTML);
                console.log('Finished typing. Restored full content for:', element[0].id);
            }
        }
        typeNextBlock();
    }

    let clearTypedContent = function (element) {
        console.log('clearTypedContent called for:', element[0].id);
        const $element = $(element);
        const $accordionBody = $element.find('.accordion-body');
        const originalInnerHTML = $accordionBody.data('original-inner-html');
        $accordionBody.html(originalInnerHTML).css('opacity', 0);
    }

    let setupBootstrapTypewriter = function (contentId) {
        const $content = $(contentId);
        if ($content.length === 0) {
            console.warn("setupBootstrapTypewriter: Content ID not found:", contentId);
            return;
        }
        console.log('Setting up Bootstrap typewriter for:', contentId);

        const $accordionBody = $content.find('.accordion-body');
        $accordionBody.data('original-inner-html', $accordionBody.html());

        $accordionBody.css('opacity', 0);

        $content.on('show.bs.collapse', function () {
            console.log('Bootstrap show.bs.collapse event fired for:', this.id);
            $accordionBody.html('').css('opacity', 0);
        });

        $content.on('shown.bs.collapse', function () {
            console.log('Bootstrap shown.bs.collapse event fired for:', this.id);
            typeWriterEffect($content);


            //* səhifəni kliklənən düymənin mövqeyinə qaytarmaq üçün olan hissəsi 

            if (lastClickedAccordionToggle) {
                const $toggleElement = $(lastClickedAccordionToggle);
                const offsetTop = $toggleElement.offset().top;
                const scrollDistance = offsetTop - ($(window).height() / 4);

                $('html, body').animate({
                    scrollTop: scrollDistance > 0 ? scrollDistance : 0
                }, 300);

                lastClickedAccordionToggle = null;
            }

        });

        $content.on('hidden.bs.collapse', function () {
            console.log('Bootstrap hidden.bs.collapse event fired for:', this.id);
            clearTypedContent($content);
        });
    }

    setupBootstrapTypewriter('#collapseHTML');
    setupBootstrapTypewriter('#collapseCSS');
    setupBootstrapTypewriter('#collapseSASS');
    setupBootstrapTypewriter('#collapseBS');
    setupBootstrapTypewriter('#collapseJS');
    setupBootstrapTypewriter('#collapseJQ');
    setupBootstrapTypewriter('#collapseRC');
    setupBootstrapTypewriter('#collapseGT');
    setupBootstrapTypewriter('#collapseGTB');
    setupBootstrapTypewriter('#collapseTC');
    setupBootstrapTypewriter('#collapseRXT');
    setupBootstrapTypewriter('#collapseNJ');
    setupBootstrapTypewriter('#collapseAR');
    setupBootstrapTypewriter('#collapseVJ');
    setupBootstrapTypewriter('#collapseSJ');
    setupBootstrapTypewriter('#collapseEJ');
    setupBootstrapTypewriter('#collapseNDJ');
    setupBootstrapTypewriter('#collapseDJG');
    setupBootstrapTypewriter('#collapseNP');
    setupBootstrapTypewriter('#collapseSQM');
    setupBootstrapTypewriter('#collapseRB');


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