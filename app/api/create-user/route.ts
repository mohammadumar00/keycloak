import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  // const cookieStore = cookies();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("admin_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: "No admin access token found" },
      { status: 401 }
    );
  }
  console.log("Access Token:", accessToken);
  const userBody = await req.json();
  const kcRes = await fetch(
    "http://localhost:8080/admin/realms/test-realm/users",
    {
      method: "POST",
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
  return new NextResponse(null, { status: 201 });
}
