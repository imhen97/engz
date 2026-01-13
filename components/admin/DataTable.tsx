"use client";

import { useState } from "react";

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: <K extends keyof T>(value: T[K], row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
};

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchable = false,
  searchPlaceholder = "검색...",
  onRowClick,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = searchable
    ? data.filter((row) =>
        columns.some((col) => {
          const value = row[col.key as keyof T];
          return value
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        })
      )
    : data;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {searchable && (
        <div className="border-b border-gray-200 p-4">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#FF6B3D] focus:outline-none focus:ring-2 focus:ring-[#FF6B3D]/20"
          />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key as string}
                  className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              filteredData.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => onRowClick?.(row)}
                  className={`transition-colors ${
                    onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key as string}
                      className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                    >
                      {col.render
                        ? col.render(row[col.key as keyof T], row)
                        : row[col.key as keyof T]?.toString() || "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
