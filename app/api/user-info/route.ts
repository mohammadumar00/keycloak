import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Get logged-in user's token from cookie
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("user_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Use Keycloak's userinfo endpoint to get user profile
    const response = await fetch(
      "http://localhost:9090/realms/bhs-realm/protocol/openid-connect/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // Check if response is OK and has content
    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return NextResponse.json(
        { error: "No user info returned" },
        { status: 404 }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || "Failed to fetch user info" },
        { status: response.status }
      );
    }

    const userInfo = await response.json();
    return NextResponse.json(userInfo);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch user profile",
        details: (error as any).message,
      },
      { status: 500 }
    );
  }
}
