import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const params = await context.params;
  const userId = params.userId;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("admin_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: "No admin access token found" },
      { status: 401 }
    );
  }

  try {
    const getUserResponse = await fetch(
      `http://localhost:8080/admin/realms/test-realm/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!getUserResponse.ok) {
      const errorData = await getUserResponse.json();
      return NextResponse.json(errorData, { status: getUserResponse.status });
    }

    const userInfo = await getUserResponse.json();
    return NextResponse.json(userInfo);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get user info", details: (error as any).message },
      { status: 500 }
    );
  }
}
