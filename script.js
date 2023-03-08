'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

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

// Smooth scrolling
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
//get the co-ordinates to the scroll to section
const section1coords = section1.getBoundingClientRect();

btnScrollTo.addEventListener('click', function () {
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

