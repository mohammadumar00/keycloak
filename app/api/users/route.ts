import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("admin_access_token")?.value;
  if (!accessToken) {
    return NextResponse.json(
      { error: "No admin access token found" },
      { status: 401 }
    );
  }
  const kcRes = await fetch(
    "http://localhost:8080/admin/realms/test-realm/users",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!kcRes.ok) {
    const errorData = await kcRes.json();
    return NextResponse.json(errorData, { status: kcRes.status });
  }
  const users = await kcRes.json();
  return NextResponse.json(users);
}
