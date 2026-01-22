import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  useUploads,
  useUpload,
  useUploadErrors,
} from "@/features/uploads/hooks";
import * as api from "@/features/uploads/api";

jest.mock("@/features/uploads/api");

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

describe("useUploads", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch uploads successfully", async () => {
    const mockResponse = {
      data: [
        {
          id: 1,
          user_id: "user-1",
          filename: "test.csv",
          file_path: "user-1/test.csv",
          file_size_bytes: 1024,
          status: "completed" as const,
          total_rows: 100,
          success_count: 95,
          error_count: 5,
          processing_started_at: "2024-01-01T10:00:00Z",
          processing_completed_at: "2024-01-01T10:01:00Z",
          created_at: "2024-01-01T10:00:00Z",
          updated_at: "2024-01-01T10:01:00Z",
          success_rate: 95,
          error_details_count: 5,
        },
      ],
      count: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    };

    mockedApi.fetchUploads.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUploads({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockResponse);
    expect(mockedApi.fetchUploads).toHaveBeenCalledWith({});
  });
});

describe("useUpload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch single upload", async () => {
    const mockUpload = {
      id: 1,
      user_id: "user-1",
      filename: "test.csv",
      file_path: "user-1/test.csv",
      file_size_bytes: 1024,
      status: "completed" as const,
      total_rows: 100,
      success_count: 95,
      error_count: 5,
      processing_started_at: "2024-01-01T10:00:00Z",
      processing_completed_at: "2024-01-01T10:01:00Z",
      created_at: "2024-01-01T10:00:00Z",
      updated_at: "2024-01-01T10:01:00Z",
      success_rate: 95,
      error_details_count: 5,
    };

    mockedApi.fetchUpload.mockResolvedValue(mockUpload);

    const { result } = renderHook(() => useUpload(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockUpload);
    expect(mockedApi.fetchUpload).toHaveBeenCalledWith(1);
  });
});

describe("useUploadErrors", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch upload errors", async () => {
    const mockErrors = [
      {
        id: 1,
        upload_id: 1,
        row_number: 5,
        field_name: "price",
        error_type: "invalid_format" as const,
        error_message: "Price must be a number",
        raw_data: { price: "invalid" },
        created_at: "2024-01-01T10:00:00Z",
      },
    ];

    mockedApi.fetchUploadErrors.mockResolvedValue(mockErrors);

    const { result } = renderHook(() => useUploadErrors(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockErrors);
    expect(mockedApi.fetchUploadErrors).toHaveBeenCalledWith(1);
  });
});
