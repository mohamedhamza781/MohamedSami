# Varelle — Design System (React + MUI)

مش صفحة موقع، دي مكتبة/سيستم مكوّنات قابلة لإعادة الاستخدام، مبنية بالكامل على
الـ tokens اللي استخرجناها (ألوان، خطوط، spacing، gradients) بدون أي صور.

## هيكل الملفات
```
varelle-system/
└── src/
    ├── theme.js              # كل الـ tokens: ألوان، خطوط، breakpoints، gradients
    ├── components/
    │   ├── Typography.jsx    # Eyebrow, Display, Body, Caption
    │   ├── Button.jsx        # PillButton, TextLink
    │   ├── Layout.jsx        # Section, Rule, ColorSwatch
    │   └── Chrome.jsx        # Navbar, Footer
    ├── index.js               # barrel export لكل السيستم
    ├── StyleGuide.jsx         # صفحة عرض تفاعلية لكل التوكنز والمكونات (بدون صور)
    └── index.jsx              # نقطة تشغيل الـ StyleGuide
```

## التشغيل
```bash
npm install
npm run dev
```

هيفتح صفحة `StyleGuide` اللي بتعرض:
- الـ palette كاملة (canvas / primary / body / muted / link / black)
- الـ type scale (display lg/md/sm, body, eyebrow, caption)
- سلم الـ spacing (8px → 44px) كأشرطة مقاسة فعليًا
- الأربع gradients المقاسة من الموقع الأصلي
- المكونات: PillButton, TextLink, Navbar, Footer

## كل قسم في الصورة الأصلية — وين بنيته بالكود

| القسم في الصورة | المكوّن | الملف |
|---|---|---|
| الناف بار (VARELLE / WORK / ABOUT / SERVICES / INQUIRE) | `Navbar` | `components/Chrome.jsx` |
| الهيرو (VARELLE + الخلفية + "For weddings with a point of view") | `Hero` | `components/Hero.jsx` |
| "01/Approach — Quietly documenting..." | `Intro` | `components/Stories.jsx` |
| "02/Selected work — Recent stories" + صورة Elena & Luca الكبيرة | `StoryGrid` (يحتوي `StoryCard`) | `components/Stories.jsx` |
| شبكة الـ 2×2 (Sofia & Adrien, Maya & Theo, Clara & Julien, Inés & Rafael) | داخل نفس `StoryGrid` (`items`) | `components/Stories.jsx` |
| الاقتباس الوسطي "The beauty is often in..." + الصورة | `PullQuote` | `components/Quote.jsx` |
| "03/Services — A considered approach..." + 4 صفوف الخدمات | `ServiceList` | `components/ServicesProcess.jsx` |
| "04/Process — From the first message..." + 4 خطوات | `ProcessSteps` | `components/ServicesProcess.jsx` |
| شريط الصورة الداكن "Moments, not poses" | `MomentBand` | `components/Closing.jsx` |
| "05/The studio" (صورة + نص + Based in/Available/Weddings per year) | `StudioAbout` | `components/Closing.jsx` |
| اقتباس العميل "Every image felt honest..." | `Testimonial` | `components/Quote.jsx` |
| شريط الصور الخمسة (filmstrip) | `Filmstrip` | `components/Closing.jsx` |
| "YOUR STORY, DOCUMENTED DIFFERENTLY." + زر | `ClosingCTA` | `components/Closing.jsx` |
| الفوتر (VARELLE / MENU / FOLLOW / GET IN TOUCH) | `Footer` | `components/Chrome.jsx` |

كل الأقسام مجمّعة فعليًا في `App.jsx` بنفس ترتيبها ونفس النصوص اللي في الصورة.
مفيش صور حقيقية أو stock — كل مكان فيه صورة بيطلع `ImagePlaceholder` (مربع
بخطوط قطرية خفيفة) لحد ما تحط صورة حقيقية عن طريق prop اسمها `image` أو `src`.

## نقطتا التشغيل
- `npm run dev` ثم افتح `/index.html` → الصفحة الكاملة (`App.jsx`) بكل الأقسام أعلاه.
- افتح `/styleguide.html` → صفحة التوكنز والمكونات المجرّدة (`StyleGuide.jsx`)
  بدون أي محتوى/تخطيط صفحة، فقط الألوان والخطوط والـ spacing والأزرار.

## استخدام السيستم في مشروعك
```jsx
import { theme, tokens, Eyebrow, Display, Body,
         PillButton, TextLink, Section, Navbar, Footer } from "./src";

function Page() {
  return (
    <Section>
      <Eyebrow>01 / Intro</Eyebrow>
      <Display size="md">عنوان القسم</Display>
      <Body>نص وصفي هنا.</Body>
      <PillButton>Inquire</PillButton>
    </Section>
  );
}
```

كل مكون مبني على الـ tokens مباشرة — تغيير أي لون أو مسافة بيصير من `theme.js`
فقط وبينعكس على كل السيستم.
