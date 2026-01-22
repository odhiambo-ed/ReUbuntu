import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  useConditionMultipliers,
  useCategoryMultipliers,
  usePricingConfig,
} from "@/features/pricing/hooks";
import * as api from "@/features/pricing/api";

jest.mock("@/features/pricing/api");

const mockedApi = api as jest.Mocked<typeof api>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }
  Wrapper.displayName = "TestWrapper";
  return Wrapper;
}

describe("useConditionMultipliers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch condition multipliers", async () => {
    const mockData = [
      {
        condition: "new",
        multiplier: 0.7,
        description: "Brand new",
        created_at: "",
        updated_at: "",
      },
      {
        condition: "good",
        multiplier: 0.5,
        description: "Good condition",
        created_at: "",
        updated_at: "",
      },
    ];

    mockedApi.fetchConditionMultipliers.mockResolvedValue(mockData);

    const { result } = renderHook(() => useConditionMultipliers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
  });
});

describe("useCategoryMultipliers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch category multipliers", async () => {
    const mockData = [
      {
        category: "Outerwear",
        multiplier: 1.1,
        description: "Coats",
        created_at: "",
        updated_at: "",
      },
      {
        category: "Tops",
        multiplier: 0.8,
        description: "Shirts",
        created_at: "",
        updated_at: "",
      },
    ];

    mockedApi.fetchCategoryMultipliers.mockResolvedValue(mockData);

    const { result } = renderHook(() => useCategoryMultipliers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
  });
});

describe("usePricingConfig", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch pricing config with both multipliers", async () => {
    const mockConfig = {
      conditionMultipliers: [
        {
          condition: "new",
          multiplier: 0.7,
          description: "Brand new",
          created_at: "",
          updated_at: "",
        },
      ],
      categoryMultipliers: [
        {
          category: "Tops",
          multiplier: 0.8,
          description: "Shirts",
          created_at: "",
          updated_at: "",
        },
      ],
    };

    mockedApi.fetchPricingConfig.mockResolvedValue(mockConfig);

    const { result } = renderHook(() => usePricingConfig(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockConfig);
  });
});
