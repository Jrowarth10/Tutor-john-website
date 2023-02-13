'strict';
///////////////////////////////////////////////////////////
// Sticky Navigation
///////////////////////////////////////////////////////////////////
const sectionHeroEl = document.querySelector('.section-hero');
const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];

    if (!ent.isIntersecting) {
      document.body.classList.add('sticky');
    }
    if (ent.isIntersecting) {
      document.body.classList.remove('sticky');
    }
  },
  {
    // Root shows where the element should be appearing or not, usually always null. Null here technically means the viewport
    root: null,
    // as soon as 0% of hero section is inside the viewport the event will occur
    threshold: 0,
    // This makes the nav appear minus its height before leaving the herosection so that it doesnt block the start of the new section
    rootMargin: '-112px',
  }
);
obs.observe(sectionHeroEl);

///////////////////////////////////////////////////////////
// Mobile navigation
///////////////////////////////////////////////////////////////////
const allLinks = document.querySelectorAll('a:link');
const btnNavEl = document.querySelector('.btn-mobile-nav');
const headerEl = document.querySelector('.header');

const closeNav = allLinks.forEach(function (link) {
  link.addEventListener('click', function () {
    //Close mobile navigation
    if (link.classList.contains('main-nav-link'))
      headerEl.classList.toggle('nav-open');
  });
});

btnNavEl.addEventListener('click', function () {
  headerEl.classList.toggle('nav-open');
});

///////////////////////////////////////////////////////////
// Reveal sections
///////////////////////////////////////////////////////////////////
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    // We use the target here as the target identifies which section it is by class and id so it reveals the target that is being intersected
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  // We shall only reveal the section when it is 15% visible
  threshold: 0,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////////////////////////
// Lazy loading images
///////////////////////////////////////////////////////////////////
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    //Replace src with data-src
    entry.target.src = entry.target.dataset.src;
    entry.target.classList.remove('lazy-img');
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
  });
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////////////////////////
// Testimonial slider
///////////////////////////////////////////////////////////////////
const mQ = window.matchMedia('(max-width: 800px)');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
const testimonialContainer = document.querySelector(
  '.testimonial-outer-container'
);
let curSlide = 0;
const maxSlide = slides.length;

//FUNCTIONS
//Next slide
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

//Previous slide
const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

// Activate dots
const activateDot = function (slide) {
  // First we remove the active class on all of the dots and then we add it to the one that it is active
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

//Create dots
const createDots = function () {
  testimonialContainer.appendChild(dotContainer);
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

//Slide ready
const slideReady = function () {
  createDots();
  activateDot(curSlide);
  goToSlide(curSlide);
};

//Go to slide
const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

//Deactivating the slider

const deactivateSlider = function () {
  const dotButtons = document.querySelectorAll('.dots__dot');
  dotButtons.forEach(dB => dB.parentNode.removeChild(dB));
  slides.forEach((s, i) => (s.style.transform = `translateX(${0}%)`));
  testimonialContainer.removeChild(dotContainer);
  console.log('DeactivatingJs');
  btnRight.removeEventListener('click', nextSlide);
  btnLeft.removeEventListener('click', prevSlide);
};
const activateSlider = function () {
  slideReady();

  //Event Handlers

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Creating an event with the arrows
  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      //This is the same as above, the slide part is from the html and the dataset is an HTML attribute
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

// Detecting change in screen size

if (mQ.matches) {
  deactivateSlider();
} else {
  activateSlider();
}

mQ.addEventListener('change', () => {
  if (mQ.matches) {
    deactivateSlider();
  } else {
    activateSlider();
  }
});

////////////////////////////////////////////////////////////////////////////
//Accordion
////////////////////////////////////////////////////////////////////////////

//Traversing the dom option
// const accBtn = document.querySelectorAll('.accordion-btn');

// accBtn.forEach(function (btn) {
//   btn.addEventListener('click', function (e) {
//     const question = e.currentTarget.parentElement.parentElement;
//     question.classList.toggle('show-text');
//   });
// });

const questions = document.querySelectorAll('.accordions');

questions.forEach(function (question) {
  const btn = question.querySelector('.accordion-btn');
  btn.addEventListener('click', function () {
    questions.forEach(function (item) {
      if (item !== question) {
        item.classList.remove('show-text');
      }
    });

    question.classList.toggle('show-text');
  });
});

///////////////////////////////
// const allLinks = document.querySelectorAll('a:link');
// allLinks.forEach(function (link) {
//   link.addEventListener('click', function (e) {
//     e.preventDefault();
//     const href = link.getAttribute('href');
//     console.log(href);
//     //scroll back to top
//     if (href === '#')
//       window.scrollTo({
//         top: 0,
//         behaviour: 'smooth',
//       });

//     //Scroll to other links
//     if (href !== '#' && href.startsWith('#')) {
//       const sectionEl = document.querySelector(href);
//       sectionEl.scrollIntoView({ behavior: 'smooth' });
//     }

//     //Close mobile navigation
//     if (link.classList.contains('main-nav-link'))
//       headerEl.classList.toggle('nav-open');
//   });
// });
