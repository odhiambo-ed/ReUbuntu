import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LoadingProvider } from "@/contexts/LoadingContext";

// Mock Supabase client
const mockSignInWithPassword = jest.fn();
const mockSignUp = jest.fn();
const mockSignInWithOAuth = jest.fn();
const mockSignOut = jest.fn();
const mockGetSession = jest.fn();
const mockOnAuthStateChange = jest.fn();

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signInWithOAuth: mockSignInWithOAuth,
      signOut: mockSignOut,
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
  }),
}));

// Mock fetch for API calls
global.fetch = jest.fn();

// Test component to access auth context
function TestComponent({
  onAuth,
}: {
  onAuth: (auth: ReturnType<typeof useAuth>) => void;
}) {
  const auth = useAuth();
  React.useEffect(() => {
    onAuth(auth);
  }, [auth, onAuth]);
  return <div data-testid="test">Loaded</div>;
}

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  describe("useAuth hook", () => {
    it("throws error when used outside AuthProvider", () => {
      const consoleError = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponent onAuth={() => {}} />);
      }).toThrow("useAuth must be used within an AuthProvider");

      consoleError.mockRestore();
    });
  });

  describe("AuthProvider", () => {
    it("provides initial loading state", async () => {
      let authValue: ReturnType<typeof useAuth> | null = null;

      render(
        <LoadingProvider>
          <AuthProvider>
            <TestComponent
              onAuth={(auth) => {
                authValue = auth;
              }}
            />
          </AuthProvider>
        </LoadingProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("test")).toBeInTheDocument();
      });

      expect(authValue).not.toBeNull();
      expect(authValue!.user).toBeNull();
      expect(authValue!.session).toBeNull();
    });

    it("bootstraps session on mount", async () => {
      const mockSession = {
        user: { id: "123", email: "test@example.com" },
        access_token: "token",
        refresh_token: "refresh",
      };
      mockGetSession.mockResolvedValue({ data: { session: mockSession } });

      let authValue: ReturnType<typeof useAuth> | null = null;

      render(
        <LoadingProvider>
          <AuthProvider>
            <TestComponent
              onAuth={(auth) => {
                authValue = auth;
              }}
            />
          </AuthProvider>
        </LoadingProvider>,
      );

      await waitFor(() => {
        expect(authValue?.user?.email).toBe("test@example.com");
      });

      expect(mockGetSession).toHaveBeenCalled();
    });
  });

  describe("signInWithEmail", () => {
    it("calls supabase signInWithPassword and syncs cookies on success", async () => {
      const mockSession = {
        user: { id: "123", email: "test@example.com" },
        access_token: "access_token",
        refresh_token: "refresh_token",
      };
      mockSignInWithPassword.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      let authValue: ReturnType<typeof useAuth> | null = null;

      render(
        <LoadingProvider>
          <AuthProvider>
            <TestComponent
              onAuth={(auth) => {
                authValue = auth;
              }}
            />
          </AuthProvider>
        </LoadingProvider>,
      );

      await waitFor(() => {
        expect(authValue).not.toBeNull();
      });

      await act(async () => {
        const result = await authValue!.signInWithEmail(
          "test@example.com",
          "password123",
        );
        expect(result.error).toBeNull();
      });

      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/callback",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            access_token: "access_token",
            refresh_token: "refresh_token",
          }),
        }),
      );
    });

    it("returns error on failed login", async () => {
      const mockError = { message: "Invalid credentials", status: 401 };
      mockSignInWithPassword.mockResolvedValue({
        data: { session: null },
        error: mockError,
      });

      let authValue: ReturnType<typeof useAuth> | null = null;

      render(
        <LoadingProvider>
          <AuthProvider>
            <TestComponent
              onAuth={(auth) => {
                authValue = auth;
              }}
            />
          </AuthProvider>
        </LoadingProvider>,
      );

      await waitFor(() => {
        expect(authValue).not.toBeNull();
      });

      await act(async () => {
        const result = await authValue!.signInWithEmail(
          "test@example.com",
          "wrongpassword",
        );
        expect(result.error).toEqual(mockError);
      });
    });
  });

  describe("signUpWithEmail", () => {
    it("calls supabase signUp with user data", async () => {
      mockSignUp.mockResolvedValue({ data: {}, error: null });

      let authValue: ReturnType<typeof useAuth> | null = null;

      render(
        <LoadingProvider>
          <AuthProvider>
            <TestComponent
              onAuth={(auth) => {
                authValue = auth;
              }}
            />
          </AuthProvider>
        </LoadingProvider>,
      );

      await waitFor(() => {
        expect(authValue).not.toBeNull();
      });

      await act(async () => {
        const result = await authValue!.signUpWithEmail(
          "new@example.com",
          "password123",
          { name: "Test User" },
        );
        expect(result.error).toBeNull();
      });

      expect(mockSignUp).toHaveBeenCalledWith({
        email: "new@example.com",
        password: "password123",
        options: {
          data: { name: "Test User" },
          emailRedirectTo: expect.stringContaining("/auth/callback"),
        },
      });
    });

    it("returns error on failed signup", async () => {
      const mockError = { message: "Email already registered", status: 400 };
      mockSignUp.mockResolvedValue({ error: mockError });

      let authValue: ReturnType<typeof useAuth> | null = null;

      render(
        <LoadingProvider>
          <AuthProvider>
            <TestComponent
              onAuth={(auth) => {
                authValue = auth;
              }}
            />
          </AuthProvider>
        </LoadingProvider>,
      );

      await waitFor(() => {
        expect(authValue).not.toBeNull();
      });

      await act(async () => {
        const result = await authValue!.signUpWithEmail(
          "existing@example.com",
          "password123",
        );
        expect(result.error).toEqual(mockError);
      });
    });
  });

  describe("signInWithGoogle", () => {
    it("calls supabase signInWithOAuth with google provider", async () => {
      mockSignInWithOAuth.mockResolvedValue({ error: null });

      let authValue: ReturnType<typeof useAuth> | null = null;

      render(
        <LoadingProvider>
          <AuthProvider>
            <TestComponent
              onAuth={(auth) => {
                authValue = auth;
              }}
            />
          </AuthProvider>
        </LoadingProvider>,
      );

      await waitFor(() => {
        expect(authValue).not.toBeNull();
      });

      await act(async () => {
        const result = await authValue!.signInWithGoogle();
        expect(result.error).toBeNull();
      });

      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: {
          redirectTo: expect.stringContaining("/auth/callback"),
        },
      });
    });
  });

  describe("signOut", () => {
    it("clears user and session and sets logoutInProgress", async () => {
      const mockSession = {
        user: { id: "123", email: "test@example.com" },
        access_token: "token",
        refresh_token: "refresh",
      };
      mockGetSession.mockResolvedValue({ data: { session: mockSession } });
      mockSignOut.mockResolvedValue({ error: null });

      let authValue: ReturnType<typeof useAuth> | null = null;

      render(
        <LoadingProvider>
          <AuthProvider>
            <TestComponent
              onAuth={(auth) => {
                authValue = auth;
              }}
            />
          </AuthProvider>
        </LoadingProvider>,
      );

      await waitFor(() => {
        expect(authValue?.user?.email).toBe("test@example.com");
      });

      // signOut clears user/session immediately before redirect
      // We verify state is cleared; navigation is tested e2e
      await act(async () => {
        try {
          await authValue!.signOut();
        } catch {
          // jsdom throws on navigation - expected
        }
      });

      expect(authValue!.user).toBeNull();
      expect(authValue!.session).toBeNull();
    });
  });

  describe("auth state change listener", () => {
    it("updates state on SIGNED_OUT event", async () => {
      let authStateCallback:
        | ((event: string, session: unknown) => void)
        | null = null;

      mockOnAuthStateChange.mockImplementation((callback) => {
        authStateCallback = callback;
        return { data: { subscription: { unsubscribe: jest.fn() } } };
      });

      const mockSession = {
        user: { id: "123", email: "test@example.com" },
        access_token: "token",
        refresh_token: "refresh",
      };
      mockGetSession.mockResolvedValue({ data: { session: mockSession } });

      let authValue: ReturnType<typeof useAuth> | null = null;

      render(
        <LoadingProvider>
          <AuthProvider>
            <TestComponent
              onAuth={(auth) => {
                authValue = auth;
              }}
            />
          </AuthProvider>
        </LoadingProvider>,
      );

      await waitFor(() => {
        expect(authValue?.user?.email).toBe("test@example.com");
      });

      // Simulate SIGNED_OUT event
      await act(async () => {
        authStateCallback?.("SIGNED_OUT", null);
      });

      await waitFor(() => {
        expect(authValue?.user).toBeNull();
        expect(authValue?.session).toBeNull();
      });
    });
  });
});
