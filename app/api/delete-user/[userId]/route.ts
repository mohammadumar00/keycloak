import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
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
    const deleteUserResponse = await fetch(
      `http://localhost:9090/admin/realms/bhs-realm/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!deleteUserResponse.ok) {
      const errorData = await deleteUserResponse.json();
      return NextResponse.json(errorData, {
        status: deleteUserResponse.status,
      });
    }

    return NextResponse.json({
      message: `User ${userId} deleted successfully`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user", details: (error as any).message },
      { status: 500 }
    );
  }
}
