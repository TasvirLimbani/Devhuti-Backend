import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Mock authentication - in production, verify against a real database
    // For demo purposes, accept any email/password combination
    // In real app: hash password, check database, generate JWT token

    const mockUsers: Record<
      string,
      { id: string; email: string; name: string; password: string }
    > = {
      "admin@example.com": {
        id: "1",
        email: "admin@example.com",
        name: "Admin User",
        password: "admin123",
      },
      "user@example.com": {
        id: "2",
        email: "user@example.com",
        name: "John Doe",
        password: "user123",
      },
    }

    const user = mockUsers[email]

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Generate a mock token (in production, use JWT or similar)
    const token = Buffer.from(`${email}:${Date.now()}`).toString("base64")

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      token: token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
