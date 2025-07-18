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
import { useCategoryMappings } from "@/hooks/use-category-mappings";
import type { ActivityData } from "@/lib/db/schema";

// Category color mapping for badges and icons
const categoryColors: Record<string, string> = {
  Food: "bg-orange-100 text-orange-800 border-orange-200",
  Entertainment: "bg-purple-100 text-purple-800 border-purple-200",
  Recreation: "bg-blue-100 text-blue-800 border-blue-200",
  Outdoors: "bg-green-100 text-green-800 border-green-200",
  Wellness: "bg-pink-100 text-pink-800 border-pink-200",
};

import { useActivityStore } from "@/lib/store";

// Dynamic icon mapping for categories
const iconMap: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<{ className?: string }>>
> = {
  UtensilsCrossed: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.UtensilsCrossed }))
  ),
  Music: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Music }))
  ),
  Zap: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Zap }))
  ),
  Trees: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Trees }))
  ),
  Heart: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Heart }))
  ),
  Tag: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Tag }))
  ),
  Coffee: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Coffee }))
  ),
  Pizza: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Pizza }))
  ),
  ChefHat: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.ChefHat }))
  ),
  IceCream: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.IceCream }))
  ),
  Gamepad2: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Gamepad2 }))
  ),
  Film: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Film }))
  ),
  Ticket: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Ticket }))
  ),
  Palette: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Palette }))
  ),
  Dumbbell: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Dumbbell }))
  ),
  Bike: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Bike }))
  ),
  Book: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Book }))
  ),
  Mountain: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Mountain }))
  ),
  Waves: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Waves }))
  ),
  Sun: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Sun }))
  ),
  Tent: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Tent }))
  ),
  Car: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Car }))
  ),
  Plane: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Plane }))
  ),
  Camera: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Camera }))
  ),
  ShoppingBag: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.ShoppingBag }))
  ),
  Sparkles: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Sparkles }))
  ),
  Crown: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Crown }))
  ),
  Gift: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Gift }))
  ),
  Trophy: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Trophy }))
  ),
  Star: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Star }))
  ),
  Flame: React.lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Flame }))
  ),
};

// Category icon cell component
function CategoryIconCell({
  activity,
  colorClass,
}: {
  activity: ActivityData;
  colorClass?: string;
}) {
  const { data: mappings } = useCategoryMappings();

  // Memoize mapping lookup for iconName
  const iconName = React.useMemo(() => {
    if (!mappings) return "Tag";
    const mapping = mappings.find((m) => m.category === activity.category);
    return mapping?.iconName || "Tag";
  }, [mappings, activity.category]);

  const IconComponent = iconMap[iconName] || iconMap["Tag"];

  // Extract text color from colorClass (e.g., 'text-orange-800')
  const textColorClass = React.useMemo(() => {
    if (!colorClass) return "text-slate-600";
    const match = colorClass.match(/text-\w+-\d+/);
    return match ? match[0] : "text-slate-600";
  }, [colorClass]);

  return (
    <div className="flex justify-center" title={activity.category}>
      <React.Suspense
        fallback={<span className={`h-5 w-5 ${textColorClass}`} />}
      >
        <IconComponent className={`h-5 w-5 ${textColorClass}`} />
      </React.Suspense>
    </div>
  );
}
const columns: ColumnDef<ActivityData>[] = [
  {
    id: "categoryIcon",
    header: () => (
      <div className="flex justify-center">
        <span className="font-semibold">Category</span>
      </div>
    ),
    cell: ({ row }) => {
      const activity = row.original;
      const colorClass =
        categoryColors[activity.category] ||
        "bg-slate-100 text-slate-800 border-slate-200";
      return <CategoryIconCell activity={activity} colorClass={colorClass} />;
    },
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
      const colorClass =
        categoryColors[category] ||
        "bg-slate-100 text-slate-800 border-slate-200";
      return (
        <Badge
          variant="outline"
          className={`rounded-xl font-medium ${colorClass}`}
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
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
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-2">
          <Input
            placeholder="Filter activities..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="w-full md:max-w-sm rounded-2xl border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
          />

          <div className="flex items-center space-x-2 w-full">
            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 rounded-2xl border-slate-300 bg-transparent"
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
                  className="flex-1 rounded-2xl border-slate-300 bg-transparent"
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
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-auto rounded-2xl border-slate-300 bg-transparent"
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

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          <Table className="w-full min-w-[600px]">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-slate-200">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="font-semibold text-slate-700 whitespace-nowrap px-2 md:px-4"
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
                      <TableCell key={cell.id} className="px-2 md:px-4 py-2">
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
      </div>

      <div className="py-4">
        {/* Pagination buttons row (now above info row) */}
        <div className="grid grid-cols-2 gap-2 md:flex md:items-center md:justify-end md:space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-2xl h-12 text-base px-6 md:h-8 md:text-sm md:px-4"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-2xl h-12 text-base px-6 md:h-8 md:text-sm md:px-4"
          >
            Next
          </Button>
        </div>
        {/* Info row: selected rows and page info (now below buttons) */}
        <div className="mt-2 flex flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0 md:items-center md:justify-between">
          <div className="text-sm text-slate-600">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <p className="text-sm font-medium text-slate-700">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </p>
        </div>
      </div>
    </div>
  );
}
