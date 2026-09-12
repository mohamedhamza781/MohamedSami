// ---------------------------------------------------------------------------
// Central content store for the entire site. Every piece of text, every
// photo and the hero video all live here. `defaultContent` is the
// fallback/reset value; ContentContext persists the live (possibly edited)
// copy to localStorage under STORAGE_KEY so admin edits survive a reload.
//
// Images/video are stored as data-URLs (base64) once uploaded from the
// Admin Dashboard — there is no backend/file storage in this project, so
// the browser's localStorage is the only persistence available. Keep
// uploads modest in size (a few hundred KB each) since localStorage is
// capped at a few MB per site by the browser.
// ---------------------------------------------------------------------------

export const STORAGE_KEY = "varelle_content_v1";

export const defaultContent = {
  brand: {
    name: "VARELLE",
    footerTagline: "Editorial wedding photography",
  },
  hero: {
    tagline: "For weddings with a point of view.",
    image: "",
    video: "",
  },
  approach: {
    statement: "Quietly documenting the moments that deserve to be remembered.",
    description:
      "We work quietly and stay close to the day as it actually happens — light moving through a hallway, a hand adjusting a sleeve, the long pause before anyone arrives. The result is a considered edit rather than a catalogue: fewer images, chosen carefully, that hold together as one piece of work.",
  },
  work: {
    title: "Recent stories",
    description:
      "We hand over fewer photographs than most studios. What stays is what lasts — the frames that will still mean something a year later, graded together as one body of work rather than one long day.",
    feature: { title: "Elena & Luca", meta: "LAKE COMO · 2026 · WEDDING", image: "" },
    items: [
      { title: "Sofia & Adrien", meta: "PARIS · 2026 · ENGAGEMENT", image: "" },
      { title: "Maya & Theo", meta: "MALLORCA · 2025 · DESTINATION WEDDING", image: "" },
      { title: "Clara & Julien", meta: "PROVENCE · 2025 · PRE-WEDDING", image: "" },
      { title: "Inés & Rafael", meta: "LISBON · 2025 · WEDDING", image: "" },
    ],
  },
  pullQuote: {
    text: "The beauty is often in what happens between the moments.",
    caption: "Elena & Luca · Lake Como, 2026",
    image: "",
  },
  services: {
    title: "A considered approach from first frame to final image.",
    items: [
      { n: "01", title: "Wedding coverage", copy: "Full-day documentation with an editorial approach.", image: "" },
      { n: "02", title: "Couple portraits", copy: "Intimate portraits with a natural, cinematic direction.", image: "" },
      { n: "03", title: "Pre-wedding", copy: "Location-driven photography for couples who want something personal.", image: "" },
      { n: "04", title: "Film & digital", copy: "A considered combination of digital photographs and analog-inspired imagery.", image: "" },
    ],
  },
  process: {
    title: "From the first message to the final gallery.",
    items: [
      { n: "01", title: "Enquiry", copy: "You write, we talk. A short call to hear the plan, the place, and what matters to you." },
      { n: "02", title: "Planning", copy: "A loose timeline built the right way — structure without ever feeling scripted." },
      { n: "03", title: "The day", copy: "Full presence, minimal direction. We stay close to the moment and out of the way of it." },
      { n: "04", title: "The edit", copy: "A considered selection, hand-graded to one body of work, delivered within weeks." },
    ],
  },
  momentBand: {
    caption: "Moments, not poses.",
    image: "",
  },
  profile: {
    sectionLabel: "05 / The studio",
    title: "Photography with restraint, intention and a little imperfection.",
    paragraphs: [
      "Varelle is an independent photography studio documenting weddings across Europe and beyond. The work is shaped by editorial composition, natural movement and an appreciation for the details that make each story different.",
      "The studio is led by Mara Vestergaard, who has photographed weddings since 2016 across Europe, the Atlantic coast and North Africa. Every wedding is photographed personally; a second photographer joins for larger days, and the edit is never handed off.",
    ],
    image: "",
    imageCaption: "MARA VESTERGAARD — FOUNDER & LEAD PHOTOGRAPHER",
    stats: [
      { label: "Founded", value: "2016" },
      { label: "Weddings", value: "140+" },
      { label: "Countries", value: "19" },
      { label: "Based in", value: "Berlin, Germany" },
      { label: "Available", value: "Worldwide" },
      { label: "Languages", value: "DE / EN / FR" },
    ],
    linkLabel: "MORE ABOUT VARELLE",
  },
  testimonial: {
    text: "Every image felt honest, effortless and completely ours.",
    name: "Elena & Luca",
    meta: "Lake Como, 2026",
  },
  filmstrip: {
    note: "Frames that never became a story of their own",
    images: ["", "", "", "", "", "", ""],
  },
  closing: {
    tagline: "Available for selected weddings in Europe and worldwide.",
    image: "",
  },
  contact: {
    email: "hello@varelle.studio",
    location: "Berlin / Germany",
    region: "Europe / Worldwide",
    instagram: "https://instagram.com/varelle.studio",
    pinterest: "https://pinterest.com/varelle.studio",
  },
};