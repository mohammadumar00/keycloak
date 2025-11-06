import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const params = await context.params; // Await this!
  const userId = params.userId;
  
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("admin_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: "No admin access token found" },
      { status: 401 }
    );
  }

  const userBody = await req.json();

  const kcRes = await fetch(
    `http://localhost:8080/admin/realms/test-realm/users/${userId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userBody),
    }
  );

  if (!kcRes.ok) {
    const errorData = await kcRes.json();
    return NextResponse.json(errorData, { status: kcRes.status });
  }

  return NextResponse.json({ message: `User ${userId} updated successfully` });
}
