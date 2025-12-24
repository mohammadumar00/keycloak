import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const params = new URLSearchParams();
  params.append("grant_type", "password");
  params.append("client_id", "bhs-client"); // your client id
  params.append("client_secret", process.env.KEYCLOAK_CLIENT_SECRET);
  params.append("username", username);
  params.append("password", password);
  params.append("scope", "openid profile email");

  const response = await fetch(
    "http://localhost:9090/realms/bhs-realm/protocol/openid-connect/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    }
  );
  const data = await response.json();
  if (response.ok) {
    const res = NextResponse.json(data);

    // Set cookie with access_token
    res.cookies.set("user_access_token", data.access_token, {
      httpOnly: true,
      path: "/", // root path for global access
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      maxAge: data.expires_in, // typically seconds till expiry
      sameSite: "lax",
    });

    return res;
  } else {
    return NextResponse.json(
      { error: data.error_description || "Invalid credentials" },
      { status: 401 }
    );
  }
}
