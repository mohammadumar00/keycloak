"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  TrendingUp,
  People,
  ShoppingCart,
  AccountCircle,
  Logout,
  Settings as SettingsIcon,
  Home,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}10 100%)`,
}));

const StatsCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: theme.spacing(2),
  transition: "all 0.3s ease",
  border: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[8],
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 56,
  height: 56,
  borderRadius: theme.spacing(1.5),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
}));

export default function DashboardPage() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await fetch("/api/user-logout", { method: "POST" });
    window.location.href = "/login";
  };

  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231",
      change: "+12.5%",
      icon: <TrendingUp />,
      color: "#21808d",
      bgColor: "rgba(33, 128, 141, 0.1)",
    },
    {
      title: "Active Users",
      value: "8,492",
      change: "+8.2%",
      icon: <People />,
      color: "#2da6b2",
      bgColor: "rgba(45, 166, 178, 0.1)",
    },
    {
      title: "Total Orders",
      value: "1,247",
      change: "+23.1%",
      icon: <ShoppingCart />,
      color: "#32b8c6",
      bgColor: "rgba(50, 184, 198, 0.1)",
    },
    {
      title: "Conversion Rate",
      value: "3.24%",
      change: "+2.4%",
      icon: <DashboardIcon />,
      color: "#1d7480",
      bgColor: "rgba(29, 116, 128, 0.1)",
    },
  ];

  return (
    <GradientBackground>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar>
          <DashboardIcon sx={{ mr: 2, color: "primary.main" }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: "text.primary", fontWeight: 600 }}
          >
            Dashboard
          </Typography>
          <Button
            color="inherit"
            startIcon={<Home />}
            onClick={() => router.push("/profile")}
            sx={{ mr: 1, color: "text.primary" }}
          >
            Profile
          </Button>
          <Button
            color="inherit"
            startIcon={<SettingsIcon />}
            onClick={() => router.push("/settings")}
            sx={{ mr: 1, color: "text.primary" }}
          >
            Settings
          </Button>
          <IconButton onClick={handleMenu} sx={{ ml: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
              U
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => router.push("/profile")}>
              <AccountCircle sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem onClick={() => router.push("/settings")}>
              <SettingsIcon sx={{ mr: 1 }} /> Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome back! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your business today.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatsCard>
                <CardContent>
                  <IconWrapper sx={{ bgcolor: stat.bgColor }}>
                    <Box sx={{ color: stat.color, display: "flex" }}>
                      {stat.icon}
                    </Box>
                  </IconWrapper>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {stat.value}
                  </Typography>
                  <Chip
                    label={stat.change}
                    size="small"
                    color="success"
                    sx={{ fontWeight: 600 }}
                  />
                </CardContent>
              </StatsCard>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2, height: 400 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Revenue Overview
              </Typography>
              <Box
                sx={{
                  height: 320,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "text.secondary",
                }}
              >
                📊 Chart placeholder - Add your favorite charting library here
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2, height: 400 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Recent Activity
              </Typography>
              <Box sx={{ mt: 2 }}>
                {[1, 2, 3, 4, 5].map((item) => (
                  <Box
                    key={item}
                    sx={{
                      mb: 2,
                      pb: 2,
                      borderBottom: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="body2" fontWeight="500">
                      New order #100{item}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      2 hours ago
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </GradientBackground>
  );
}
