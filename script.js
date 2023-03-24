'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabContents = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const allSections = document.querySelectorAll('.section');

const imageTarget = document.querySelectorAll('img[data-src]');


///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////////////////////////////////////////////
// Smooth scrolling 

btnScrollTo.addEventListener('click', function () {
  //get the co-ordinates to the scroll to section
  // const section1coords = section1.getBoundingClientRect();

  /* ----- old method 1 ------ */
  // window.scrollTo(section1coords.left + scrollX, section1coords.top + scrollY);

  /* ----- old method 2 ------ */
  // window.scrollTo({
  //   left: section1coords.left + scrollX,
  //   top: section1coords.top + scrollY,
  //   behavior: 'smooth'
  // });

  /* ----- new method ------ */
  section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////////////////////////////////////////////////////////
// Smooth scrolling Navigation

// This is not the optimized way as the function is written for every nav-link. 
// So make use of event delegation. Make use of event propagation in the bubbling phase

/* document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const sectionId = e.target.getAttribute('href');
    document.querySelector(sectionId).scrollIntoView({ behavior: 'smooth' });
  });
}); */

// 1. Add event listener to the parent element
// 2. Determine what element the event originated
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //Matching only the nav__link, not the entire parent
  if (e.target.classList.contains('nav__link')) {
    const sectionId = e.target.getAttribute('href');
    document.querySelector(sectionId).scrollIntoView({ behavior: 'smooth' });
  }
});

//////////////////////////////////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener('click', function (e) {

  const clicked = e.target.closest('.operations__tab');

  //Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => {
    t.classList.remove('operations__tab--active');
  });
  tabContents.forEach(c => {
    c.classList.remove('operations__content--active');
  });

  //Active Tab
  clicked.classList.add('operations__tab--active');

  // show content
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

//////////////////////////////////////////////////////////////////
// Page Navigation : Fade on hover

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;

    // change opacity of siblings
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(element => {
      if (element != link) element.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//////////////////////////////////////////////////////////////////
// Sticky Navigation : Intersection Observer API

const stickyNav = function (entries) {
  const [entry] = entries; //retrieve only first element in the array
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

// IntersectionObserver need a option and a callback
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0.1,
  rootMargin: `-${navHeight}px`
});
headerObserver.observe(header);

// Note
/*  1. threshold(0.1 = 10%) is the percentage of intersection at which the observer callback is called
    2.  the obsCallback function is called each time when the targeted element intersect the root element ie, section1 intersect root and intersection threshold is what defined
    3. here viewport is root  */

//////////////////////////////////////////////////////////////////
// Reveal Section

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionsObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
});

allSections.forEach(function (section) {
  sectionsObserver.observe(section);
  section.classList.add('section--hidden');
});


//////////////////////////////////////////////////////////////////
// Lazy loading Images

const lazyLoad = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);//stop triggering the intersection once done
}

const imagesObserver = new IntersectionObserver(lazyLoad, {
  root: null,
  threshold: 0,
  rootMargin: '200px' //load images reaching 200px before intersection happens.so that viewers do not felt like lazy load
});

imageTarget.forEach(img => {
  imagesObserver.observe(img);
})

///////////////////////////////////////
// Slider

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();