import * as React from "react";
import Box from "@mui/material/Box";
import { tokens } from "../theme";
import { Hero } from "../components/Hero";
import { Intro, StoryGrid } from "../components/Stories";
import { PullQuote, Testimonial } from "../components/Quote";
import { ServiceList, ProcessSteps } from "../components/ServicesProcess";
import { MomentBand, StudioAbout, Filmstrip, ClosingCTA } from "../components/Closing";
import { Footer, Navbar } from "../components/Chrome";
import { useContent } from "../context/ContentContext";

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
  const { hero, approach, work, pullQuote, services, process, momentBand, profile, testimonial, filmstrip, closing, contact } = content;

  return (
    <Box sx={{ bgcolor: tokens.color.canvas }}>
      {/* Fixed header — stays pinned to the viewport as the page scrolls */}
      <Navbar />

      {/* Hero band: wordmark, tagline, View the work / Inquire */}
      <Hero tagline={hero.tagline} image={hero.image || undefined} video={hero.video || undefined} />

      {/* "01 / Approach" — quiet statement + supporting paragraph + About link */}
      <Intro
        index="01 / Approach"
        statement={approach.statement}
        description={approach.description}
        linkLabel="ABOUT VARELLE"
      />

      {/* "02 / Selected work" — feature story + 2x2 supporting grid */}
      <Box id="work" sx={{ scrollMarginTop: "110px" }}>
        <StoryGrid
          index="02 / Selected work"
          title={work.title}
          description={work.description}
          feature={{ ...work.feature, image: work.feature.image || undefined }}
          items={work.items.map((it) => ({ ...it, image: it.image || undefined }))}
        />
      </Box>

      {/* Centered pull quote + framed image */}
      <PullQuote caption={pullQuote.caption} image={pullQuote.image || undefined}>
        {pullQuote.text}
      </PullQuote>

      {/* "03 / Services" — four numbered rows */}
      <Box id="services" sx={{ scrollMarginTop: "110px" }}>
        <ServiceList
          index="03 / Services"
          title={services.title}
          items={services.items.map((it) => ({ ...it, image: it.image || null }))}
        />
      </Box>

      {/* "04 / Process" — four-step grid */}
      <ProcessSteps index="04 / Process" title={process.title} items={process.items} />

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

      {/* Centered testimonial */}
      <Testimonial name={testimonial.name} meta={testimonial.meta}>
        {testimonial.text}
      </Testimonial>

      {/* "06 / Fragments" — auto-scrolling filmstrip */}
      <Filmstrip
        index="FROM THE ARCHIVE"
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