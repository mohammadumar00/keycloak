// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";

// export async function GET(req: NextRequest) {
//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get("admin_access_token")?.value;
//   if (!accessToken) {
//     return NextResponse.json(
//       { error: "No admin access token found" },
//       { status: 401 }
//     );
//   }
//   const kcRes = await fetch(
//     "http://localhost:9090/admin/realms/bhs-realm/users",
//     {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     }
//   );
//   if (!kcRes.ok) {
//     const errorData = await kcRes.json();
//     return NextResponse.json(errorData, { status: kcRes.status });
//   }
//   const users = await kcRes.json();
//   return NextResponse.json(users);
// }

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const KEYCLOAK_BASE = "http://localhost:9090";
const REALM = "bhs-realm";
const CLIENT_ID = "bhs-client";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("admin_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: "No admin access token found" },
      { status: 401 }
    );
  }

  // 1) get all users
  const kcRes = await fetch(`${KEYCLOAK_BASE}/admin/realms/${REALM}/users`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!kcRes.ok) {
    const errorData = await kcRes.json();
    return NextResponse.json(errorData, { status: kcRes.status });
  }

  const users = await kcRes.json();

  // 2) resolve client UUID for bhs-client (once)
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

  // 3) for each user, fetch their client roles for bhs-client
  const enrichedUsers = await Promise.all(
    users.map(async (u: any) => {
      const rolesRes = await fetch(
        `${KEYCLOAK_BASE}/admin/realms/${REALM}/users/${u.id}/role-mappings/clients/${clientUuid}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      let clientRoles: string[] = [];
      if (rolesRes.ok) {
        const roleReps = await rolesRes.json();
        clientRoles = roleReps.map((r: any) => r.name);
      }

      return {
        ...u,
        clientRoles: {
          [CLIENT_ID]: clientRoles,
        },
      };
    })
  );

  return NextResponse.json(enrichedUsers);
}
