/**
 * Created by serge on 01.12.2016.
 */
;(function ($) {

    'user strict';

    var isMobile;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        isMobile = true;
    } else {
        isMobile = false;
    }

    $(window).on('load', function (w) {
        $('.masonry').each(function () {
            var masonry = $(this).find('.masonry__content');
            masonry.isotope({
                itemSelector: '.masonry__item',
                // layoutMode: 'fitRows',
                masonry: {
                    columnWidth: '.masonry__item'
                },
                percentPosition: true,
                transitionDuration: '0.8s',
                hiddenStyle: {
                    opacity: 0,
                    transform: 'scale(0.001)'
                },
                visibleStyle: {
                    opacity: 1,
                    transform: 'scale(1)'
                }
            });


        });


        $('.masonry__filter li').on('click', function() {
            var masonryFilter = $(this);
            var masonryContainer = masonryFilter.closest('.masonry').find('.masonry__content');
            var filterValue = '*';
            if (masonryFilter.attr('data-masonry-filter') !== '*') {
                filterValue = '.filter-' + masonryFilter.attr('data-masonry-filter');
            }
            $('.masonry__filter li').removeClass('active');
            masonryFilter.addClass('active');
            // masonryContainer.removeClass('masonry-animate');
            masonryContainer.isotope({ filter: filterValue });
        });

        // initReveal();
    });

    $(document).ready(function() {

        initHeader();
        initBackgroundImages();
        initParallax();
        initSliders();

        $('.masonry').each(function() {
            var masonry = $(this);
            var masonryContainer = masonry.find('.masonry__content'),
                filters = masonry.find('.masonry__filter'),
                // data-filter-all-text can be used to set the word for "all"
                filterAllText = typeof filters.attr('data-filter-all-text') !== typeof undefined ? filters.attr('data-filter-all-text') : "All",
                filtersList;

            if (masonryContainer.find('.masonry__item[data-masonry-filter]').length) {

                filters.append('<ul></ul>');
                filtersList = filters.find('> ul');

                filtersList.append('<li class="active" data-masonry-filter="*">' + filterAllText + '</li>');

                masonryContainer.find('.masonry__item[data-masonry-filter]').each(function() {
                    var masonryItem = $(this),
                        filterString = masonryItem.attr('data-masonry-filter'),
                        filtersArray = [];

                    if (typeof filterString !== typeof undefined && filterString !== "") {
                        filtersArray = filterString.split(',');
                    }
                    jQuery(filtersArray).each(function(index, tag) {

                        masonryItem.addClass('filter-' + tag);

                        if (!filtersList.find('[data-masonry-filter="' + tag + '"]').length) {
                            filtersList.append('<li data-masonry-filter="' + tag + '">' + tag + '</li>');

                        }
                    });
                });
            }
        });

    });

    ////// init background images
    function initBackgroundImages() {
        var bgSection = $(".parallax, .image-holder");
        bgSection.each(function() {
            if ($(this).attr("data-background")) {
                $(this).css("background-image", "url(" + $(this).data("background") + ")");
            }
        });
    }

    ////// init jarallax plugin | parallax
    function initParallax() {
        if (!isMobile) {
            $('.parallax').jarallax({
                speed: 0.2
            });
        }
    }

    ////// init scrollReveal plugin
    function initReveal() {
        window.sr = ScrollReveal();
        revContainer = document.getElementsByClassName('masonry__content');
        sr.reveal('.masonry__item', {duration: 1000, scale: 1, container: revContainer, mobile: false },100);
    }
    
    function initHeader() {
        var mainHeader = $('.main-header');

        mainHeader.on('click', '.nav-trigger', function(event){
            // open primary navigation on mobile
            event.preventDefault();
            mainHeader.toggleClass('nav-open');
        });
    }

    function initSliders() {

        var sliders = $('.slider');
        sliders.each(function() {
            var currentSlider = $(this),
                options = currentSlider.attr('data-slider-options');

            options = options ? JSON.parse(options) : {};

            currentSlider.slick(options);
        })



    }

})(jQuery);