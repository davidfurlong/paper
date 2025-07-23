import { NextRequest, NextResponse } from "next/server";
import { fetchEnsUser } from "~/utils/ens/converters/userConverter";

export async function GET(
  _req: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const { address } = params;
    
    if (!address) {
      return NextResponse.json(
        { error: "Address parameter is required" },
        { status: 400 }
      );
    }
    
    const user = await fetchEnsUser(address);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to fetch ENS user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}