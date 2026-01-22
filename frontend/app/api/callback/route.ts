import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  try {
    // Basic CSRF protection - ensure Content-Type is application/json
    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 },
      );
    }

    const { access_token, refresh_token } = await req.json();
    console.log(
      "[API Callback] Received tokens:",
      access_token ? "Present" : "Missing",
      refresh_token ? "Present" : "Missing",
    );

    if (!access_token || !refresh_token) {
      return NextResponse.json({ error: "Missing tokens" }, { status: 400 });
    }

    // Create a response object that we can modify with cookies
    const response = new NextResponse();

    // Create a Supabase client for this API route handler
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: Record<string, unknown>) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: Record<string, unknown>) {
            response.cookies.set({
              name,
              value: "",
              ...options,
            });
          },
        },
      },
    );

    // Set the session using the tokens
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) {
      console.error("[API Callback] setSession error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log(
      "[API Callback] Session set successfully for user:",
      data.user?.email,
    );

    // Create a JSON response
    const jsonResponse = NextResponse.json({
      success: true,
      userId: data.user?.id,
    });

    // Copy all cookies from our response to the JSON response
    response.cookies.getAll().forEach((cookie) => {
      jsonResponse.cookies.set(cookie);
    });

    return jsonResponse;
  } catch (error) {
    console.error("[API Callback] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
