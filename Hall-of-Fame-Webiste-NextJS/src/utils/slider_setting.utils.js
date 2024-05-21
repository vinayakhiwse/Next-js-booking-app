const goToNextSlide = (ref) => {
  if (ref.current) {
    ref.current.slickNext();
  }
};
const goToPrevSlide = (ref) => {
  if (ref.current) {
    ref.current.slickPrev();
  }
};

const renderCustomDots = (dots, ref) => {
  if (!dots) {
    return null;
  }
  return (
    <div className="d-flex">
      <div
        className="arrow-left booking-left"
        onClick={() => goToPrevSlide(ref)}
      >
        <img
          src="assets/img/icons/left-arrow.png"
          alt=""
          className="img-fluid"
        />
      </div>
      <div
        className=" arrow-right booking-right"
        onClick={() => goToNextSlide(ref)}
      >
        <img
          src="assets/img/icons/right-arrow.png"
          alt=""
          className="img-fluid"
        />
      </div>
    </div>
  );
};

export const Celebritiessettings = (ref) => {
  return {
    dots: false,
    rows: 2,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode: false,
    arrows: false,
    dots: true,
    swipeToSlide: true,
    appendDots: (dots) => renderCustomDots(dots, ref),
    dotsClass: "arrows d-flex align-items-center justify-content-center",
    infinite: false,
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
};

export const Servicessettings = (ref) => {
  return {
    dots: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: false,
    arrows: false,
    dots: true,
    swipeToSlide: true,
    appendDots: (dots) => renderCustomDots(dots, ref),
    dotsClass: "arrows d-flex align-items-center justify-content-center",
    infinite: false,
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
};

export const SlotSettings = (ref) => {
  return {
    slidesToShow: 7,
    slidesToScroll: 7,
    swipeToSlide: true,
    focusOnSelect: true,
    infinite: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
    ],
    prevArrow: (
      <>
        <div
          className="arrows-cal left-day slick-arrow"
          onClick={() => ref.current.slickPrev()}
        >
          <i className="fas fa-angle-left"></i>
        </div>
      </>
    ),
    nextArrow: (
      <>
        <div
          className="arrows-cal right-day slick-arrow"
          onClick={() => ref.current.slickNext()}
        >
          <i className="fas fa-angle-right"></i>
        </div>
      </>
    ),
  };
};
