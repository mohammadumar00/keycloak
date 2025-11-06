// "use client";

// import { useEffect, useState } from "react";

// interface UserProfile {
//   sub: string;
//   preferred_username?: string;
//   email?: string;
//   given_name?: string;
//   family_name?: string;
//   // add other fields you expect from Keycloak user info
// }

// export default function ProfilePage() {
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchProfile() {
//       const res = await fetch("/api/user-info");
//       if (!res.ok) {
//         const data = await res.json();
//         setError(data.error || "Failed to fetch user profile");
//         return;
//       }
//       const profile = await res.json();
//       setUser(profile);
//     }
//     fetchProfile();
//   }, []);

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!user) {
//     return <div>Loading profile...</div>;
//   }

//   return (
//     <div>
//       <h1>User Profile</h1>
//       <p>
//         <b>User ID:</b> {user.sub}
//       </p>
//       <p>
//         <b>Username:</b> {user.preferred_username || "N/A"}
//       </p>
//       <p>
//         <b>Email:</b> {user.email || "N/A"}
//       </p>
//       <p>
//         <b>First Name:</b> {user.given_name || "N/A"}
//       </p>
//       <p>
//         <b>Last Name:</b> {user.family_name || "N/A"}
//       </p>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Paper,
  Avatar,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Fade,
  Zoom,
  Chip,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Logout as LogoutIcon,
  Verified as VerifiedIcon,
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
  padding: theme.spacing(2),
  "&::before": {
    content: '""',
    position: "absolute",
    width: "600px",
    height: "600px",
    background: `radial-gradient(circle, ${theme.palette.primary.main}30, transparent)`,
    top: "-300px",
    right: "-300px",
    borderRadius: "50%",
    filter: "blur(100px)",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    width: "500px",
    height: "500px",
    background: `radial-gradient(circle, ${theme.palette.secondary.main}30, transparent)`,
    bottom: "-250px",
    left: "-250px",
    borderRadius: "50%",
    filter: "blur(100px)",
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 700,
  width: "100%",
  borderRadius: theme.spacing(3),
  overflow: "hidden",
  backdropFilter: "blur(10px)",
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(38, 40, 40, 0.9)"
      : "rgba(252, 252, 249, 0.9)",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[12],
  position: "relative",
  zIndex: 1,
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.primary.dark}20)`,
  padding: theme.spacing(4),
  textAlign: "center",
  borderBottom: `1px solid ${theme.palette.divider}`,
  position: "relative",
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  margin: "0 auto 16px",
  fontSize: "3rem",
  fontWeight: "bold",
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  boxShadow: `0 8px 32px ${theme.palette.primary.main}50`,
  border: `4px solid ${theme.palette.background.paper}`,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  background: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  transition: "all 0.3s ease",
  "&:hover": {
    background:
      theme.palette.mode === "dark"
        ? "rgba(50, 184, 198, 0.08)"
        : "rgba(33, 128, 141, 0.08)",
    borderColor: theme.palette.primary.main,
    transform: "translateX(8px)",
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 56,
  "& .MuiSvgIcon-root": {
    fontSize: 28,
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    background: `${theme.palette.primary.main}20`,
    color: theme.palette.primary.main,
  },
}));

interface UserProfile {
  sub: string;
  preferred_username?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user-info");
        if (!res.ok) {
          if (res.status === 401) {
            router.push("/login");
            return;
          }
          const data = await res.json();
          setError(data.error || "Failed to fetch user profile");
          setLoading(false);
          return;
        }
        const profile = await res.json();
        setUser(profile);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch profile");
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  async function handleLogout() {
    await fetch("/api/user-logout", { method: "POST" });
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <GradientBackground>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 3 }} color="text.secondary">
            Loading your profile...
          </Typography>
        </Box>
      </GradientBackground>
    );
  }

  if (error) {
    return (
      <GradientBackground>
        <Container maxWidth="sm">
          <Fade in>
            <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
              <Button
                variant="contained"
                onClick={() => router.push("/login")}
                startIcon={<PersonIcon />}
              >
                Go to Login
              </Button>
            </Paper>
          </Fade>
        </Container>
      </GradientBackground>
    );
  }

  if (!user) return null;

  const fullName =
    user.given_name && user.family_name
      ? `${user.given_name} ${user.family_name}`
      : user.preferred_username || "User";

  const avatarLetter =
    user.given_name?.[0]?.toUpperCase() ||
    user.preferred_username?.[0]?.toUpperCase() ||
    "U";

  return (
    <GradientBackground>
      <Container maxWidth="md">
        <Zoom in timeout={500}>
          <StyledPaper>
            <ProfileHeader>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <ProfileAvatar>{avatarLetter}</ProfileAvatar>
                <Chip
                  icon={<VerifiedIcon />}
                  label="Active"
                  color="success"
                  size="small"
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    right: -8,
                    fontWeight: 600,
                  }}
                />
              </Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {fullName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                @{user.preferred_username || "user"}
              </Typography>
            </ProfileHeader>

            <Box sx={{ p: 3 }}>
              <Typography
                variant="h6"
                fontWeight="600"
                gutterBottom
                sx={{ mb: 2, px: 1 }}
              >
                Profile Information
              </Typography>

              <List sx={{ px: 1 }}>
                <Fade in timeout={600}>
                  <StyledListItem>
                    <StyledListItemIcon>
                      <BadgeIcon />
                    </StyledListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="caption" color="text.secondary" fontWeight="600">
                          USER ID
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" fontWeight="500" sx={{ mt: 0.5 }}>
                          {user.sub}
                        </Typography>
                      }
                    />
                  </StyledListItem>
                </Fade>

                {user.email && (
                  <Fade in timeout={800}>
                    <StyledListItem>
                      <StyledListItemIcon>
                        <EmailIcon />
                      </StyledListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="caption" color="text.secondary" fontWeight="600">
                            EMAIL
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body1" fontWeight="500" sx={{ mt: 0.5 }}>
                            {user.email}
                          </Typography>
                        }
                      />
                    </StyledListItem>
                  </Fade>
                )}

                {user.given_name && (
                  <Fade in timeout={1000}>
                    <StyledListItem>
                      <StyledListItemIcon>
                        <PersonIcon />
                      </StyledListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="caption" color="text.secondary" fontWeight="600">
                            FIRST NAME
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body1" fontWeight="500" sx={{ mt: 0.5 }}>
                            {user.given_name}
                          </Typography>
                        }
                      />
                    </StyledListItem>
                  </Fade>
                )}

                {user.family_name && (
                  <Fade in timeout={1200}>
                    <StyledListItem>
                      <StyledListItemIcon>
                        <PersonIcon />
                      </StyledListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="caption" color="text.secondary" fontWeight="600">
                            LAST NAME
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body1" fontWeight="500" sx={{ mt: 0.5 }}>
                            {user.family_name}
                          </Typography>
                        }
                      />
                    </StyledListItem>
                  </Fade>
                )}
              </List>

              <Box sx={{ mt: 4, px: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  color="error"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                      transform: "translateY(-2px)",
                      boxShadow: (theme) => `0 8px 20px ${theme.palette.error.main}30`,
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Sign Out
                </Button>
              </Box>
            </Box>
          </StyledPaper>
        </Zoom>
      </Container>
    </GradientBackground>
  );
}
