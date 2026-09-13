// ---------------------------------------------------------------------------
// Central content store for the entire site, in two languages. Every piece
// of text, every photo and the hero video live here. `defaultContent` is
// the blank starting template for BOTH languages — it ships with NO
// placeholder/fake content on purpose, so a fresh deploy starts empty and
// the real owner fills everything in from the Admin Dashboard (which has
// its own EN/AR toggle to edit each language's copy separately). It's
// also the fallback/reset value: ContentContext persists the live
// (possibly edited) copy to the database so admin edits survive a reload.
//
// NOTE ON MEDIA: images/video/files are stored per-language too (each
// language has its own `image`/`video`/`cvUrl` fields, uploaded
// separately). That's a deliberate simplification — sharing a single
// photo across both languages would need a more complex "shared vs.
// per-language" content shape. The trade-off: if you want the same photo
// in both languages, upload it once while editing English and again while
// editing Arabic.
// ---------------------------------------------------------------------------

function blankSection() {
  return {
    brand: { name: "", footerTagline: "" },
    header: {
      navLinks: [
        { id: "work", label: "" },
        { id: "about", label: "" },
        { id: "services", label: "" },
      ],
      inquireLabel: "",
    },
    hero: {
      tagline: "",
      eyebrow: "",
      scrollLabel: "",
      workCtaLabel: "",
      cvUrl: "",
      cvLabel: "",
      image: "",
      video: "",
    },
    approach: { sectionLabel: "", statement: "", description: "" },
    work: {
      sectionLabel: "",
      title: "",
      description: "",
      driveUrl: "",
      driveLabel: "",
      feature: { title: "", meta: "", image: "" },
      items: [
        { title: "", meta: "", image: "" },
        { title: "", meta: "", image: "" },
        { title: "", meta: "", image: "" },
        { title: "", meta: "", image: "" },
      ],
    },
    pullQuote: { text: "", caption: "", image: "" },
    services: {
      sectionLabel: "",
      title: "",
      items: [
        { n: "01", title: "", copy: "", image: "" },
        { n: "02", title: "", copy: "", image: "" },
        { n: "03", title: "", copy: "", image: "" },
        { n: "04", title: "", copy: "", image: "" },
      ],
    },
    process: {
      sectionLabel: "",
      title: "",
      items: [
        { n: "01", title: "", copy: "" },
        { n: "02", title: "", copy: "" },
        { n: "03", title: "", copy: "" },
        { n: "04", title: "", copy: "" },
      ],
    },
    momentBand: { caption: "", image: "" },
    profile: {
      sectionLabel: "",
      title: "",
      paragraphs: [],
      image: "",
      imageCaption: "",
      stats: [],
      linkLabel: "",
    },
    experience: { sectionLabel: "", title: "", items: [] },
    testimonial: { text: "", name: "", meta: "" },
    filmstrip: { sectionLabel: "", note: "", images: ["", "", "", "", "", "", ""] },
    closing: {
      tagline: "",
      headline: "",
      ctaLabel: "",
      emailLabel: "",
      responseLabel: "",
      responseValue: "",
      enquiriesLabel: "",
      enquiriesValue: "",
      image: "",
    },
    contact: {
      email: "",
      location: "",
      region: "",
      socialLinks: [],
      menuLabel: "",
      socialLabel: "",
      contactLabel: "",
    },
  };
}

const enDefault = blankSection();
enDefault.header.navLinks = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
];
enDefault.header.inquireLabel = "Inquire";
enDefault.hero.scrollLabel = "Scroll";
enDefault.hero.workCtaLabel = "View the work";
enDefault.hero.cvLabel = "Download CV";
enDefault.work.driveLabel = "View full portfolio";
enDefault.approach.sectionLabel = "01 / Approach";
enDefault.work.sectionLabel = "02 / Selected work";
enDefault.services.sectionLabel = "03 / Services";
enDefault.process.sectionLabel = "04 / Process";
enDefault.filmstrip.sectionLabel = "From the archive";
enDefault.contact.menuLabel = "Menu";
enDefault.contact.socialLabel = "Social";
enDefault.contact.contactLabel = "Contact";
enDefault.closing.headline = "Your story,\ndocumented differently.";
enDefault.closing.ctaLabel = "Start a conversation";
enDefault.closing.emailLabel = "Email";
enDefault.closing.responseLabel = "Response";
enDefault.closing.responseValue = "Within two working days";
enDefault.closing.enquiriesLabel = "Enquiries for";
enDefault.closing.enquiriesValue = "2026 & 2027";

const arDefault = blankSection();
arDefault.header.navLinks = [
  { id: "work", label: "أعمالي" },
  { id: "about", label: "عني" },
  { id: "services", label: "خدماتي" },
];
arDefault.header.inquireLabel = "تواصل";
arDefault.hero.scrollLabel = "مرر لتحت";
arDefault.hero.workCtaLabel = "شاهد الأعمال";
arDefault.hero.cvLabel = "تحميل السيرة الذاتية";
arDefault.work.driveLabel = "شاهد كل الأعمال";
arDefault.approach.sectionLabel = "01 / نبذة عني";
arDefault.work.sectionLabel = "02 / أعمال مختارة";
arDefault.services.sectionLabel = "03 / الخدمات";
arDefault.process.sectionLabel = "04 / آلية العمل";
arDefault.filmstrip.sectionLabel = "من الأرشيف";
arDefault.contact.menuLabel = "القائمة";
arDefault.contact.socialLabel = "تواصل اجتماعي";
arDefault.contact.contactLabel = "تواصل معي";
arDefault.closing.headline = "قصتك،\nموثّقة بطريقة مختلفة.";
arDefault.closing.ctaLabel = "ابدأ محادثة";
arDefault.closing.emailLabel = "البريد الإلكتروني";
arDefault.closing.responseLabel = "الرد خلال";
arDefault.closing.responseValue = "يومي عمل";
arDefault.closing.enquiriesLabel = "الحجوزات مفتوحة لـ";
arDefault.closing.enquiriesValue = "2026 و 2027";

export const defaultContent = { en: enDefault, ar: arDefault };