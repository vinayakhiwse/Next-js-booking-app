export const PageNameAndRoute = [
  {
    path: "/",
    title: "Home",
  },
  {
    path: "/categories",
    title: "Categories",
  },
  {
    title: "Celebrities",
    path: "/celebrities",
  },
  {
    title: "Subscription",
    path: "/dashboard/subscription-packages",
  },
  {
    title: "Subscription",
    path: "/subscription",
  },
  {
    title: "Celebrity Detail",
    path: "/celebrities/[celebrityId]",
    Parent: "Celebrities",
    ParentPath: "/celebrities",
  },
  {
    path: "/services",
    title: "Services",
  },
  {
    path: "/services/[serviceId]",
    title: "Service Detail",
    Parent: "Services",
    ParentPath: "/services",
  },
  {
    path: "/services/[serviceId]/[bookingtype]",
    title: "Availability Slots",
  },
  {
    path: "/auth/login",
    title: "Login/Sign up",
  },
  {
    path: "/auth/registration",
    title: "Register",
  },
  {
    path: "/auth/registration/user",
    title: "Register As a User",
  },
  {
    path: "/auth/registration/celebrity",
    title: "Register As a Celebrity",
  },
  {
    path: "/auth/verification",
    title: "Email Verification Code",
  },
  {
    path: "/auth/forgotpass",
    title: "Forgot Password",
  },
  {
    path: "/dashboard/profile/edit",
    title: "Edit Profile",
    Parent: "Profile",
    ParentPath: "/dashboard/profile",
  },
  {
    path: "/dashboard/bookings",
    title: "My Bookings",
  },
  {
    path: "/dashboard/bookings/[bookingId]",
    title: "My Bookings",
  },
  {
    path: "/dashboard/services",
    title: "Manage Services",
  },
  {
    path: "/dashboard/services/[editId]",
    title: "Manage Services",
  },
  {
    path: "/dashboard/availability-slots",
    title: "Edit Slots",
  },
  {
    path: "/dashboard/quotations",
    title: "Quotations",
  },
  {
    path: "/dashboard/quotations/[quotationId]",
    title: "Quotation detail",
    Parent: "Quotations",
    ParentPath: "/dashboard/quotations",
  },
  {
    path: "/dashboard/reviews",
    title: "Rating & Reviews",
  },
  {
    path: "/dashboard/payment_profile",
    title: "Payment Info",
  },
  {
    path: "/dashboard/notification",
    title: "Notifications",
  },
  {
    path: "/dashboard/password",
    title: "Change Password",
  },
  {
    path: "/dashboard/addresses",
    title: "Saved addresses",
  },
  {
    path: "/dashboard/profile",
    title: "Profile",
  },
  {
    path: "/categories/sub-categories/[categoryId]",
    title: "Sub Categories",
    Parent: "Categories",
    ParentPath: "/categories",
  },
  {
    path: "/articles/[articleid]",
    title: "Articles",
  },
  {
    path: "/infopages/about-us",
    title: "About Us",
  },
  {
    path: "/infopages/contact-us",
    title: "Contact Us",
  },
  {
    path: "/infopages/privacy-policy",
    title: "Privacy Policy",
  },
  {
    path: "/infopages/terms-and-conditions",
    title: "Terms and Conditions",
  },
  {
    path: "/infopages/faqs",
    title: "FAQ's",
  },
  {
    path: "/infopages/gallery",
    title: "Image Gallery",
  },
  {
    path: "/infopages/articles",
    title: "Articles",
  },
  {
    path: "/infopages/articles/[articleId]",
    title: "Article Detail",
    Parent: "Articles",
    ParentPath: "/infopages/articles",
  },
  {
    path: "quotation",
    title: "Ask for Quotation",
  },
  {
    path: "booking",
    title: "Booking",
  },
  {
    path: "/dashboard/conversation",
    title: "Messages",
  },
];
