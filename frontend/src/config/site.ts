export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Vite + NextUI",
  description: "Make beautiful websites regardless of your design experience.",

  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Cafes",
      href: "/cafes",
    },
    {
      label: "Employees",
      href: "/employees",
    },
  ],

  navMenuItems: [
    // Adding more specific cafe-related actions
    {
      label: "Cafes",
      href: "/cafes",
    },
    {
      label: "Employees",
      href: "/employees",
    },
    {
      label: "Add Cafe",
      href: "/cafes/add",
    },
    {
      label: "Add Employee",
      href: "/employees/add",
    },
  ],

  links: {
    github:
      "https://github.com/itstrueitstrueitsrealitsreal/cafe-management-system",
  },
};
