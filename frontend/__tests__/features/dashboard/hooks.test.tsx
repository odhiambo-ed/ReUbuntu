import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  useDashboardStats,
  useInventoryByCategory,
  useInventoryByCondition,
  useInventoryByStatus,
} from "@/features/dashboard/hooks";
import * as api from "@/features/dashboard/api";

jest.mock("@/features/dashboard/api");

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

describe("useDashboardStats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch dashboard stats successfully", async () => {
    const mockStats = {
      totalItems: 100,
      pendingItems: 20,
      pricedItems: 30,
      listedItems: 40,
      soldItems: 10,
      totalValue: 5000,
      averagePrice: 50,
      recentUploads: 5,
    };

    mockedApi.fetchDashboardStats.mockResolvedValue(mockStats);

    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockStats);
  });
});

describe("useInventoryByCategory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch inventory by category", async () => {
    const mockData = [
      { category: "Tops", count: 50, totalValue: 2500 },
      { category: "Dresses", count: 30, totalValue: 1500 },
    ];

    mockedApi.fetchInventoryByCategory.mockResolvedValue(mockData);

    const { result } = renderHook(() => useInventoryByCategory(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
  });
});

describe("useInventoryByCondition", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch inventory by condition", async () => {
    const mockData = [
      { condition: "new", count: 40 },
      { condition: "good", count: 35 },
    ];

    mockedApi.fetchInventoryByCondition.mockResolvedValue(mockData);

    const { result } = renderHook(() => useInventoryByCondition(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
  });
});

describe("useInventoryByStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch inventory by status", async () => {
    const mockData = [
      { status: "pending", count: 20 },
      { status: "priced", count: 30 },
    ];

    mockedApi.fetchInventoryByStatus.mockResolvedValue(mockData);

    const { result } = renderHook(() => useInventoryByStatus(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
  });
});
