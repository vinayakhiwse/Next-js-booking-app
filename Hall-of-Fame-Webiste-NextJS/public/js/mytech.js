function openNav() {
  document.getElementById("mySidenav").style.transform = "translateX(-10%)";
  // document("body").style.overflow = "hidden";
  document.body.style.overflow = "hidden";
}


function closeNav() {
  document.getElementById("mySidenav").style.transform = "translateX(-110%)";
  document.body.style.overflow = "auto";
}

if ($("body").hasClass("rtl")) {
  function openNav() {
    document.getElementById("mySidenav").style.transform = "translateX(10%)";
    document.body.style.overflow = "hidden";
  }
  function closeNav() {
    document.getElementById("mySidenav").style.transform = "translateX(110%)";
    document.body.style.overflow = "auto";
  }
}

// $(document).ready(function () {
//   $('.js-example-basic-single').select2();
// });

// stars select js

$("body").on('click', '.xyz', function () {
  $(this).prev().prop("checked", true);
  that.form.form.patchValue({ rating: $(this).prev().val() }, { emitEvent: true, onlySelf: false });
  mtValidationBuilder.controlValueChanged('rating', $(this).prev().val());
});

// review block show code

$(".write-review-block").hide();

$('.rate-btn').click(function () {  
  $(".write-review-block").show();
  $(this).hide();
});

// Load more reviews

$(document).ready(function () {
  $('#reviews .rewiew-row').hide();
  $('#reviews .rewiew-row').slice(0, 4).show();
  $(".load-more-btn").click(function () {
    $('#reviews .rewiew-row:hidden').slice(0, 4).show();
    // $(this).hide();
  });
});

