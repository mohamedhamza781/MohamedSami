// ---------------------------------------------------------------------------
// Central content store for the entire site. Every piece of text, every
// photo and the hero video all live here. `defaultContent` is the blank
// starting template — it ships with NO placeholder/fake content on
// purpose, so a fresh deploy starts empty and the real owner fills
// everything in from the Admin Dashboard. It's also the fallback/reset
// value: ContentContext persists the live (possibly edited) copy to the
// database so admin edits survive a reload.
//
// Images/video are stored as public Supabase Storage URLs once uploaded
// from the Admin Dashboard.
// ---------------------------------------------------------------------------

export const defaultContent = {
  brand: {
    name: "",
    footerTagline: "",
  },
  header: {
    navLinks: [
      { id: "work", label: "Work" },
      { id: "about", label: "About" },
      { id: "services", label: "Services" },
    ],
    inquireLabel: "Inquire",
  },
  hero: {
    tagline: "",
    image: "",
    video: "",
  },
  approach: {
    statement: "",
    description: "",
  },
  work: {
    title: "",
    description: "",
    feature: { title: "", meta: "", image: "" },
    items: [
      { title: "", meta: "", image: "" },
      { title: "", meta: "", image: "" },
      { title: "", meta: "", image: "" },
      { title: "", meta: "", image: "" },
    ],
  },
  pullQuote: {
    text: "",
    caption: "",
    image: "",
  },
  services: {
    title: "",
    items: [
      { n: "01", title: "", copy: "", image: "" },
      { n: "02", title: "", copy: "", image: "" },
      { n: "03", title: "", copy: "", image: "" },
      { n: "04", title: "", copy: "", image: "" },
    ],
  },
  process: {
    title: "",
    items: [
      { n: "01", title: "", copy: "" },
      { n: "02", title: "", copy: "" },
      { n: "03", title: "", copy: "" },
      { n: "04", title: "", copy: "" },
    ],
  },
  momentBand: {
    caption: "",
    image: "",
  },
  profile: {
    sectionLabel: "",
    title: "",
    paragraphs: [],
    image: "",
    imageCaption: "",
    stats: [],
    linkLabel: "",
  },
  testimonial: {
    text: "",
    name: "",
    meta: "",
  },
  filmstrip: {
    note: "",
    images: ["", "", "", "", "", "", ""],
  },
  closing: {
    tagline: "",
    image: "",
  },
  contact: {
    email: "",
    location: "",
    region: "",
    instagram: "",
    pinterest: "",
  },
};