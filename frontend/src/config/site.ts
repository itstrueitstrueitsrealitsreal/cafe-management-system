export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Café Management System",
  description: "Managé your Cafés and employees with ease",

  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Cafés",
      href: "/cafes",
    },
    {
      label: "Employees",
      href: "/employees",
    },
  ],

  navMenuItems: [
    // Adding more specific café-related actions
    {
      label: "Cafés",
      href: "/cafes",
    },
    {
      label: "Employees",
      href: "/employees",
    },
    {
      label: "Add Café",
      href: "/cafes/new",
    },
    {
      label: "Add Employee",
      href: "/employees/new",
    },
  ],

  links: {
    github:
      "https://github.com/itstrueitstrueitsrealitsreal/cafe-management-system",
  },
};
