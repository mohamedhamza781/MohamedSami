import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Link from "@mui/material/Link";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import { tokens } from "../theme";
import { Eyebrow, Display, Body, Caption } from "../components/Typography";
import { PillButton, TextLink } from "../components/Button";
import { Rule } from "../components/Layout";
import { MediaUploadField } from "../components/MediaUploadField";
import { useContent } from "../context/ContentContext";
import { useAuth } from "../context/AuthContext";

const fieldSx = { "& .MuiInput-root": { fontSize: 15 } };

function DashboardSection({ title, subtitle, defaultExpanded = false, children }) {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters
      elevation={0}
      square
      sx={{ bgcolor: "transparent", border: "none", "&:before": { display: "none" } }}
    >
      <AccordionSummary
        sx={{
          px: 0,
          py: 2,
          minHeight: "auto",
          "& .MuiAccordionSummary-content": { my: 0, alignItems: "center", justifyContent: "space-between" },
        }}
      >
        <Box>
          <Box sx={{ fontSize: 20, color: tokens.color.primary }}>{title}</Box>
          {subtitle && <Caption sx={{ display: "block", mt: 0.5 }}>{subtitle}</Caption>}
        </Box>
        <Box sx={{ fontSize: 20, color: tokens.color.muted, lineHeight: 1 }}>＋</Box>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0, pb: 5 }}>{children}</AccordionDetails>
    </Accordion>
  );
}

function ItemCard({ children, onRemove }) {
  return (
    <Box sx={{ border: "1px solid rgba(25,25,23,0.12)", p: 2.5, mb: 2, position: "relative" }}>
      {onRemove && (
        <IconButton
          size="small"
          onClick={onRemove}
          aria-label="Remove"
          sx={{ position: "absolute", top: 6, right: 6, color: tokens.color.muted }}
        >
          ✕
        </IconButton>
      )}
      {children}
    </Box>
  );
}

function SaveButton({ onClick, children = "Save" }) {
  return (
    <Box>
      <PillButton variant="filled" onClick={onClick}>
        {children}
      </PillButton>
    </Box>
  );
}

export default function AdminDashboard() {
  const { loading } = useContent();

  // Every field below seeds its state from `content` exactly once, at
  // mount, via useState(content.xxx) — that's normal for an editable form,
  // but it means the whole dashboard must not mount until the real content
  // has actually finished loading from the database. Mounting it early
  // (while `content` is still the blank placeholder) would seed every
  // field with blank values, and clicking Save on any section would then
  // silently overwrite the real, already-saved data with those blanks.
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: tokens.color.canvas,
          color: tokens.color.muted,
          fontSize: 13,
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        Loading current content…
      </Box>
    );
  }

  return <DashboardForm />;
}

function DashboardForm() {
  const { content, updateContent, resetContent, storageError } = useContent();
  const { logout, changePassword, changeEmail, userEmail } = useAuth();
  const [toast, setToast] = React.useState("");

  React.useEffect(() => {
    if (storageError) setToast(storageError);
  }, [storageError]);

  function announce(msg) {
    setToast(msg);
  }

  // ---- Brand & footer ----
  const [brandName, setBrandName] = React.useState(content.brand.name);
  const [footerTagline, setFooterTagline] = React.useState(content.brand.footerTagline);
  async function saveBrand() {
    await updateContent({ brand: { name: brandName, footerTagline } });
    announce("Brand & footer saved");
  }

  // ---- Header (navbar) ----
  const [navLinks, setNavLinks] = React.useState(content.header.navLinks);
  const [inquireLabel, setInquireLabel] = React.useState(content.header.inquireLabel);
  function updateNavLinkLabel(i, label) {
    setNavLinks((prev) => prev.map((l, idx) => (idx === i ? { ...l, label } : l)));
  }
  async function saveHeader() {
    await updateContent({ header: { navLinks, inquireLabel } });
    announce("Header saved");
  }

  // ---- Hero ----
  const [heroTagline, setHeroTagline] = React.useState(content.hero.tagline);
  const [heroEyebrow, setHeroEyebrow] = React.useState(content.hero.eyebrow);
  const [heroScrollLabel, setHeroScrollLabel] = React.useState(content.hero.scrollLabel);
  const [heroWorkCtaLabel, setHeroWorkCtaLabel] = React.useState(content.hero.workCtaLabel);
  const [heroCvUrl, setHeroCvUrl] = React.useState(content.hero.cvUrl);
  const [heroCvLabel, setHeroCvLabel] = React.useState(content.hero.cvLabel);
  const [heroImage, setHeroImage] = React.useState(content.hero.image);
  const [heroVideo, setHeroVideo] = React.useState(content.hero.video);
  async function saveHero() {
    await updateContent({
      hero: {
        tagline: heroTagline,
        eyebrow: heroEyebrow,
        scrollLabel: heroScrollLabel,
        workCtaLabel: heroWorkCtaLabel,
        cvUrl: heroCvUrl,
        cvLabel: heroCvLabel,
        image: heroImage,
        video: heroVideo,
      },
    });
    announce("Hero saved");
  }

  // ---- Approach ----
  const [statement, setStatement] = React.useState(content.approach.statement);
  const [description, setDescription] = React.useState(content.approach.description);
  async function saveApproach() {
    await updateContent({ approach: { statement, description } });
    announce("Approach section saved");
  }

  // ---- Work / portfolio ----
  const [workTitle, setWorkTitle] = React.useState(content.work.title);
  const [workDescription, setWorkDescription] = React.useState(content.work.description);
  const [workDriveUrl, setWorkDriveUrl] = React.useState(content.work.driveUrl);
  const [workDriveLabel, setWorkDriveLabel] = React.useState(content.work.driveLabel);
  const [feature, setFeature] = React.useState(content.work.feature);
  const [workItems, setWorkItems] = React.useState(content.work.items);
  function updateWorkItem(i, next) {
    setWorkItems((prev) => prev.map((it, idx) => (idx === i ? next : it)));
  }
  function removeWorkItem(i) {
    setWorkItems((prev) => prev.filter((_, idx) => idx !== i));
  }
  function addWorkItem() {
    setWorkItems((prev) => [...prev, { title: "New story", meta: "LOCATION · YEAR · TYPE", image: "" }]);
  }
  async function saveWork() {
    await updateContent({
      work: {
        title: workTitle,
        description: workDescription,
        driveUrl: workDriveUrl,
        driveLabel: workDriveLabel,
        feature,
        items: workItems,
      },
    });
    announce("Work / portfolio saved");
  }

  // ---- Pull quote ----
  const [quoteText, setQuoteText] = React.useState(content.pullQuote.text);
  const [quoteCaption, setQuoteCaption] = React.useState(content.pullQuote.caption);
  const [quoteImage, setQuoteImage] = React.useState(content.pullQuote.image);
  async function savePullQuote() {
    await updateContent({ pullQuote: { text: quoteText, caption: quoteCaption, image: quoteImage } });
    announce("Pull quote saved");
  }

  // ---- Services ----
  const [servicesTitle, setServicesTitle] = React.useState(content.services.title);
  const [serviceItems, setServiceItems] = React.useState(content.services.items);
  function updateServiceItem(i, next) {
    setServiceItems((prev) => prev.map((it, idx) => (idx === i ? next : it)));
  }
  function removeServiceItem(i) {
    setServiceItems((prev) => prev.filter((_, idx) => idx !== i));
  }
  function addServiceItem() {
    setServiceItems((prev) => [
      ...prev,
      { n: String(prev.length + 1).padStart(2, "0"), title: "New service", copy: "", image: "" },
    ]);
  }
  async function saveServices() {
    await updateContent({ services: { title: servicesTitle, items: serviceItems } });
    announce("Services saved");
  }

  // ---- Process ----
  const [processTitle, setProcessTitle] = React.useState(content.process.title);
  const [processItems, setProcessItems] = React.useState(content.process.items);
  function updateProcessItem(i, next) {
    setProcessItems((prev) => prev.map((it, idx) => (idx === i ? next : it)));
  }
  function removeProcessItem(i) {
    setProcessItems((prev) => prev.filter((_, idx) => idx !== i));
  }
  function addProcessItem() {
    setProcessItems((prev) => [...prev, { n: String(prev.length + 1).padStart(2, "0"), title: "New step", copy: "" }]);
  }
  async function saveProcess() {
    await updateContent({ process: { title: processTitle, items: processItems } });
    announce("Process saved");
  }

  // ---- Moment band ----
  const [momentCaption, setMomentCaption] = React.useState(content.momentBand.caption);
  const [momentImage, setMomentImage] = React.useState(content.momentBand.image);
  async function saveMoment() {
    await updateContent({ momentBand: { caption: momentCaption, image: momentImage } });
    announce("Moment band saved");
  }

  // ---- Profile / Studio ----
  const [profileSectionLabel, setProfileSectionLabel] = React.useState(content.profile.sectionLabel);
  const [profileTitle, setProfileTitle] = React.useState(content.profile.title);
  const [profileParagraphs, setProfileParagraphs] = React.useState(content.profile.paragraphs.join("\n\n"));
  const [profileImage, setProfileImage] = React.useState(content.profile.image);
  const [profileImageCaption, setProfileImageCaption] = React.useState(content.profile.imageCaption);
  const [profileStats, setProfileStats] = React.useState(content.profile.stats);
  const [profileLinkLabel, setProfileLinkLabel] = React.useState(content.profile.linkLabel);
  function updateStat(i, next) {
    setProfileStats((prev) => prev.map((s, idx) => (idx === i ? next : s)));
  }
  function removeStat(i) {
    setProfileStats((prev) => prev.filter((_, idx) => idx !== i));
  }
  function addStat() {
    setProfileStats((prev) => [...prev, { label: "New stat", value: "" }]);
  }
  async function saveProfile() {
    await updateContent({
      profile: {
        sectionLabel: profileSectionLabel,
        title: profileTitle,
        paragraphs: profileParagraphs.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
        image: profileImage,
        imageCaption: profileImageCaption,
        stats: profileStats,
        linkLabel: profileLinkLabel,
      },
    });
    announce("Profile section saved");
  }

  // ---- Testimonial ----
  const [testimonialText, setTestimonialText] = React.useState(content.testimonial.text);
  const [testimonialName, setTestimonialName] = React.useState(content.testimonial.name);
  const [testimonialMeta, setTestimonialMeta] = React.useState(content.testimonial.meta);
  async function saveTestimonial() {
    await updateContent({ testimonial: { text: testimonialText, name: testimonialName, meta: testimonialMeta } });
    announce("Testimonial saved");
  }

  // ---- Filmstrip ----
  const [filmstripNote, setFilmstripNote] = React.useState(content.filmstrip.note);
  const [filmstripImages, setFilmstripImages] = React.useState(content.filmstrip.images);
  function updateFilmstripImage(i, next) {
    setFilmstripImages((prev) => prev.map((img, idx) => (idx === i ? next : img)));
  }
  function removeFilmstripImage(i) {
    setFilmstripImages((prev) => prev.filter((_, idx) => idx !== i));
  }
  function addFilmstripImage() {
    setFilmstripImages((prev) => [...prev, ""]);
  }
  async function saveFilmstrip() {
    await updateContent({ filmstrip: { note: filmstripNote, images: filmstripImages } });
    announce("Filmstrip saved");
  }

  // ---- Closing + Contact ----
  const [closingTagline, setClosingTagline] = React.useState(content.closing.tagline);
  const [closingImage, setClosingImage] = React.useState(content.closing.image);
  const [email, setEmail] = React.useState(content.contact.email);
  const [locationValue, setLocationValue] = React.useState(content.contact.location);
  const [region, setRegion] = React.useState(content.contact.region);
  const [socialLinks, setSocialLinks] = React.useState(content.contact.socialLinks ?? []);
  function updateSocialLink(i, next) {
    setSocialLinks((prev) => prev.map((s, idx) => (idx === i ? next : s)));
  }
  function removeSocialLink(i) {
    setSocialLinks((prev) => prev.filter((_, idx) => idx !== i));
  }
  function addSocialLink() {
    setSocialLinks((prev) => [...prev, { label: "New account", url: "" }]);
  }
  async function saveContact() {
    await updateContent({
      closing: { tagline: closingTagline, image: closingImage },
      contact: { email, location: locationValue, region, socialLinks },
    });
    announce("Contact & closing saved");
  }

  // ---- Experience ----
  const [experienceSectionLabel, setExperienceSectionLabel] = React.useState(content.experience.sectionLabel);
  const [experienceTitle, setExperienceTitle] = React.useState(content.experience.title);
  const [experienceItems, setExperienceItems] = React.useState(content.experience.items);
  function updateExperienceItem(i, next) {
    setExperienceItems((prev) => prev.map((it, idx) => (idx === i ? next : it)));
  }
  function removeExperienceItem(i) {
    setExperienceItems((prev) => prev.filter((_, idx) => idx !== i));
  }
  function addExperienceItem() {
    setExperienceItems((prev) => [...prev, { role: "", company: "", period: "", description: "" }]);
  }
  async function saveExperience() {
    await updateContent({
      experience: { sectionLabel: experienceSectionLabel, title: experienceTitle, items: experienceItems },
    });
    announce("Experience saved");
  }

  // ---- Password ----
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [pwError, setPwError] = React.useState("");
  async function savePassword() {
    setPwError("");
    if (newPassword.length < 6) {
      setPwError("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.");
      return;
    }
    const ok = await changePassword(currentPassword, newPassword);
    if (ok) {
      setCurrentPassword("");
      setNewPassword("");
      announce("Password updated");
    } else {
      setPwError("كلمة المرور الحالية غير صحيحة.");
    }
  }

  // ---- Email ----
  const [emailCurrentPassword, setEmailCurrentPassword] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  async function saveEmail() {
    setEmailError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setEmailError("حط إيميل صحيح.");
      return;
    }
    const result = await changeEmail(emailCurrentPassword, newEmail);
    if (result.success) {
      setEmailCurrentPassword("");
      setNewEmail("");
      announce("تم إرسال رابط تأكيد للإيميل الجديد — لازم تفتحه لتفعيل الإيميل الجديد فعليًا.");
    } else {
      setEmailError(result.error || "تعذّر تغيير الإيميل.");
    }
  }

  async function handleReset() {
    await resetContent();
    announce("Content reset to defaults — reload to see every field refresh");
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: tokens.color.canvas }}>
      <Box sx={{ borderBottom: "1px solid rgba(25,25,23,0.12)" }}>
        <Container maxWidth="xxl">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={{ xs: 1.5, sm: 0 }}
            sx={{ py: 3 }}
          >
            <Box sx={{ fontSize: 15, letterSpacing: "2px", color: tokens.color.primary }}>
              {content.brand.name} · ADMIN
            </Box>
            <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap" useFlexGap>
              {userEmail && (
                <Caption sx={{ display: { xs: "none", md: "block" } }}>{userEmail}</Caption>
              )}
              <TextLink component={RouterLink} to="/">
                VIEW SITE
              </TextLink>
              <PillButton onClick={() => logout()} sx={{ py: "8px", px: "18px" }}>
                Log out
              </PillButton>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Eyebrow>Dashboard</Eyebrow>
        <Display size="sm" sx={{ mt: 1 }}>
          Control the whole site
        </Display>
        <Body sx={{ mt: 2, maxWidth: 560 }}>
          Every section below — hero, portfolio, services, the studio profile, footer and contact —
          writes straight to the database, live for every visitor. Photos and the hero video upload
          directly to storage; keep files modest in size for faster page loads.
        </Body>

        <Rule sx={{ my: 5 }} />

        <DashboardSection title="Header" subtitle="Brand name, nav links, Inquire button" defaultExpanded>
          <Stack spacing={3}>
            <TextField label="Brand name (navbar + footer)" value={brandName} onChange={(e) => setBrandName(e.target.value)} fullWidth variant="standard" sx={fieldSx} />
            {navLinks.map((l, i) => (
              <TextField
                key={l.id}
                label={`Nav link ${i + 1} label (scrolls to "${l.id}")`}
                value={l.label}
                onChange={(e) => updateNavLinkLabel(i, e.target.value)}
                fullWidth
                variant="standard"
                sx={fieldSx}
              />
            ))}
            <TextField label="Inquire button label" value={inquireLabel} onChange={(e) => setInquireLabel(e.target.value)} fullWidth variant="standard" sx={fieldSx} />
            <SaveButton
              onClick={async () => {
                await saveBrand();
                await saveHeader();
              }}
            >
              Save header
            </SaveButton>
          </Stack>
        </DashboardSection>

        <Rule />

        <DashboardSection title="Hero" subtitle="Wordmark, eyebrow, tagline, background photo or video">
          <Stack spacing={3}>
            <Caption sx={{ display: "block" }}>
              The big wordmark comes from the Brand name field above, and the "Inquire" link here
              uses the same label as the Header section. Region ("Europe / Worldwide") comes from
              the Contact section further down.
            </Caption>
            <TextField
              label="Eyebrow (small text under the wordmark)"
              value={heroEyebrow}
              onChange={(e) => setHeroEyebrow(e.target.value)}
              fullWidth
              variant="standard"
              sx={fieldSx}
            />
            <TextField
              label="Tagline"
              value={heroTagline}
              onChange={(e) => setHeroTagline(e.target.value)}
              fullWidth
              variant="standard"
              sx={fieldSx}
            />
            <TextField
              label="Scroll cue label"
              value={heroScrollLabel}
              onChange={(e) => setHeroScrollLabel(e.target.value)}
              fullWidth
              variant="standard"
              sx={fieldSx}
            />
            <TextField
              label="'View the work' button label"
              value={heroWorkCtaLabel}
              onChange={(e) => setHeroWorkCtaLabel(e.target.value)}
              fullWidth
              variant="standard"
              sx={fieldSx}
            />
            <MediaUploadField label="Background photo" kind="image" aspect="16 / 9" value={heroImage} onChange={setHeroImage} />
            <MediaUploadField label="Background video (overrides the photo when set)" kind="video" value={heroVideo} onChange={setHeroVideo} maxSizeMB={8} />
            <Rule sx={{ my: 1 }} />
            <TextField
              label="'Download CV' button label"
              value={heroCvLabel}
              onChange={(e) => setHeroCvLabel(e.target.value)}
              fullWidth
              variant="standard"
              sx={fieldSx}
            />
            <MediaUploadField label="CV file (PDF)" kind="file" value={heroCvUrl} onChange={setHeroCvUrl} maxSizeMB={10} />
            <SaveButton onClick={saveHero}>Save hero</SaveButton>
          </Stack>
        </DashboardSection>

        <Rule />

        <DashboardSection title="01 / Approach" subtitle="Statement and supporting paragraph">
          <Stack spacing={3}>
            <TextField label="Statement" value={statement} onChange={(e) => setStatement(e.target.value)} fullWidth multiline minRows={2} variant="standard" sx={fieldSx} />
            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline minRows={3} variant="standard" sx={fieldSx} />
            <SaveButton onClick={saveApproach}>Save approach</SaveButton>
          </Stack>
        </DashboardSection>

        <Rule />

        <DashboardSection title="02 / Work" subtitle="Featured story + supporting grid">
          <Stack spacing={3}>
            <TextField label="Section title" value={workTitle} onChange={(e) => setWorkTitle(e.target.value)} fullWidth variant="standard" sx={fieldSx} />
            <TextField label="Section description" value={workDescription} onChange={(e) => setWorkDescription(e.target.value)} fullWidth multiline minRows={2} variant="standard" sx={fieldSx} />
            <TextField label="'View full portfolio' button label" value={workDriveLabel} onChange={(e) => setWorkDriveLabel(e.target.value)} fullWidth variant="standard" sx={fieldSx} />
            <TextField label="Google Drive (or any) portfolio link" value={workDriveUrl} onChange={(e) => setWorkDriveUrl(e.target.value)} fullWidth variant="standard" sx={fieldSx} placeholder="https://drive.google.com/..." />

            <Box>
              <Caption sx={{ display: "block", mb: 1.5 }}>Featured story</Caption>
              <ItemCard>
                <Stack spacing={2}>
                  <TextField label="Title" value={feature.title} onChange={(e) => setFeature({ ...feature, title: e.target.value })} fullWidth variant="standard" sx={fieldSx} />
                  <TextField label="Meta (LOCATION · YEAR · TYPE)" value={feature.meta} onChange={(e) => setFeature({ ...feature, meta: e.target.value })} fullWidth variant="standard" sx={fieldSx} />
                  <MediaUploadField label="Photo" kind="image" aspect="16 / 7" value={feature.image} onChange={(v) => setFeature({ ...feature, image: v })} />
                </Stack>
              </ItemCard>
            </Box>

            <Box>
              <Caption sx={{ display: "block", mb: 1.5 }}>Supporting stories</Caption>
              {workItems.map((it, i) => (
                <ItemCard key={i} onRemove={() => removeWorkItem(i)}>
                  <Stack spacing={2}>
                    <TextField label="Title" value={it.title} onChange={(e) => updateWorkItem(i, { ...it, title: e.target.value })} fullWidth variant="standard" sx={fieldSx} />
                    <TextField label="Meta" value={it.meta} onChange={(e) => updateWorkItem(i, { ...it, meta: e.target.value })} fullWidth variant="standard" sx={fieldSx} />
                    <MediaUploadField label="Photo" kind="image" value={it.image} onChange={(v) => updateWorkItem(i, { ...it, image: v })} />
                  </Stack>
                </ItemCard>
              ))}
              <TextLink onClick={addWorkItem} sx={{ cursor: "pointer" }}>+ ADD STORY</TextLink>
            </Box>

            <SaveButton onClick={saveWork}>Save work section</SaveButton>
          </Stack>
        </DashboardSection>

        <Rule />

        <DashboardSection title="Pull quote" subtitle="Centered statement + framed photo">
          <Stack spacing={3}>
            <TextField label="Quote" value={quoteText} onChange={(e) => setQuoteText(e.target.value)} fullWidth multiline minRows={2} variant="standard" sx={fieldSx} />
            <TextField label="Caption" value={quoteCaption} onChange={(e) => setQuoteCaption(e.target.value)} fullWidth variant="standard" sx={fieldSx} />
            <MediaUploadField label="Framed photo" kind="image" aspect="4 / 3" value={quoteImage} onChange={setQuoteImage} />
            <SaveButton onClick={savePullQuote}>Save pull quote</SaveButton>
          </Stack>
        </DashboardSection>

        <Rule />

        <DashboardSection title="03 / Services" subtitle="Numbered service rows">
          <Stack spacing={3}>
            <TextField label="Section title" value={servicesTitle} onChange={(e) => setServicesTitle(e.target.value)} fullWidth multiline minRows={2} variant="standard" sx={fieldSx} />
            {serviceItems.map((it, i) => (
              <ItemCard key={i} onRemove={() => removeServiceItem(i)}>
                <Stack spacing={2}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField label="No." value={it.n} onChange={(e) => updateServiceItem(i, { ...it, n: e.target.value })} variant="standard" sx={{ width: { xs: "100%", sm: 80 }, ...fieldSx }} />
                    <TextField label="Title" value={it.title} onChange={(e) => updateServiceItem(i, { ...it, title: e.target.value })} fullWidth variant="standard" sx={fieldSx} />
                  </Stack>
                  <TextField label="Description" value={it.copy} onChange={(e) => updateServiceItem(i, { ...it, copy: e.target.value })} fullWidth variant="standard" sx={fieldSx} />
                  <MediaUploadField label="Thumbnail" kind="image" aspect="8 / 9" value={it.image} onChange={(v) => updateServiceItem(i, { ...it, image: v })} />
                </Stack>
              </ItemCard>
            ))}
            <TextLink onClick={addServiceItem} sx={{ cursor: "pointer" }}>+ ADD SERVICE</TextLink>
            <SaveButton onClick={saveServices}>Save services</SaveButton>
          </Stack>
        </DashboardSection>

        <Rule />

        <DashboardSection title="04 / Process" subtitle="Four-step grid">
          <Stack spacing={3}>
            <TextField label="Section title" value={processTitle} onChange={(e) => setProcessTitle(e.target.value)} fullWidth multiline minRows={2} variant="standard" sx={fieldSx} />
            {processItems.map((it, i) => (
              <ItemCard key={i} onRemove={() => removeProcessItem(i)}>
                <Stack spacing={2}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField label="No." value={it.n} onChange={(e) => updateProcessItem(i, { ...it, n: e.target.value })} variant="standard" sx={{ width: { xs: "100%", sm: 80 }, ...fieldSx }} />
                    <TextField label="Title" value={it.title} onChange={(e) => updateProcessItem(i, { ...it, title: e.target.value })} fullWidth variant="standard" sx={fieldSx} />
                  </Stack>
                  <TextField label="Description" value={it.copy} onChange={(e) => updateProcessItem(i, { ...it, copy: e.target.value })} fullWidth multiline minRows={2} variant="standard" sx={fieldSx} />
                </Stack>
              </ItemCard>
            ))}
            <TextLink onClick={addProcessItem} sx={{ cursor: "pointer" }}>+ ADD STEP</TextLink>
            <SaveButton onClick={saveProcess}>Save process</SaveButton>
          </Stack>
        </DashboardSection>

        <Rule />

        <DashboardSection title="Moment band" subtitle="Full-bleed dark photo band">
          <Stack spacing={3}>
            <TextField label="Caption" value={momentCaption} onChange={(e) => setMomentCaption(e.target.value)} fullWidth variant="standard" sx={fieldSx} />
            <MediaUploadField label="Photo" kind="image" aspect="16 / 9" value={momentImage} onChange={setMomentImage} />
            <SaveButton onClick={saveMoment}>Save moment band</SaveButton>
          </Stack>
        </DashboardSection>

        <Rule />

        <DashboardSection title="05 / The studio (profile)" subtitle="Portrait, bio, credit line, stats">
          <Stack spacing={3}>
            <TextField label="Section label (small heading above)" value={profileSectionLabel} onChange={(e) => setProfileSectionLabel(e.target.value)} fullWidth variant="standard" sx={fieldSx} />
            <TextField label="Heading" value={profileTitle} onChange={(e) => setProfileTitle(e.target.value)} fullWidth variant="standard" sx={fieldSx} />
            <TextField label="Bio paragraphs (leave a blank line between paragraphs)" value={profileParagraphs} onChange={(e) => setProfileParagraphs(e.target.value)} fullWidth multiline minRows={5} variant="standard" sx={fieldSx} />
            <MediaUploadField label="Portrait photo" kind="image" value={profileImage} onChange={setProfileImage} />
            <TextField label="Image credit line" value={profileImageCaption} onChange={(e) => setProfileImageCaption(e.target.value)} fullWidth variant="standard" sx={fieldSx} />
            <TextField label="'More about' link label" value={profileLinkLabel} onChange={(e) => setProfileLinkLabel(e.target.value)} fullWidth variant="standard" sx={fieldSx} />

            <Box>
              <Caption sx={{ display: "block", mb: 2 }}>Stats grid</Caption>
              {profileStats.map((s, i) => (
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }} key={i} sx={{ mb: 2 }}>
                  <TextField label="Label" value={s.label} onChange={(e) => updateStat(i, { ...s, label: e.target.value })} variant="standard" sx={{ flex: 1, ...fieldSx }} />
                  <TextField label="Value" value={s.value} onChange={(e) => updateStat(i, { ...s, value: e.target.value })} variant="standard" sx={{ flex: 1, ...fieldSx }} />
                  <IconButton size="small" onClick={() => removeStat(i)} aria-label="Remove stat" sx={{ color: tokens.color.muted, alignSelf: { xs: "flex-end", sm: "center" } }}>✕</IconButton>
                </Stack>
              ))}
              <TextLink onClick={addStat} sx={{ cursor: "pointer" }}>+ ADD STAT</TextLink>
            </Box>

            <SaveButton onClick={saveProfile}>Save profile</SaveButton>
          </Stack>
        </DashboardSection>

        <Rule />

        <DashboardSection title="Experience" subtitle="Where you've worked before — leave empty to hide this section entirely">
          <Stack spacing={3}>
            <TextField label="Section label (small heading above)" value={experienceSectionLabel} onChange={(e) => setExperienceSectionLabel(e.target.value)} fullWidth variant="standard" sx={fieldSx} />
            <TextField label="Heading" value={experienceTitle} onChange={(e) => setExperienceTitle(e.target.value)} fullWidth variant="standard" sx={fieldSx} />

            {experienceItems.map((item, i) => (
              <ItemCard key={i} onRemove={() => removeExperienceItem(i)}>
                <Stack spacing={2}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField label="Role / title" value={item.role} onChange={(e) => updateExperienceItem(i, { ...item, role: e.target.value })} fullWidth variant="standard" sx={fieldSx} />
                    <TextField label="Period (e.g. 2022 – 2024)" value={item.period} onChange={(e) => updateExperienceItem(i, { ...item, period: e.target.value })} sx={{ width: { xs: "100%", sm: 200 }, ...fieldSx }} variant="standard" />
                  </Stack>
                  <TextField label="Company / studio" value={item.company} onChange={(e) => updateExperienceItem(i, { ...item, company: e.target.value })} fullWidth variant="standard" sx={fieldSx} />
                  <TextField label="Description (optional)" value={item.description} onChange={(e) => updateExperienceItem(i, { ...item, description: e.target.value })} fullWidth multiline minRows={2} variant="standard" sx={fieldSx} />
                </Stack>
              </ItemCard>
            ))}
            <TextLink onClick={addExperienceItem} sx={{ cursor: "pointer" }}>
              + ADD PAST ROLE
            </TextLink>

            <SaveButton onClick={saveExperience}>Save experience</SaveButton>
          </Stack>
        </DashboardSection>

        <Rule />

        <DashboardSection title="Testimonial" subtitle="Centered client quote">
          <Stack spacing={3}>
            <TextField label="Quote" value={testimonialText} onChange={(e) => setTestimonialText(e.target.value)} fullWidth multiline minRows={2} variant="standard" sx={fieldSx} />
            <TextField label="Name" value={testimonialName} onChange={(e) => setTestimonialName(e.target.value)} fullWidth variant="standard" sx={fieldSx} />
            <TextField label="Meta" value={testimonialMeta} onChange={(e) => setTestimonialMeta(e.target.value)} fullWidth variant="standard" sx={fieldSx} />
            <SaveButton onClick={saveTestimonial}>Save testimonial</SaveButton>
          </Stack>
        </DashboardSection>

        <Rule />

        <DashboardSection title="Filmstrip" subtitle="Auto-scrolling archive frames">
          <Stack spacing={3}>
            <TextField label="Note" value={filmstripNote} onChange={(e) => setFilmstripNote(e.target.value)} fullWidth variant="standard" sx={fieldSx} />
            <Stack direction="row" flexWrap="wrap" gap={2}>
              {filmstripImages.map((img, i) => (
                <Box key={i} sx={{ position: "relative" }}>
                  <MediaUploadField kind="image" aspect="3 / 4" value={img} onChange={(v) => updateFilmstripImage(i, v)} />
                  <IconButton size="small" onClick={() => removeFilmstripImage(i)} aria-label="Remove frame" sx={{ position: "absolute", top: -8, right: -8, bgcolor: tokens.color.canvas, border: "1px solid rgba(25,25,23,0.15)", "&:hover": { bgcolor: tokens.color.canvas } }}>
                    ✕
                  </IconButton>
                </Box>
              ))}
            </Stack>
            <Box><TextLink onClick={addFilmstripImage} sx={{ cursor: "pointer" }}>+ ADD FRAME</TextLink></Box>
            <SaveButton onClick={saveFilmstrip}>Save filmstrip</SaveButton>
          </Stack>
        </DashboardSection>

        <Rule />

        <DashboardSection title="Closing, footer & contact" subtitle="Footer tagline, closing photo, email, social links">
          <Stack spacing={3}>
            <TextField label="Footer tagline" value={footerTagline} onChange={(e) => setFooterTagline(e.target.value)} fullWidth variant="standard" sx={fieldSx} />
            <Box><SaveButton onClick={saveBrand}>Save footer tagline</SaveButton></Box>

            <Rule sx={{ my: 1 }} />

            <TextField label="Closing tagline" value={closingTagline} onChange={(e) => setClosingTagline(e.target.value)} fullWidth variant="standard" sx={fieldSx} />
            <MediaUploadField label="Closing background photo" kind="image" aspect="16 / 9" value={closingImage} onChange={setClosingImage} />
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth variant="standard" sx={fieldSx} />
            <TextField label="Location" value={locationValue} onChange={(e) => setLocationValue(e.target.value)} fullWidth variant="standard" sx={fieldSx} />
            <TextField label="Region" value={region} onChange={(e) => setRegion(e.target.value)} fullWidth variant="standard" sx={fieldSx} />
            <Box>
              <Caption sx={{ display: "block", mb: 2 }}>Social media accounts</Caption>
              {socialLinks.map((s, i) => (
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }} key={i} sx={{ mb: 2 }}>
                  <TextField
                    label="Platform"
                    value={s.label}
                    onChange={(e) => updateSocialLink(i, { ...s, label: e.target.value })}
                    variant="standard"
                    sx={{ width: { xs: "100%", sm: 160 }, ...fieldSx }}
                  />
                  <TextField
                    label="Profile URL"
                    value={s.url}
                    onChange={(e) => updateSocialLink(i, { ...s, url: e.target.value })}
                    fullWidth
                    variant="standard"
                    sx={fieldSx}
                  />
                  <IconButton size="small" onClick={() => removeSocialLink(i)} aria-label="Remove social link" sx={{ color: tokens.color.muted, alignSelf: { xs: "flex-end", sm: "center" } }}>
                    ✕
                  </IconButton>
                </Stack>
              ))}
              <TextLink onClick={addSocialLink} sx={{ cursor: "pointer" }}>
                + ADD SOCIAL ACCOUNT
              </TextLink>
            </Box>
            <SaveButton onClick={saveContact}>Save closing & contact</SaveButton>
          </Stack>
        </DashboardSection>

        <Rule />

        <DashboardSection title="Account" subtitle="Change the admin email or password">
          <Stack spacing={3} sx={{ maxWidth: 360 }}>
            {userEmail && <Caption>Signed in as {userEmail}</Caption>}

            <Body sx={{ fontSize: 13, fontWeight: 600 }}>Change email</Body>
            <TextField label="New email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} fullWidth variant="standard" sx={fieldSx} />
            <TextField label="Current password" type="password" value={emailCurrentPassword} onChange={(e) => setEmailCurrentPassword(e.target.value)} fullWidth variant="standard" sx={fieldSx} />
            {emailError && <Body sx={{ color: "#B3261E", fontSize: 13 }}>{emailError}</Body>}
            <SaveButton onClick={saveEmail}>Update email</SaveButton>

            <Rule sx={{ my: 1 }} />

            <Body sx={{ fontSize: 13, fontWeight: 600 }}>Change password</Body>
            <TextField label="Current password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} fullWidth variant="standard" sx={fieldSx} />
            <TextField label="New password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} fullWidth variant="standard" sx={fieldSx} />
            {pwError && <Body sx={{ color: "#B3261E", fontSize: 13 }}>{pwError}</Body>}
            <SaveButton onClick={savePassword}>Update password</SaveButton>
          </Stack>
        </DashboardSection>

        <Rule sx={{ mb: 5 }} />

        <Link
          component="button"
          onClick={handleReset}
          underline="none"
          sx={{ fontSize: 12, letterSpacing: "1px", textTransform: "uppercase", color: tokens.color.muted, cursor: "pointer" }}
        >
          Reset all content to defaults
        </Link>
      </Container>

      <Snackbar open={!!toast} autoHideDuration={3000} onClose={() => setToast("")} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={storageError ? "error" : "success"} variant="filled" onClose={() => setToast("")}>
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
}