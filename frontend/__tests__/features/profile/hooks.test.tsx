import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useCurrentProfile } from "@/features/profile/hooks";
import * as api from "@/features/profile/api";

jest.mock("@/features/profile/api");

const mockedApi = api as jest.Mocked<typeof api>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // eslint-disable-next-line react/display-name
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useCurrentProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch current profile successfully", async () => {
    const mockProfile = {
      id: "user-1",
      email: "test@example.com",
      full_name: "Test User",
      metadata: {},
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    };

    mockedApi.fetchCurrentProfile.mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useCurrentProfile(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockProfile);
  });

  it("should handle null profile (not logged in)", async () => {
    mockedApi.fetchCurrentProfile.mockResolvedValue(null);

    const { result } = renderHook(() => useCurrentProfile(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeNull();
  });
});
