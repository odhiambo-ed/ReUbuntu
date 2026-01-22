import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  useInventoryItems,
  useInventoryItem,
} from "@/features/inventory/hooks";
import * as api from "@/features/inventory/api";

jest.mock("@/features/inventory/api");

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

describe("useInventoryItems", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch inventory items successfully", async () => {
    const mockResponse = {
      data: [
        {
          id: 1,
          user_id: "user-1",
          upload_id: null,
          merchant_id: "M001",
          sku: "SKU001",
          title: "Test Item",
          brand: "TestBrand",
          category: "Tops",
          condition: "new" as const,
          original_price: 100,
          currency: "ZAR",
          quantity: 1,
          resale_price: 70,
          is_price_manual: false,
          status: "pending" as const,
          listed_at: null,
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
          condition_multiplier: 0.7,
          category_multiplier: 1.0,
          calculated_price: 70,
          price_difference: 30,
          discount_percentage: 30,
        },
      ],
      count: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    };

    mockedApi.fetchInventoryItems.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useInventoryItems({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockResponse);
    expect(mockedApi.fetchInventoryItems).toHaveBeenCalledWith({});
  });

  it("should handle error state", async () => {
    mockedApi.fetchInventoryItems.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useInventoryItems({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});

describe("useInventoryItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch single inventory item", async () => {
    const mockItem = {
      id: 1,
      user_id: "user-1",
      upload_id: null,
      merchant_id: "M001",
      sku: "SKU001",
      title: "Test Item",
      brand: "TestBrand",
      category: "Tops",
      condition: "new" as const,
      original_price: 100,
      currency: "ZAR",
      quantity: 1,
      resale_price: 70,
      is_price_manual: false,
      status: "pending" as const,
      listed_at: null,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
      condition_multiplier: 0.7,
      category_multiplier: 1.0,
      calculated_price: 70,
      price_difference: 30,
      discount_percentage: 30,
    };

    mockedApi.fetchInventoryItem.mockResolvedValue(mockItem);

    const { result } = renderHook(() => useInventoryItem(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockItem);
    expect(mockedApi.fetchInventoryItem).toHaveBeenCalledWith(1);
  });

  it("should not fetch when id is 0", () => {
    const { result } = renderHook(() => useInventoryItem(0), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBe(false);
    expect(mockedApi.fetchInventoryItem).not.toHaveBeenCalled();
  });
});
