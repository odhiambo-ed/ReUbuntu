"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Download,
  X,
  ArrowUpRight,
  Sparkles,
  Tag,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type {
  InventoryItem,
  InventoryFilters,
  ConditionType,
  StatusType,
} from "@/features/inventory";
import FilterSelect from "./FilterSelect";
import Checkbox from "./Checkbox";
import StatusBadge from "./StatusBadge";
import { InventoryPageSkeleton } from "./Skeletons";

interface InventoryViewProps {
  inventory: InventoryItem[];
  isLoading?: boolean;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  limit?: number;
  filters?: InventoryFilters;
  onUpdateItem: (item: InventoryItem) => void;
  onDeleteItem: (id: number) => void;
  onBulkStatusUpdate: (ids: number[], status: StatusType) => void;
  onPageChange?: (page: number) => void;
  onFiltersChange?: (filters: InventoryFilters) => void;
}

const InventoryView: React.FC<InventoryViewProps> = ({
  inventory,
  isLoading = false,
  totalCount = 0,
  currentPage = 1,
  totalPages = 1,
  limit = 10,
  filters = {},
  onUpdateItem,
  onDeleteItem,
  onBulkStatusUpdate,
  onPageChange,
  onFiltersChange,
}) => {
  void onDeleteItem;
  void onUpdateItem;
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeFilters, setActiveFilters] = useState({
    category: filters.category || "All Categories",
    condition: filters.condition || "All Conditions",
    status: filters.status || "All Statuses",
  });

  const filteredInventory = useMemo(() => {
    return inventory;
  }, [inventory]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (onFiltersChange) {
      onFiltersChange({
        ...filters,
        search: value || undefined,
      });
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...activeFilters, [filterType]: value };
    setActiveFilters(newFilters);

    if (onFiltersChange) {
      const apiFilters: InventoryFilters = {
        ...filters,
        search: searchTerm || undefined,
      };

      if (value !== "All Categories") apiFilters.category = value;
      if (value !== "All Conditions")
        apiFilters.condition = value as ConditionType;
      if (value !== "All Statuses") apiFilters.status = value as StatusType;

      onFiltersChange(apiFilters);
    }
  };

  const handleResetFilters = () => {
    setActiveFilters({
      category: "All Categories",
      condition: "All Conditions",
      status: "All Statuses",
    });
    setSearchTerm("");

    if (onFiltersChange) {
      onFiltersChange({});
    }
  };

  const handlePageChange = (page: number) => {
    if (onPageChange && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getPaginationInfo = () => {
    const start = (currentPage - 1) * limit + 1;
    const end = Math.min(currentPage * limit, totalCount);
    return { start, end };
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-9 h-9 flex items-center justify-center font-bold rounded-lg transition-all ${
            i === currentPage
              ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          {i}
        </button>,
      );
    }

    return buttons;
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredInventory.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredInventory.map((i) => i.id));
    }
  };

  const toggleSelectItem = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleBulkList = () => {
    onBulkStatusUpdate(selectedIds, "listed");
    setSelectedIds([]);
  };

  const handleBulkAutoPrice = () => {
    onBulkStatusUpdate(selectedIds, "priced");
    setSelectedIds([]);
  };

  const handleExportCsv = () => {
    if (filteredInventory.length === 0) return;

    const headers = [
      "merchant_id",
      "sku",
      "title",
      "brand",
      "category",
      "condition",
      "original_price",
      "resale_price",
      "currency",
      "quantity",
      "status",
    ];

    const csvRows = filteredInventory.map((item) => [
      item.merchant_id,
      item.sku,
      `"${item.title.replace(/"/g, '""')}"`,
      item.brand ? `"${item.brand.replace(/"/g, '""')}"` : "",
      item.category,
      item.condition,
      item.original_price,
      item.resale_price ?? "",
      item.currency,
      item.quantity,
      item.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvRows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <InventoryPageSkeleton />;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Inventory Management
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-slate-500 flex items-center gap-1">
              <Tag size={14} /> {totalCount} Total SKU
            </span>
            <span className="text-teal-600 font-bold text-xs bg-teal-50 px-2 py-0.5 rounded">
              +12% this month
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCsv}
            disabled={filteredInventory.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            Export CSV
          </button>
          <Link
            href="/dashboard/upload"
            className="flex items-center gap-2 px-6 py-2.5 bg-teal-500 text-white font-bold rounded-xl hover:bg-teal-600 shadow-lg shadow-teal-500/20 transition-all active:scale-95"
          >
            <Plus size={20} />
            Upload Inventory
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm flex flex-col md:flex-row items-center gap-3 shrink-0">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search SKU, Title, or Brand..."
            className="w-full pl-11 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-xl outline-none text-sm transition-all"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FilterSelect
            label="Category"
            value={activeFilters.category}
            onChange={(val) => handleFilterChange("category", val)}
            options={[
              "All Categories",
              "Outerwear",
              "Jackets",
              "Dresses",
              "Shoes",
              "Knitwear",
              "Bottoms",
              "Tops",
            ]}
          />
          <FilterSelect
            label="Condition"
            value={activeFilters.condition}
            onChange={(val) => handleFilterChange("condition", val)}
            options={["All Conditions", "new", "like_new", "good", "fair"]}
          />
          <FilterSelect
            label="Status"
            value={activeFilters.status}
            onChange={(val) => handleFilterChange("status", val)}
            options={["All Statuses", "pending", "priced", "listed", "sold"]}
          />
          <button
            onClick={handleResetFilters}
            className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
            title="Reset Filters"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1 relative">
        <div className="overflow-x-auto overflow-y-auto no-scrollbar flex-1 relative">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="sticky top-0 z-20">
              <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-100">
                <th className="px-6 py-5 w-12">
                  <Checkbox
                    checked={
                      selectedIds.length === filteredInventory.length &&
                      filteredInventory.length > 0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-5">SKU</th>
                <th className="px-6 py-5">Title & Brand</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Condition</th>
                <th className="px-6 py-5 text-right">Orig. Price</th>
                <th className="px-6 py-5 text-right">Resale Price</th>
                <th className="px-6 py-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredInventory.map((item) => (
                <tr
                  key={item.id}
                  className={`group hover:bg-slate-50/80 transition-all ${selectedIds.includes(item.id) ? "bg-teal-50/30" : ""}`}
                >
                  <td className="px-6 py-4">
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                      {item.sku}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium group-hover:text-slate-500">
                        {item.brand || "No Brand"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-500 uppercase">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-slate-600">
                      {item.condition
                        .split("_")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-slate-500">
                      R {item.original_price.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {item.resale_price ? (
                      <span className="text-sm font-black text-teal-600">
                        R {item.resale_price.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-xs italic text-slate-400">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <StatusBadge status={item.status} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredInventory.length === 0 && (
            <div className="p-20 flex flex-col items-center justify-center text-slate-400">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search size={32} />
              </div>
              <p className="font-bold text-lg text-slate-600">No items found</p>
              <p className="text-sm">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>

        {selectedIds.length > 0 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30">
            <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-2 pl-6 flex items-center gap-6 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center gap-3 pr-6 border-r border-slate-700">
                <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-xs font-black">
                  {selectedIds.length}
                </div>
                <span className="text-sm font-bold whitespace-nowrap">
                  Items Selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkAutoPrice}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-slate-800 rounded-xl transition-all text-sm font-bold group"
                >
                  <Sparkles
                    size={16}
                    className="text-teal-400 group-hover:scale-110 transition-transform"
                  />
                  Auto-Price
                </button>
                <button
                  onClick={handleBulkList}
                  className="flex items-center gap-2 px-6 py-2 bg-teal-500 hover:bg-teal-400 rounded-xl transition-all text-sm font-bold shadow-lg shadow-teal-500/20"
                >
                  <ArrowUpRight size={16} />
                  List Selected
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 border-t border-slate-100 flex items-center justify-between shrink-0">
          <p className="text-sm text-slate-400 font-medium">
            {totalCount > 0 ? (
              <>
                Showing {getPaginationInfo().start}-{getPaginationInfo().end} of{" "}
                {totalCount} items
              </>
            ) : (
              <>No items found</>
            )}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-all border border-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center">{renderPaginationButtons()}</div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-all border border-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryView;
