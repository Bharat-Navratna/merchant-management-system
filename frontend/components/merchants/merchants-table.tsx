"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Merchant } from "@/lib/types";
import { StatusPill } from "@/components/ui/status-pill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MerchantsTable({ data }: { data: Merchant[] }) {
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<Merchant>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusPill status={row.original.status} /> },
      { accessorKey: "kybStatus", header: "KYB Status", cell: ({ row }) => <StatusPill status={row.original.kybStatus} /> },
      { accessorKey: "createdAt", header: "Created Date" },
      {
        id: "action",
        header: "",
        cell: ({ row }) => (
          <Button asChild variant="ghost" size="sm">
            <Link href={`/merchants/${row.original.id}`}>View</Link>
          </Button>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search merchants..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left font-medium text-muted-foreground">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-border hover:bg-muted/40 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
