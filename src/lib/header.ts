export const HEADER_LINKS = [
  { label: "Shop", href: "/shop", dropdowns: false },
  { label: "Collections", href: "/collections", dropdowns: false },
  {
    label: "Features",
    dropdowns: true,
    items: [
      { text: "Grand 6", href: "/piano/grand-6" },
      { text: "Digital Piano", href: "/piano/digital-piano" },
      { text: "Upright 4", href: "/piano/upright-4" },
      { text: "Digital 5", href: "/piano/digital-5" },
    ],
  },
  {
    label: "Resources",
    dropdowns: true,
    items: [
      { text: "Piano Guides", href: "/resources/piano-guides" },
      { text: "Comparison Charts", href: "/resources/comparisons" },
      { text: "FAQs", href: "/resources/faqs" },
      { text: "Documentation", href: "/help/docs", isExternal: true },
    ],
  },
  { label: "About", href: "/about", dropdowns: false },
  { label: "Contact", href: "/contact", dropdowns: false },
];
