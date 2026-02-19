import { NextRequest, NextResponse } from "next/server";

// Proxy to backend API server
const API_URL = process.env.API_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const industry = searchParams.get("industry");
    const slug = searchParams.get("slug");
    
    let url = `${API_URL}/api/case-studies`;
    
    if (slug) {
      url = `${API_URL}/api/case-studies/${slug}`;
    } else if (featured) {
      url = `${API_URL}/api/case-studies/featured`;
    } else if (industry) {
      url = `${API_URL}/api/case-studies?industry=${industry}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Case Studies API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_URL}/api/case-studies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, { 
      status: response.status 
    });
  } catch (error) {
    console.error("Case Studies API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}