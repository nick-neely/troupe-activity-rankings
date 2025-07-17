"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  ExternalLink,
  Heart,
  MapPin,
  MoreHorizontal,
  Tags,
  ThumbsUp,
  X,
} from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActivityStore } from "@/lib/store";
import type { ActivityData } from "@/lib/utils";

const columns: ColumnDef<ActivityData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="rounded-lg"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="rounded-lg"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Activity Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium text-slate-900 max-w-xs">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      const categoryColors: Record<string, string> = {
        Food: "bg-orange-100 text-orange-800 border-orange-200",
        Entertainment: "bg-purple-100 text-purple-800 border-purple-200",
        Recreation: "bg-blue-100 text-blue-800 border-blue-200",
        Outdoors: "bg-green-100 text-green-800 border-green-200",
        Wellness: "bg-pink-100 text-pink-800 border-pink-200",
      };

      return (
        <Badge
          variant="outline"
          className={`rounded-xl font-medium ${
            categoryColors[category] ||
            "bg-slate-100 text-slate-800 border-slate-200"
          }`}
        >
          {category}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "groupNames",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          <Tags className="mr-1 h-4 w-4 text-blue-500" />
          Groups
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const groupNames = row.getValue("groupNames") as string;
      if (!groupNames || groupNames.trim() === "") {
        return <div className="text-center text-slate-400 text-sm">—</div>;
      }

      // Split multiple group names by " / " and display as individual badges
      const groups = groupNames
        .split(" / ")
        .map((g) => g.trim())
        .filter(Boolean);

      if (groups.length === 0) {
        return <div className="text-center text-slate-400 text-sm">—</div>;
      }

      return (
        <div className="flex flex-wrap gap-1 justify-center">
          {groups.map((group, index) => (
            <Badge
              key={index}
              variant="outline"
              className="rounded-xl font-medium bg-blue-50 text-blue-700 border-blue-200 text-xs"
            >
              {group}
            </Badge>
          ))}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const groupNames = row.getValue(id) as string;
      if (!groupNames) return false;
      const groups = groupNames.split(" / ").map((g) => g.trim());
      return value.some((filterValue: string) => groups.includes(filterValue));
    },
  },
  {
    accessorKey: "website_link",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            <ExternalLink className="mr-1 h-4 w-4 text-green-500" />
            Website
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const websiteLink = row.getValue("website_link") as string;
      if (!websiteLink)
        return <div className="text-center text-slate-400 text-sm">—</div>;

      return (
        <div className="text-center">
          <a
            href={websiteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-green-600 hover:text-green-800 font-medium transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      );
    },
  },
  {
    accessorKey: "google_maps_url",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold hover:bg-transparent"
          >
            <MapPin className="mr-1 h-4 w-4 text-red-500" />
            Location
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const mapsUrl = row.getValue("google_maps_url") as string;
      if (!mapsUrl)
        return <div className="text-center text-slate-400 text-sm">—</div>;

      return (
        <div className="text-center">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-red-600 hover:text-red-800 font-medium transition-colors"
          >
            <MapPin className="h-4 w-4" />
          </a>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-slate-700">{row.getValue("price") || "N/A"}</div>
    ),
  },
  {
    accessorKey: "love_votes",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          <Heart className="mr-1 h-4 w-4 text-pink-500" />
          Love
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center font-medium text-pink-600 font-mono">
        {row.getValue("love_votes")}
      </div>
    ),
  },
  {
    accessorKey: "like_votes",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          <ThumbsUp className="mr-1 h-4 w-4 text-green-500" />
          Like
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center font-medium text-green-600 font-mono">
        {row.getValue("like_votes")}
      </div>
    ),
  },
  {
    accessorKey: "pass_votes",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Pass
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center font-medium text-slate-600 font-mono">
        {row.getValue("pass_votes")}
      </div>
    ),
  },
  {
    accessorKey: "score",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const score = row.getValue("score") as number;
      const scoreColor =
        score >= 8
          ? "text-green-600"
          : score >= 5
          ? "text-blue-600"
          : score >= 2
          ? "text-yellow-600"
          : "text-red-600";

      return (
        <div
          className={`text-center font-bold text-lg font-mono ${scoreColor}`}
        >
          {score}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const activity = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-xl">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(activity.name)}
              className="rounded-xl"
            >
              Copy activity name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {activity.website_link && (
              <DropdownMenuItem asChild className="rounded-xl">
                <a
                  href={activity.website_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit website
                </a>
              </DropdownMenuItem>
            )}
            {activity.google_maps_url && (
              <DropdownMenuItem asChild className="rounded-xl">
                <a
                  href={activity.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  View on Maps
                </a>
              </DropdownMenuItem>
            )}
            {(activity.website_link || activity.google_maps_url) && (
              <DropdownMenuSeparator />
            )}
            <DropdownMenuItem className="rounded-xl">
              View details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function ActivitiesTable() {
  const activities = useActivityStore((state) => state.activities);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "score", desc: true }, // Default sort by score descending
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      groupNames: false, // Hide by default
      website_link: false, // Hide by default
      google_maps_url: false, // Hide by default
    });
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: activities,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const categories = React.useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(activities.map((a) => a.category).filter(Boolean))
    );
    return uniqueCategories;
  }, [activities]);

  const groupNames = React.useMemo(() => {
    const allGroups = activities
      .map((a) => a.groupNames)
      .filter(Boolean)
      .flatMap((groups) => groups!.split(" / "))
      .map((group) => group.trim())
      .filter(Boolean);
    const uniqueGroups = Array.from(new Set(allGroups));
    return uniqueGroups.sort();
  }, [activities]);

  const selectedCategoryFilter =
    (table.getColumn("category")?.getFilterValue() as string[]) ?? [];
  const selectedGroupFilter =
    (table.getColumn("groupNames")?.getFilterValue() as string[]) ?? [];

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Filter activities..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm rounded-2xl border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
          />

          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="rounded-2xl border-slate-300 bg-transparent"
              >
                Categories
                {selectedCategoryFilter.length > 0 && (
                  <Badge variant="secondary" className="ml-2 rounded-xl">
                    {selectedCategoryFilter.length}
                  </Badge>
                )}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-2xl">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {selectedCategoryFilter.length > 0 && (
                <>
                  <DropdownMenuItem
                    onClick={() =>
                      table.getColumn("category")?.setFilterValue(undefined)
                    }
                    className="rounded-xl text-red-600"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear filters
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  className="rounded-xl"
                  checked={selectedCategoryFilter.includes(category)}
                  onCheckedChange={(checked) => {
                    const currentFilter = selectedCategoryFilter;
                    const newFilter = checked
                      ? [...currentFilter, category]
                      : currentFilter.filter((c) => c !== category);
                    table
                      .getColumn("category")
                      ?.setFilterValue(
                        newFilter.length > 0 ? newFilter : undefined
                      );
                  }}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Group Names Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="rounded-2xl border-slate-300 bg-transparent"
              >
                Groups
                {selectedGroupFilter.length > 0 && (
                  <Badge variant="secondary" className="ml-2 rounded-xl">
                    {selectedGroupFilter.length}
                  </Badge>
                )}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-2xl">
              <DropdownMenuLabel>Filter by Group</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {selectedGroupFilter.length > 0 && (
                <>
                  <DropdownMenuItem
                    onClick={() =>
                      table.getColumn("groupNames")?.setFilterValue(undefined)
                    }
                    className="rounded-xl text-red-600"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear filters
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {groupNames.map((group) => (
                <DropdownMenuCheckboxItem
                  key={group}
                  className="rounded-xl"
                  checked={selectedGroupFilter.includes(group)}
                  onCheckedChange={(checked) => {
                    const currentFilter = selectedGroupFilter;
                    const newFilter = checked
                      ? [...currentFilter, group]
                      : currentFilter.filter((g) => g !== group);
                    table
                      .getColumn("groupNames")
                      ?.setFilterValue(
                        newFilter.length > 0 ? newFilter : undefined
                      );
                  }}
                >
                  {group}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto rounded-2xl border-slate-300 bg-transparent"
            >
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize rounded-xl"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-x-auto w-full">
        <Table className="min-w-max">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-slate-200">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="font-semibold text-slate-700"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-slate-200 hover:bg-slate-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-slate-600">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-slate-700">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded-2xl"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-2xl"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
