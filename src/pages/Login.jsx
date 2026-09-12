import * as React from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import { tokens } from "../theme";
import { Eyebrow, Body } from "../components/Typography";
import { PillButton } from "../components/Button";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, isAuthenticated, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [failedAttempts, setFailedAttempts] = React.useState(0);
  const [lockedUntil, setLockedUntil] = React.useState(0);
  const [, forceTick] = React.useReducer((c) => c + 1, 0);

  // Client-side throttle only — a UX speed bump, not a real security
  // boundary (Supabase's own Auth service already rate-limits and
  // eventually locks out repeated failed sign-ins server-side, and that's
  // the actual protection). This just avoids hammering the API with a
  // tight retry loop from this tab and gives the person a clear countdown.
  const lockRemaining = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
  React.useEffect(() => {
    if (lockRemaining <= 0) return undefined;
    const id = setInterval(forceTick, 1000);
    return () => clearInterval(id);
  }, [lockRemaining]);

  React.useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(location.state?.from || "/admin", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (lockRemaining > 0) return;

    setSubmitting(true);
    const ok = await login(email.trim(), password);
    setSubmitting(false);
    if (ok) {
      setFailedAttempts(0);
      navigate(location.state?.from || "/admin", { replace: true });
    } else {
      const next = failedAttempts + 1;
      setFailedAttempts(next);
      if (next >= 5) {
        setLockedUntil(Date.now() + 30_000);
        setError("محاولات كتيرة فاشلة — انتظر 30 ثانية وحاول مرة ثانية.");
      } else {
        setError("الإيميل أو كلمة المرور غير صحيحة.");
      }
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: tokens.color.canvas,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 380 }}>
        <Box
          sx={{
            fontSize: 32,
            letterSpacing: "4px",
            textTransform: "uppercase",
            textAlign: "center",
            color: tokens.color.primary,
          }}
        >
          VARELLE
        </Box>
        <Eyebrow sx={{ mt: 1, textAlign: "center" }}>Admin sign in</Eyebrow>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5 }}>
          <Stack spacing={2.5}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              fullWidth
              variant="standard"
              autoComplete="username"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              variant="standard"
              autoComplete="current-password"
            />

            {error && <Body sx={{ color: "#B3261E", fontSize: 13 }}>{error}</Body>}

            <PillButton
              type="submit"
              variant="filled"
              disabled={submitting || lockRemaining > 0}
              sx={{ mt: 1, alignSelf: "flex-start" }}
            >
              {lockRemaining > 0 ? `Try again in ${lockRemaining}s` : submitting ? "Signing in…" : "Sign in →"}
            </PillButton>
          </Stack>
        </Box>

        <Body sx={{ mt: 5, fontSize: 12, textAlign: "center" }}>
          <Link component={RouterLink} to="/" underline="none" sx={{ color: tokens.color.muted }}>
            ← Back to the site
          </Link>
        </Body>
      </Box>
    </Box>
  );
}