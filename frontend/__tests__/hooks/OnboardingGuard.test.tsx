import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useOnboardingStatus } from "@/hooks/OnboardingGuard";

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

jest.mock("@/features/profile/api", () => ({
  fetchCurrentProfile: jest.fn(),
}));

jest.mock("@/contexts/AuthContext", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => children,
  useAuth: () => ({
    user: { id: "test-user-id" },
    session: null,
    loading: false,
    logoutInProgress: false,
    error: null,
    signInWithEmail: jest.fn(),
    signUpWithEmail: jest.fn(),
    signInWithGoogle: jest.fn(),
    signOut: jest.fn(),
    refreshSession: jest.fn(),
  }),
}));

import { fetchCurrentProfile } from "@/features/profile/api";

const mockedFetchCurrentProfile = fetchCurrentProfile as jest.MockedFunction<
  typeof fetchCurrentProfile
>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  // eslint-disable-next-line react/display-name
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useOnboardingStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return isComplete true when all required fields are present", async () => {
    mockedFetchCurrentProfile.mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      full_name: "John Doe",
      metadata: {
        company_name: "Acme Inc",
        address: "123 Main St",
      },
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    });

    const { result } = renderHook(() => useOnboardingStatus(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isComplete).toBe(true);
    expect(result.current.missingFields).toEqual([]);
  });

  it("should return isComplete false when full_name is missing", async () => {
    mockedFetchCurrentProfile.mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      full_name: null,
      metadata: {
        company_name: "Acme Inc",
        address: "123 Main St",
      },
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    });

    const { result } = renderHook(() => useOnboardingStatus(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isComplete).toBe(false);
    expect(result.current.missingFields).toContain("full_name");
  });

  it("should return isComplete false when company_name is missing", async () => {
    mockedFetchCurrentProfile.mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      full_name: "John Doe",
      metadata: {
        address: "123 Main St",
      },
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    });

    const { result } = renderHook(() => useOnboardingStatus(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isComplete).toBe(false);
    expect(result.current.missingFields).toContain("company_name");
  });

  it("should return isComplete false when address is missing", async () => {
    mockedFetchCurrentProfile.mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      full_name: "John Doe",
      metadata: {
        company_name: "Acme Inc",
      },
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    });

    const { result } = renderHook(() => useOnboardingStatus(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isComplete).toBe(false);
    expect(result.current.missingFields).toContain("address");
  });

  it("should return all missing fields when profile is empty", async () => {
    mockedFetchCurrentProfile.mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      full_name: null,
      metadata: {},
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    });

    const { result } = renderHook(() => useOnboardingStatus(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isComplete).toBe(false);
    expect(result.current.missingFields).toEqual([
      "full_name",
      "company_name",
      "address",
    ]);
  });

  it("should return isComplete false when full_name is empty string", async () => {
    mockedFetchCurrentProfile.mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      full_name: "   ",
      metadata: {
        company_name: "Acme Inc",
        address: "123 Main St",
      },
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    });

    const { result } = renderHook(() => useOnboardingStatus(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isComplete).toBe(false);
    expect(result.current.missingFields).toContain("full_name");
  });
});
