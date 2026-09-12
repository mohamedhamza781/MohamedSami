import * as React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { tokens } from "../theme";
import { Hero } from "../components/Hero";
import { Intro, StoryGrid } from "../components/Stories";
import { PullQuote, Testimonial } from "../components/Quote";
import { ServiceList, ProcessSteps } from "../components/ServicesProcess";
import { MomentBand, StudioAbout, Filmstrip, ClosingCTA } from "../components/Closing";
import { ExperienceList } from "../components/Experience";
import { Footer, Navbar } from "../components/Chrome";
import { useContent } from "../context/ContentContext";
import { useLanguage } from "../context/LanguageContext";

// ---------------------------------------------------------------------------
// This mirrors, section by section, every block in the reference screenshot.
// Every piece of text, every photo (and the hero video) is driven from
// ContentContext, which the Admin Dashboard writes to — so this page always
// reflects whatever was last saved in /admin, with no hard-coded copy left
// anywhere on the page.
//
// `id="work"`, `id="about"`, `id="services"` and `id="inquire"` are the
// anchors the header and footer navigation scroll to.
// ---------------------------------------------------------------------------

export default function Home() {
  const { content } = useContent();
  const { direction } = useLanguage();
  const arrow = direction === "rtl" ? "←" : "→";
  const { hero, approach, work, pullQuote, services, process, momentBand, profile, experience, testimonial, filmstrip, closing, contact } = content;

  return (
    <Box sx={{ bgcolor: tokens.color.canvas }}>
      {/* Fixed header — stays pinned to the viewport as the page scrolls */}
      <Navbar />

      {/* Hero band: wordmark, tagline, View the work / Inquire */}
      <Hero
        brand={content.brand.name}
        eyebrow={hero.eyebrow}
        tagline={hero.tagline}
        region={contact.region}
        scrollLabel={hero.scrollLabel}
        workCtaLabel={hero.workCtaLabel}
        inquireLabel={content.header.inquireLabel}
        cvUrl={hero.cvUrl || undefined}
        cvLabel={hero.cvLabel}
        image={hero.image || undefined}
        video={hero.video || undefined}
      />

      {/* "01 / Approach" — quiet statement + supporting paragraph + About link */}
      <Intro
        index={approach.sectionLabel}
        statement={approach.statement}
        description={approach.description}
        linkLabel={content.brand.name ? `About ${content.brand.name}`.toUpperCase() : "ABOUT"}
      />

      {/* "02 / Selected work" — feature story + 2x2 supporting grid */}
      <Box id="work" sx={{ scrollMarginTop: "110px" }}>
        <StoryGrid
          index={work.sectionLabel}
          title={work.title}
          description={work.description}
          feature={{ ...work.feature, image: work.feature.image || undefined }}
          items={work.items.map((it) => ({ ...it, image: it.image || undefined }))}
        />
        {work.driveUrl && (
          <Box sx={{ maxWidth: "xxl", mx: "auto", px: { xs: 3, md: 5 }, mt: -2, mb: 4 }}>
            <Link
              href={work.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: 12,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                color: tokens.color.primary,
                borderBottom: `1px solid ${tokens.color.primary}`,
                pb: "4px",
              }}
            >
              {work.driveLabel} {arrow}
            </Link>
          </Box>
        )}
      </Box>

      {/* Centered pull quote + framed image */}
      <PullQuote caption={pullQuote.caption} image={pullQuote.image || undefined}>
        {pullQuote.text}
      </PullQuote>

      {/* "03 / Services" — four numbered rows */}
      <Box id="services" sx={{ scrollMarginTop: "110px" }}>
        <ServiceList
          index={services.sectionLabel}
          title={services.title}
          items={services.items.map((it) => ({ ...it, image: it.image || null }))}
        />
      </Box>

      {/* "04 / Process" — four-step grid */}
      <ProcessSteps index={process.sectionLabel} title={process.title} items={process.items} />

      {/* Full-bleed dark moment band */}
      <MomentBand caption={momentBand.caption} image={momentBand.image || undefined} />

      {/* "05 / The studio" — this IS the profile section, fully admin-editable */}
      <Box id="about" sx={{ scrollMarginTop: "110px" }}>
        <StudioAbout
          index={profile.sectionLabel}
          title={profile.title}
          paragraphs={profile.paragraphs}
          image={profile.image || undefined}
          imageCaption={profile.imageCaption}
          stats={profile.stats}
          linkLabel={profile.linkLabel}
        />
      </Box>

      {/* Work history — only renders if at least one entry is added */}
      <ExperienceList index={experience.sectionLabel} title={experience.title} items={experience.items} />

      {/* Centered testimonial */}
      <Testimonial name={testimonial.name} meta={testimonial.meta}>
        {testimonial.text}
      </Testimonial>

      {/* "06 / Fragments" — auto-scrolling filmstrip */}
      <Filmstrip
        index={filmstrip.sectionLabel}
        note={filmstrip.note}
        images={filmstrip.images.map((src) => src || null)}
      />

      {/* Closing statement + CTA */}
      <Box id="inquire" sx={{ scrollMarginTop: "110px" }}>
        <ClosingCTA
          tagline={closing.tagline}
          image={closing.image || undefined}
          meta={[
            { label: "Email", value: contact.email },
            { label: "Response", value: "Within two working days" },
            { label: "Enquiries for", value: "2026 & 2027" },
          ]}
        >
          Your story,
          <br />
          documented differently.
        </ClosingCTA>
      </Box>

      {/* Light-inverted footer */}
      <Footer />
    </Box>
  );
}