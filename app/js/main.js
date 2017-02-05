/**
 * Created by serge on 01.12.2016.
 */
;(function ($) {

    'user strict';

    const isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))?true:false;

    $(window).on('load', function (w) {
        $('.masonry').each(function () {
            const masonry = $(this).find('.masonry__content');
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
            const masonryFilter = $(this);
            const masonryContainer = masonryFilter.closest('.masonry').find('.masonry__content');
            let filterValue = '*';
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
        initParticles();

        $('.masonry').each(function() {
            let masonry = $(this);
            let masonryContainer = masonry.find('.masonry__content'),
                filters = masonry.find('.masonry__filter'),
                // data-filter-all-text can be used to set the word for "all"
                filterAllText = typeof filters.attr('data-filter-all-text') !== typeof undefined ? filters.attr('data-filter-all-text') : "All",
                filtersList;

            if (masonryContainer.find('.masonry__item[data-masonry-filter]').length) {

                filters.append('<ul></ul>');
                filtersList = filters.find('> ul');

                filtersList.append('<li class="active" data-masonry-filter="*">' + filterAllText + '</li>');

                masonryContainer.find('.masonry__item[data-masonry-filter]').each(function() {
                    let masonryItem = $(this),
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
        const bgSection = $(".parallax, .image-holder");
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
        const revContainer = document.getElementsByClassName('masonry__content');
        sr.reveal('.masonry__item', {duration: 1000, scale: 1, container: revContainer, mobile: false },100);
    }
    
    function initHeader() {
        const mainHeader = $('.main-header');

        mainHeader.on('click', '.nav-trigger', (event)=>{
            // open primary navigation on mobile
            event.preventDefault();
            mainHeader.toggleClass('nav-open');
        });
    }

    function initSliders() {

        const sliders = $('.slider');
        sliders.each(function() {
            let currentSlider = $(this),
                options = currentSlider.attr('data-slider-options');

            options = options ? JSON.parse(options) : {};

            currentSlider.slick(options);
        })
    }

    function initParticles() {
        const particles = document.getElementById('particles-js');
        if (particles && !isMobile) {
            particlesJS('particles-js',
                {
                    "particles": {
                        "number": {
                            "value": 50,
                            "density": {
                                "enable": true,
                                "value_area": 800
                            }
                        },
                        "color": {
                            "value": "#ffffff"
                        },
                        "shape": {
                            "type": "none",
                            "stroke": {
                                "width": 0,
                                "color": "#000000"
                            },
                            "polygon": {
                                "nb_sides": 5
                            },
                            "image": {
                                "src": "img/github.svg",
                                "width": 100,
                                "height": 100
                            }
                        },
                        "opacity": {
                            "value": 0.5,
                            "random": false,
                            "anim": {
                                "enable": false,
                                "speed": 1,
                                "opacity_min": 0.1,
                                "sync": false
                            }
                        },
                        "size": {
                            "value": 3,
                            "random": true,
                            "anim": {
                                "enable": false,
                                "speed": 40,
                                "size_min": 0.1,
                                "sync": false
                            }
                        },
                        "line_linked": {
                            "enable": true,
                            "distance": 150,
                            "color": "#ffffff",
                            "opacity": 0.4,
                            "width": 1
                        },
                        "move": {
                            "enable": true,
                            "speed": 6,
                            "direction": "none",
                            "random": false,
                            "straight": false,
                            "out_mode": "out",
                            "bounce": false,
                            "attract": {
                                "enable": false,
                                "rotateX": 600,
                                "rotateY": 1200
                            }
                        }
                    },
                    "interactivity": {
                        "detect_on": "canvas",
                        "events": {
                            "onhover": {
                                "enable": true,
                                "mode": "repulse"
                            },
                            "onclick": {
                                "enable": true,
                                "mode": "push"
                            },
                            "resize": true
                        },
                        "modes": {
                            "grab": {
                                "distance": 400,
                                "line_linked": {
                                    "opacity": 1
                                }
                            },
                            "bubble": {
                                "distance": 400,
                                "size": 40,
                                "duration": 2,
                                "opacity": 8,
                                "speed": 3
                            },
                            "repulse": {
                                "distance": 50,
                                "duration": 0.4
                            },
                            "push": {
                                "particles_nb": 4
                            },
                            "remove": {
                                "particles_nb": 2
                            }
                        }
                    },
                    "retina_detect": true
                }
            );
        }
    }

})(jQuery);