export const HeaderNavigation = () => {
  return [
    {
      title: "Home",
      path: "/",
    },
    {
      title: "Categories",
      path: "/categories",
    },
    {
      title: "Celebrities",
      path: "/celebrities",
    },
    {
      title: "Services",
      path: "/services",
    },
    {
      title: "More",
      subNav: [
        { title: "About Us", path: "/infopages/about-us" },
        { title: "Contact Us", path: "/infopages/contact-us" },
        { title: "Privacy & Policy", path: "/infopages/privacy-policy" },
        {
          title: "Terms & Conditions",
          path: "/infopages/terms-and-conditions",
        },
        { title: "Frequently Ask Questions", path: "/infopages/faqs" },
        { title: "Articles", path: "/infopages/articles" },
        { title: "Gallery", path: "/infopages/gallery" },
      ],
    },
  ];
};

export const FooterNavigation = () => {
  return [
    { title: "About Us", path: "/infopages/about-us" },
    { title: "Contact Us", path: "/infopages/contact-us" },
    { title: "Privacy & Policy", path: "/infopages/privacy-policy" },
    {
      title: "Terms & Conditions",
      path: "/infopages/terms-and-conditions",
    },
  ];
};

export const UserNavigation = () => {
  return [
    {
      title: "Profile",
      path: "/dashboard/profile",
      subpath: "/dashboard/profile/edit",
    },
    {
      title: "Manage Bookings",
      path: "/dashboard/bookings",
      subpath: "/dashboard/bookings/[bookingId]",
    },
    {
      title: "Quotations",
      path: "/dashboard/quotations",
      subpath: "/dashboard/quotations/[quotationId]",
    },
    { title: "Messages", path: "/dashboard/conversation" },
    { title: "Saved Addresses", path: "/dashboard/addresses" },
    {
      title: "Change Password",
      path: "/dashboard/password",
    },
    {
      title: "Notification",
      path: "/dashboard/notification",
    },
    {
      title: "Logout",
      path: "/logout",
    },
  ];
};
