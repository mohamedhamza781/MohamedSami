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
  kind = "image", // "image" | "video"
  maxSizeMB = 5,
  aspect = "4 / 5",
}) {
  const inputRef = React.useRef(null);
  const [error, setError] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const accept = kind === "video" ? "video/*" : "image/*";

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    setError("");
    if (!file.type.startsWith(kind === "video" ? "video/" : "image/")) {
      setError(kind === "video" ? "لازم يكون الملف فيديو." : "لازم يكون الملف صورة.");
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
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
    onChange(data.publicUrl);
  }

  return (
    <Box>
      {label && <Caption sx={{ display: "block", mb: 1 }}>{label}</Caption>}
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box
          sx={{
            width: kind === "video" ? 160 : 96,
            aspectRatio: kind === "video" ? "16 / 9" : aspect,
            flexShrink: 0,
            bgcolor: tokens.color.muted + "22",
            border: "1px solid rgba(25,25,23,0.15)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {value ? (
            kind === "video" ? (
              <Box component="video" src={value} muted loop autoPlay playsInline sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <Box component="img" src={value} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )
          ) : (
            <Box sx={{ fontSize: 10, color: tokens.color.muted, textAlign: "center", px: 1 }}>
              {uploading ? "…" : `NO ${kind.toUpperCase()}`}
            </Box>
          )}
        </Box>

        <Stack spacing={1}>
          <input ref={inputRef} type="file" accept={accept} onChange={handleFile} style={{ display: "none" }} />
          <TextLink onClick={() => !uploading && inputRef.current?.click()} sx={{ cursor: uploading ? "default" : "pointer", opacity: uploading ? 0.5 : 1 }}>
            {uploading ? "UPLOADING…" : `${value ? "REPLACE" : "UPLOAD"} ${kind === "video" ? "VIDEO" : "IMAGE"}`}
          </TextLink>
          {value && !uploading && (
            <TextLink onClick={() => onChange("")} sx={{ cursor: "pointer", color: tokens.color.muted }}>
              REMOVE
            </TextLink>
          )}
          {error && <Box sx={{ fontSize: 11.5, color: "#B3261E", maxWidth: 220 }}>{error}</Box>}
        </Stack>
      </Stack>
    </Box>
  );
}