import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const KEYCLOAK_BASE = "http://localhost:9090";
const REALM = "bhs-realm";
const CLIENT_ID = "bhs-client";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("admin_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: "No admin access token found" },
      { status: 401 }
    );
  }

  // 1) find internal client uuid
  const clientsRes = await fetch(
    `${KEYCLOAK_BASE}/admin/realms/${REALM}/clients?clientId=${CLIENT_ID}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!clientsRes.ok) {
    const err = await clientsRes.text();
    return NextResponse.json(
      { error: "Failed to load clients", details: err },
      { status: clientsRes.status }
    );
  }

  const clients = await clientsRes.json();
  const client = clients[0];
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 400 });
  }

  const clientUuid = client.id;

  // 2) get all roles for that client
  const rolesRes = await fetch(
    `${KEYCLOAK_BASE}/admin/realms/${REALM}/clients/${clientUuid}/roles`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!rolesRes.ok) {
    const err = await rolesRes.text();
    return NextResponse.json(
      { error: "Failed to load client roles", details: err },
      { status: rolesRes.status }
    );
  }

  const roles = await rolesRes.json();

  // return only names if you want
  return NextResponse.json({
    clientId: CLIENT_ID,
    roles: roles.map((r: any) => r.name),
  });
}
