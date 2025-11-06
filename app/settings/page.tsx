"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Divider,
  Avatar,
  TextField,
  Grid,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Notifications,
  Security,
  Palette,
  Language,
  ArrowBack,
  Save,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}10 100%)`,
}));

const SettingsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
}));

export default function SettingsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <GradientBackground>
      <AppBar position="static" elevation={0} sx={{ bgcolor: "background.paper", borderBottom: 1, borderColor: "divider" }}>
        <Toolbar>
          <IconButton edge="start" onClick={() => router.back()} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <SettingsIcon sx={{ mr: 2, color: "primary.main" }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "text.primary", fontWeight: 600 }}>
            Settings
          </Typography>
          <Avatar sx={{ bgcolor: "primary.main" }}>U</Avatar>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Account Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account preferences and settings
          </Typography>
        </Box>

        <SettingsCard>
          <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 2 }}>
            Profile Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="First Name" defaultValue="John" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Last Name" defaultValue="Doe" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" defaultValue="john.doe@example.com" type="email" />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" startIcon={<Save />} sx={{ mt: 1 }}>
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </SettingsCard>

        <SettingsCard>
          <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 2 }}>
            Preferences
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Notifications color="primary" />
              </ListItemIcon>
              <ListItemText primary="Push Notifications" secondary="Receive push notifications" />
              <Switch checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <Palette color="primary" />
              </ListItemIcon>
              <ListItemText primary="Dark Mode" secondary="Enable dark theme" />
              <Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <Language color="primary" />
              </ListItemIcon>
              <ListItemText primary="Language" secondary="English (US)" />
              <Button size="small">Change</Button>
            </ListItem>
          </List>
        </SettingsCard>

        <SettingsCard>
          <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 2 }}>
            Security
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Security color="primary" />
              </ListItemIcon>
              <ListItemText primary="Two-Factor Authentication" secondary="Add an extra layer of security" />
              <Switch checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary="Change Password" secondary="Update your password regularly" />
              <Button size="small" variant="outlined">
                Update
              </Button>
            </ListItem>
          </List>
        </SettingsCard>
      </Container>
    </GradientBackground>
  );
}
