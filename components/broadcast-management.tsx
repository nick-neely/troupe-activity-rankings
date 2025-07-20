"use client";

import { BroadcastForm } from "@/components/broadcast-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAdminBroadcasts,
  useDeleteBroadcast,
  useUpdateBroadcast,
} from "@/hooks/use-admin-broadcasts";
import type { Broadcast } from "@/lib/db/schema";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  Edit2,
  Eye,
  EyeOff,
  Info,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export function BroadcastManagement() {
  const { data, isLoading } = useAdminBroadcasts();
  const deleteMutation = useDeleteBroadcast();
  const updateMutation = useUpdateBroadcast();

  const [showDialog, setShowDialog] = useState(false);
  const [editingBroadcast, setEditingBroadcast] = useState<Broadcast | null>(
    null
  );
  const [expandedBroadcast, setExpandedBroadcast] = useState<number | null>(
    null
  );
  const [pendingDelete, setPendingDelete] = useState<Broadcast | null>(null);

  const handleEdit = (broadcast: Broadcast) => {
    setEditingBroadcast(broadcast);
    setShowDialog(true);
  };

  const handleCreateNew = () => {
    setEditingBroadcast(null);
    setShowDialog(true);
  };

  const handleDelete = async () => {
    if (pendingDelete) {
      await deleteMutation.mutateAsync(pendingDelete.id);
      setPendingDelete(null);
    }
  };

  const toggleActive = async (broadcast: Broadcast) => {
    const validLevels = ["info", "warn", "critical"] as const;
    const level = validLevels.includes(
      broadcast.level as (typeof validLevels)[number]
    )
      ? (broadcast.level as (typeof validLevels)[number])
      : "info";

    await updateMutation.mutateAsync({
      ...broadcast,
      level,
      active: !broadcast.active,
    });
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingBroadcast(null);
  };

  const levelConfig = {
    info: {
      icon: Info,
      label: "Info",
      className: "bg-blue-100 text-blue-800",
      borderColor: "border-blue-200",
    },
    warn: {
      icon: AlertTriangle,
      label: "Warning",
      className: "bg-amber-100 text-amber-800",
      borderColor: "border-amber-200",
    },
    critical: {
      icon: AlertCircle,
      label: "Critical",
      className: "bg-red-100 text-red-800",
      borderColor: "border-red-200",
    },
  };

  return (
    <>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-5xl sm:min-w-5xl w-[95vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingBroadcast ? "Edit Broadcast" : "Create New Broadcast"}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <BroadcastForm
              broadcast={editingBroadcast || undefined}
              onCancel={handleCloseDialog}
              onSuccess={handleCloseDialog}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              Broadcast Management
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Create and manage site-wide broadcast messages
            </p>
          </div>
          <Button
            size="sm"
            className="w-full sm:w-auto"
            onClick={handleCreateNew}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Broadcast
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-slate-100 h-24 rounded-lg"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {data?.broadcasts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500 col-span-full gap-4">
                <AlertCircle className="w-12 h-12 mb-2 text-slate-300" />
                <h3 className="text-lg font-medium">No broadcasts yet</h3>
                <p className="text-sm text-center max-w-xs">
                  Create your first broadcast to communicate with your users.
                </p>
                <Button
                  size="sm"
                  className="w-full max-w-xs sm:w-auto"
                  onClick={handleCreateNew}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Broadcast
                </Button>
              </div>
            ) : (
              data?.broadcasts.map((broadcast) => {
                const config =
                  levelConfig[broadcast.level as keyof typeof levelConfig] ||
                  levelConfig.info;
                const Icon = config.icon;
                const isExpanded = expandedBroadcast === broadcast.id;

                return (
                  <Card
                    key={broadcast.id}
                    className={`p-3 sm:p-4 border-l-4 ${config.borderColor} flex flex-col justify-between h-full`}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className="w-5 h-5 text-slate-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg text-slate-900 mb-1 truncate">
                          {broadcast.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge
                            variant="outline"
                            className={`border ${config.borderColor} ${config.className} px-2 py-0.5 text-xs font-medium`}
                          >
                            {config.label}
                          </Badge>
                          <Badge
                            variant={broadcast.active ? "default" : "secondary"}
                            className="px-2 py-0.5 text-xs font-medium"
                          >
                            {broadcast.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-600 mb-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span>
                            <span className="font-semibold">Slug:</span>{" "}
                            {broadcast.slug}
                          </span>
                          <span className="hidden sm:inline">|</span>
                          <span>
                            <span className="font-semibold">Version:</span>{" "}
                            {broadcast.version}
                          </span>
                          <span className="hidden sm:inline">|</span>
                          <span>
                            <span className="font-semibold">Updated:</span>{" "}
                            {new Date(broadcast.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {(broadcast.startsAt || broadcast.endsAt) && (
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mb-1">
                            <Calendar className="w-4 h-4" />
                            {broadcast.startsAt && (
                              <span>
                                From:{" "}
                                {new Date(broadcast.startsAt).toLocaleString()}
                              </span>
                            )}
                            {broadcast.endsAt && (
                              <span>
                                Until:{" "}
                                {new Date(broadcast.endsAt).toLocaleString()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-row sm:flex-col gap-1 ml-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full focus:ring-2 focus:ring-primary/50"
                          onClick={() =>
                            setExpandedBroadcast(
                              isExpanded ? null : broadcast.id
                            )
                          }
                          aria-label={
                            isExpanded ? "Hide details" : "Show details"
                          }
                        >
                          {isExpanded ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full focus:ring-2 focus:ring-primary/50"
                          onClick={() => toggleActive(broadcast)}
                          disabled={updateMutation.isPending}
                          aria-label={
                            broadcast.active ? "Deactivate" : "Activate"
                          }
                        >
                          {broadcast.active ? (
                            <ToggleRight className="w-5 h-5 text-green-600" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-slate-400" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full focus:ring-2 focus:ring-primary/50"
                          onClick={() => handleEdit(broadcast)}
                          aria-label="Edit broadcast"
                        >
                          <Edit2 className="w-5 h-5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="rounded-full text-red-600 hover:text-red-800 focus:ring-2 focus:ring-red-400"
                              onClick={() => setPendingDelete(broadcast)}
                              disabled={
                                deleteMutation.isPending ||
                                updateMutation.isPending
                              }
                              aria-label="Delete broadcast"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Broadcast
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete{" "}
                                <span className="font-semibold">
                                  {broadcast.title}
                                </span>
                                ? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => setPendingDelete(null)}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                                className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-400"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="mt-2 sm:-mx-4 px-3 sm:px-4 py-2 bg-slate-50 rounded-md">
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown>
                            {broadcast.bodyMarkdown}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        )}
      </Card>
    </>
  );
}
