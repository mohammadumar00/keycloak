import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;

  console.log("Updating user:", userId);

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("admin_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: "No admin access token found" },
      { status: 401 }
    );
  }

  const { user, realmRoles, clientRoles } = await req.json();

  // 1) Update basic user fields
  const userRes = await fetch(
    `http://localhost:9090/admin/realms/bhs-realm/users/${userId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }
  );

  if (!userRes.ok) {
    const errorData = await userRes.json();
    return NextResponse.json(errorData, { status: userRes.status });
  }

  // 2) Update realm roles (simple strategy: replace set)
  if (Array.isArray(realmRoles)) {
    // a) Get all realm roles definitions to map names -> {id, name}
    const allRealmRolesRes = await fetch(
      "http://localhost:9090/admin/realms/bhs-realm/roles",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const allRealmRoles = await allRealmRolesRes.json();
    console.log("All realm roles:", allRealmRoles);

    const wantedRealmRoles = allRealmRoles.filter((r: any) =>
      realmRoles.includes(r.name)
    );

    // b) Remove all current realm roles
    const currentRealmRolesRes = await fetch(
      `http://localhost:9090/admin/realms/bhs-realm/users/${userId}/role-mappings/realm`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const currentRealmRoles = await currentRealmRolesRes.json();
    console.log("Current realm roles:", currentRealmRoles);

    if (currentRealmRoles.length > 0) {
      await fetch(
        `http://localhost:9090/admin/realms/bhs-realm/users/${userId}/role-mappings/realm`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentRealmRoles),
        }
      );
    }

    // c) Add desired realm roles
    if (wantedRealmRoles.length > 0) {
      await fetch(
        `http://localhost:9090/admin/realms/bhs-realm/users/${userId}/role-mappings/realm`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(wantedRealmRoles),
        }
      );
    }
  }

  // 3) Update client roles (example only for "bhs-client")
  if (clientRoles && clientRoles["bhs-client"]) {
    const clientId = "bhs-client"; // public ID
    // 3a) find internal client uuid
    const clientsRes = await fetch(
      "http://localhost:9090/admin/realms/bhs-realm/clients",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const clients = await clientsRes.json();
    console.log("All clients:", clients);
    const client = clients.find((c: any) => c.clientId === clientId);
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 400 });
    }

    const clientUuid = client.id;

    // 3b) get all client roles
    const allClientRolesRes = await fetch(
      `http://localhost:9090/admin/realms/bhs-realm/clients/${clientUuid}/roles`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const allClientRoles = await allClientRolesRes.json();
    console.log("All client roles:", allClientRoles);

    const desiredNames: string[] = clientRoles["bhs-client"];
    const wantedClientRoles = allClientRoles.filter((r: any) =>
      desiredNames.includes(r.name)
    );

    // 3c) remove current client roles
    const currentClientRolesRes = await fetch(
      `http://localhost:9090/admin/realms/bhs-realm/users/${userId}/role-mappings/clients/${clientUuid}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const currentClientRoles = await currentClientRolesRes.json();

    if (currentClientRoles.length > 0) {
      await fetch(
        `http://localhost:9090/admin/realms/bhs-realm/users/${userId}/role-mappings/clients/${clientUuid}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentClientRoles),
        }
      );
    }

    // 3d) add desired client roles
    if (wantedClientRoles.length > 0) {
      await fetch(
        `http://localhost:9090/admin/realms/bhs-realm/users/${userId}/role-mappings/clients/${clientUuid}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(wantedClientRoles),
        }
      );
    }
  }

  return NextResponse.json({ message: `User ${userId} updated successfully` });
}
