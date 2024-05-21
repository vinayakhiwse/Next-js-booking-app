// Header Search Bar
$(function () {
  const $searchFrom = $(".form-search-outer");
  $(document).mouseup((e) => {
    if (!$searchFrom.is(e.target) && $searchFrom.has(e.target).length === 0) {
      $searchFrom.removeClass("form-search-outer-open");
    }
  });

  $("#btn-search-toggle").on("click", (e) => {
    e.preventDefault();
    $("#search-input").get(0).focus();
    $searchFrom.toggleClass("form-search-outer-open");
    e.preventDefault();
  });

  $(".hamburger").on("click", (e) => {
    e.preventDefault();
    $("#mobile-menu-mt").addClass("show-menu-mt");
  });
  $(".close-menu-mt").on("click", (e) => {
    e.preventDefault();
    $("#mobile-menu-mt").removeClass("show-menu-mt");
  });
});


// artical slider home

// end artical slider

function openNav() {
  document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

function jsTranslate(data) {
  if (locale == "ar" && data["ar"] !== undefined && data["ar"] != "") {
    return data["ar"];
  } else {
    return data["en"];
  }
  return data["en"];
}

function getUsdPrice(price, conversionRate) {
  price = price * conversionRate;
  return price.toFixed(2);
}
