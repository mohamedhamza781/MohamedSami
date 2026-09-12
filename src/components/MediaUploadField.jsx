import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { tokens } from "../theme";
import { Caption } from "./Typography";
import { TextLink } from "./Button";
import { supabase, MEDIA_BUCKET } from "../lib/supabaseClient";

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-");
}

// A saved value is the public URL Supabase returned after upload, e.g.
// https://<project>.supabase.co/storage/v1/object/public/media/image/123-x.jpg
// To actually delete the file (not just clear the reference), we need the
// path *inside* the bucket, which is everything after ".../public/media/".
function pathFromPublicUrl(url) {
  const marker = `/object/public/${MEDIA_BUCKET}/`;
  const i = url.indexOf(marker);
  if (i === -1) return null;
  return decodeURIComponent(url.slice(i + marker.length));
}

async function deleteFromStorage(url) {
  if (!url) return;
  const path = pathFromPublicUrl(url);
  if (!path) return; // not a file we recognize (e.g. an external URL) — leave it alone
  // Best-effort cleanup: if this fails (e.g. the person isn't actually
  // authenticated, or a network hiccup), we still proceed with clearing
  // the reference — a stray orphaned file in storage is harmless, whereas
  // blocking "remove"/"replace" on a cleanup failure would not be.
  await supabase.storage.from(MEDIA_BUCKET).remove([path]);
}

/**
 * MediaUploadField — click-to-upload image or video. The file is uploaded
 * straight to the Supabase Storage `media` bucket and the field's value is
 * the resulting public URL, which is what actually gets saved into the
 * site's content. Uploading requires an authenticated (admin) session —
 * the bucket's write policy enforces that server-side regardless of what
 * this component does.
 */
export function MediaUploadField({
  label,
  value,
  onChange,
  kind = "image", // "image" | "video" | "file"
  maxSizeMB = 5,
  aspect = "4 / 5",
  accept: acceptProp,
}) {
  const inputRef = React.useRef(null);
  const [error, setError] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const accept = acceptProp ?? (kind === "video" ? "video/*" : kind === "file" ? ".pdf,.doc,.docx" : "image/*");

  function fileNameFromUrl(url) {
    const path = pathFromPublicUrl(url);
    if (!path) return url;
    const name = path.split("/").pop() ?? path;
    // Strip the "<timestamp>-" prefix we add on upload, for a cleaner display.
    return name.replace(/^\d+-/, "");
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    setError("");
    if (kind === "video" && !file.type.startsWith("video/")) {
      setError("لازم يكون الملف فيديو.");
      return;
    }
    if (kind === "image" && !file.type.startsWith("image/")) {
      setError("لازم يكون الملف صورة.");
      return;
    }
    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      setError(`الملف كبير (${(file.size / (1024 * 1024)).toFixed(1)}MB) — الحد الأقصى ${maxSizeMB}MB.`);
      return;
    }

    setUploading(true);
    const path = `${kind}/${Date.now()}-${slugify(file.name)}`;
    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setUploading(false);
      setError(
        uploadError.message?.toLowerCase().includes("row-level security") ||
          uploadError.statusCode === "403"
          ? "لازم تكون مسجّل دخول عشان ترفع ملفات."
          : "تعذّر رفع الملف — تأكد من الاتصال وحاول مرة ثانية."
      );
      return;
    }

    const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
    setUploading(false);

    // Clean up the file this one is replacing, if there was one — otherwise
    // every "replace" leaves the old file behind in storage forever.
    if (value) deleteFromStorage(value);

    onChange(data.publicUrl);
  }

  async function handleRemove() {
    onChange("");
    await deleteFromStorage(value);
  }

  return (
    <Box>
      {label && <Caption sx={{ display: "block", mb: 1 }}>{label}</Caption>}
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box
          sx={{
            width: kind === "video" ? 160 : kind === "file" ? 160 : 96,
            aspectRatio: kind === "video" ? "16 / 9" : kind === "file" ? "auto" : aspect,
            height: kind === "file" ? 56 : undefined,
            flexShrink: 0,
            bgcolor: tokens.color.muted + "22",
            border: "1px solid rgba(25,25,23,0.15)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: kind === "file" ? 1 : 0,
          }}
        >
          {value ? (
            kind === "video" ? (
              <Box component="video" src={value} muted loop autoPlay playsInline sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : kind === "file" ? (
              <Box
                component="a"
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  fontSize: 11,
                  color: tokens.color.primary,
                  textDecoration: "underline",
                  textAlign: "center",
                  wordBreak: "break-all",
                  px: 0.5,
                }}
              >
                {fileNameFromUrl(value)}
              </Box>
            ) : (
              <Box component="img" src={value} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )
          ) : (
            <Box sx={{ fontSize: 10, color: tokens.color.muted, textAlign: "center", px: 1 }}>
              {uploading ? "…" : kind === "file" ? "NO FILE" : `NO ${kind.toUpperCase()}`}
            </Box>
          )}
        </Box>

        <Stack spacing={1}>
          <input ref={inputRef} type="file" accept={accept} onChange={handleFile} style={{ display: "none" }} />
          <TextLink onClick={() => !uploading && inputRef.current?.click()} sx={{ cursor: uploading ? "default" : "pointer", opacity: uploading ? 0.5 : 1 }}>
            {uploading ? "UPLOADING…" : `${value ? "REPLACE" : "UPLOAD"} ${kind === "video" ? "VIDEO" : kind === "file" ? "FILE" : "IMAGE"}`}
          </TextLink>
          {value && !uploading && (
            <TextLink onClick={handleRemove} sx={{ cursor: "pointer", color: tokens.color.muted }}>
              REMOVE
            </TextLink>
          )}
          {error && <Box sx={{ fontSize: 11.5, color: "#B3261E", maxWidth: 220 }}>{error}</Box>}
        </Stack>
      </Stack>
    </Box>
  );
}