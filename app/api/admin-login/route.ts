import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const keycloakUrl =
    "http://localhost:8080/realms/test-realm/protocol/openid-connect/token";
  const clientId = process.env.KEYCLOAK_ADMIN_CLIENT_ID!;
  const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET!;

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  console.log(params.toString());
  try {
    const response = await fetch(keycloakUrl, {
      method: "POST",
      body: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json(err, { status: response.status });
    }
    const data = await response.json();
    const res = NextResponse.json({ access_token: data.access_token });
    res.cookies.set("admin_access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
      sameSite: "lax",
    });
    return res;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get admin token", details: error },
      { status: 500 }
    );
  }
}
