"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Drawer,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
  FormGroup,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

type User = {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  enabled?: boolean;
  attributes?: { avatarUrl?: string[] };
  clientRoles?: { [clientId: string]: string[] }; // { "bhs-client": ["role1","role2"] }
};

const CLIENT_ID = "bhs-client";

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // dynamically loaded client roles from /api/roles
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);

  // Local editable state for drawer
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editEnabled, setEditEnabled] = useState(true);
  const [editRoles, setEditRoles] = useState<string[]>([]); // roles for bhs-client

  // Load users on mount (now with clientRoles from backend)
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const res = await fetch("/api/users");
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to load users");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setUsers(data);
        setLoading(false);
      } catch (e) {
        setError("Failed to connect to server");
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // Load available client roles on mount
  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await fetch("/api/client-roles");
        if (!res.ok) {
          console.error("Failed to load roles");
          return;
        }
        // expected: { clientId: "bhs-client", roles: ["sessions-dashboard-access", ...] }
        const data = await res.json();
        setAvailableRoles(data.roles || []);
      } catch (e) {
        console.error("Failed to load roles", e);
      }
    }

    fetchRoles();
  }, []);

  function openEditDrawer(user: User) {
    setSelectedUser(user);
    setEditFirstName(user.firstName || "");
    setEditLastName(user.lastName || "");
    setEditEmail(user.email || "");
    setEditEnabled(user.enabled ?? true);
    // pre‑select whatever roles this user already has for bhs-client
    setEditRoles(user.clientRoles?.[CLIENT_ID] || []);
    setDrawerOpen(true);
  }

  function closeEditDrawer() {
    setDrawerOpen(false);
    setSelectedUser(null);
  }

  function handleRoleToggle(role: string) {
    setEditRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  }

  async function handleSave() {
    if (!selectedUser) return;
    setSaving(true);
    setError("");

    try {
      const body = {
        user: {
          firstName: editFirstName,
          lastName: editLastName,
          email: editEmail,
          enabled: editEnabled,
          attributes: selectedUser.attributes,
        },
        // send updated client roles for bhs-client
        clientRoles: {
          [CLIENT_ID]: editRoles,
        },
      };

      const res = await fetch(`/api//update-user/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update user");
        setSaving(false);
        return;
      }

      // update local state so table shows new roles
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                firstName: editFirstName,
                lastName: editLastName,
                email: editEmail,
                enabled: editEnabled,
                clientRoles: {
                  ...(u.clientRoles || {}),
                  [CLIENT_ID]: editRoles,
                },
              }
            : u
        )
      );

      setSaving(false);
      closeEditDrawer();
    } catch (e) {
      setError("Failed to connect to server");
      setSaving(false);
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Admin Dashboard
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Roles ({CLIENT_ID})</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => {
                const avatarUrl = user.attributes?.avatarUrl?.[0];
                const fullName =
                  (user.firstName || "") +
                  (user.lastName ? ` ${user.lastName}` : "");
                const userClientRoles = user.clientRoles?.[CLIENT_ID] || [];

                return (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Avatar src={avatarUrl}>
                        {user.firstName?.[0] || user.username?.[0] || "U"}
                      </Avatar>
                    </TableCell>
                    <TableCell>{fullName || user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      {userClientRoles.length > 0 ? (
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {userClientRoles.map((role) => (
                            <Chip key={role} label={role} size="small" />
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          No roles
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.enabled ? "Active" : "Disabled"}
                        color={user.enabled ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => openEditDrawer(user)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={closeEditDrawer}
        PaperProps={{ sx: { width: 360, p: 3 } }}
      >
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Edit User
        </Typography>

        {selectedUser && (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="First Name"
              value={editFirstName}
              onChange={(e) => setEditFirstName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={editLastName}
              onChange={(e) => setEditLastName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={editEnabled}
                  onChange={(e) => setEditEnabled(e.target.checked)}
                />
              }
              label="Enabled"
            />

            <Typography variant="subtitle1" mt={1}>
              Roles ({CLIENT_ID})
            </Typography>
            <FormGroup>
              {availableRoles.map((role) => (
                <FormControlLabel
                  key={role}
                  control={
                    <Checkbox
                      checked={editRoles.includes(role)}
                      onChange={() => handleRoleToggle(role)}
                    />
                  }
                  label={role}
                />
              ))}
            </FormGroup>

            <Stack direction="row" justifyContent="flex-end" spacing={1} mt={2}>
              <Button onClick={closeEditDrawer} disabled={saving}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </Stack>
          </Box>
        )}
      </Drawer>
    </Container>
  );
};

export default AdminDashboard;
