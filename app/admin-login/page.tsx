"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Avatar,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    width: "500px",
    height: "500px",
    background: `radial-gradient(circle, ${theme.palette.primary.main}40, transparent)`,
    top: "-250px",
    left: "-250px",
    borderRadius: "50%",
    filter: "blur(80px)",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    width: "400px",
    height: "400px",
    background: `radial-gradient(circle, ${theme.palette.secondary.main}40, transparent)`,
    bottom: "-200px",
    right: "-200px",
    borderRadius: "50%",
    filter: "blur(80px)",
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 440,
  width: "100%",
  borderRadius: theme.spacing(2),
  backdropFilter: "blur(10px)",
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(38, 40, 40, 0.9)"
      : "rgba(252, 252, 249, 0.9)",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[8],
  position: "relative",
  zIndex: 1,
}));

const LogoAvatar = styled(Avatar)(({ theme }) => ({
  width: 64,
  height: 64,
  margin: "0 auto 16px",
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
}));

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Success - redirect to profile
      window.location.href = "/admin-dashboard";
    } catch (err) {
      setError("Failed to connect to server");
      setLoading(false);
    }
  }

  return (
    <GradientBackground>
      <Container maxWidth="sm">
        <Zoom in timeout={500}>
          <StyledPaper elevation={3}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <LogoAvatar>
                <PersonIcon sx={{ fontSize: 32 }} />
              </LogoAvatar>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Admin Login
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to your account
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              {error && (
                <Fade in>
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                </Fade>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                endIcon={
                  loading ? <CircularProgress size={20} /> : <LoginIcon />
                }
                sx={{
                  mt: 2,
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: (theme) =>
                      `0 8px 20px ${theme.palette.primary.main}40`,
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </Box>
          </StyledPaper>
        </Zoom>
      </Container>
    </GradientBackground>
  );
}
