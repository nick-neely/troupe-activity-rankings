"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  useCreateBroadcast,
  useUpdateBroadcast,
} from "@/hooks/use-admin-broadcasts";
import type { Broadcast } from "@/lib/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  Eye,
  EyeOff,
  Info,
  Save,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { z } from "zod";

// Dynamic import to avoid SSR issues with the markdown editor
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

// Form schema - simplified to match react-hook-form patterns
const formSchema = z
  .object({
    slug: z.string().min(1, "Slug is required"),
    title: z.string().min(1, "Title is required"),
    bodyMarkdown: z.string().min(1, "Content is required"),
    level: z.enum(["info", "warn", "critical"]),
    active: z.boolean(),
    startsAt: z.string().optional(),
    endsAt: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startsAt && data.endsAt) {
        return new Date(data.startsAt) < new Date(data.endsAt);
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endsAt"],
    }
  );

type FormData = z.infer<typeof formSchema>;

interface BroadcastFormProps {
  broadcast?: Broadcast;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function BroadcastForm({
  broadcast,
  onCancel,
  onSuccess,
}: BroadcastFormProps) {
  const createMutation = useCreateBroadcast();
  const updateMutation = useUpdateBroadcast();
  const [showPreview, setShowPreview] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: "",
      title: "",
      bodyMarkdown: "",
      level: "info" as const,
      active: false,
      startsAt: "",
      endsAt: "",
    },
  });

  // Populate form data when editing
  useEffect(() => {
    if (broadcast) {
      form.reset({
        slug: broadcast.slug,
        title: broadcast.title,
        bodyMarkdown: broadcast.bodyMarkdown,
        level: broadcast.level as "info" | "warn" | "critical",
        active: broadcast.active,
        startsAt: broadcast.startsAt
          ? new Date(broadcast.startsAt).toISOString().slice(0, 16)
          : "",
        endsAt: broadcast.endsAt
          ? new Date(broadcast.endsAt).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [broadcast, form]);

  const onSubmit = async (data: FormData) => {
    try {
      const submitData = {
        ...data,
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        endsAt: data.endsAt ? new Date(data.endsAt) : null,
      };

      if (broadcast) {
        await updateMutation.mutateAsync({ id: broadcast.id, ...submitData });
      } else {
        await createMutation.mutateAsync(submitData);
      }
      onSuccess?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Form submission error";
      toast.error(message);
      console.error("Form submission error:", error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const watchedValues = form.watch();

  const levelConfig = {
    info: {
      icon: Info,
      label: "Info",
      className:
        "bg-blue-50 border-blue-200 text-blue-900 border-l-4 border-l-blue-500",
      description: "General information or announcements",
    },
    warn: {
      icon: AlertTriangle,
      label: "Warning",
      className:
        "bg-amber-50 border-amber-200 text-amber-900 border-l-4 border-l-amber-500",
      description: "Important notices that require attention",
    },
    critical: {
      icon: AlertCircle,
      label: "Critical",
      className:
        "bg-red-50 border-red-200 text-red-900 border-l-4 border-l-red-500",
      description: "Urgent alerts for critical issues",
    },
  };

  return (
    <div className="space-y-4">
      {/* Header with preview toggle */}
      <div className="flex items-center justify-between pb-2 border-b">
        <div className="text-muted-foreground text-sm">
          {broadcast
            ? "Update your broadcast message and settings"
            : "Create a new site-wide broadcast message"}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? (
            <EyeOff className="w-4 h-4 mr-2" />
          ) : (
            <Eye className="w-4 h-4 mr-2" />
          )}
          {showPreview ? "Hide Preview" : "Show Preview"}
        </Button>
      </div>

      {/* Preview Section */}
      {showPreview && (
        <div className="border rounded-lg p-4 bg-muted/20">
          <div className="text-sm font-medium text-slate-700 mb-3">
            Live Preview
          </div>
          <div
            className={`rounded-lg p-4 ${
              levelConfig[watchedValues.level].className
            }`}
          >
            <div className="flex items-start gap-3">
              {React.createElement(levelConfig[watchedValues.level].icon, {
                className: "w-5 h-5 mt-0.5 flex-shrink-0",
              })}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1">
                  {watchedValues.title || "Untitled Broadcast"}
                </h3>
                <div className="text-sm prose prose-sm max-w-none">
                  <ReactMarkdown>
                    {watchedValues.bodyMarkdown || "No content yet..."}
                  </ReactMarkdown>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="p-1 pointer-events-none opacity-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Broadcast ID *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="unique-identifier"
                      disabled={!!broadcast} // Don't allow changing slug for existing broadcasts
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    {broadcast
                      ? "The unique identifier cannot be changed after creation"
                      : "A unique identifier for this broadcast (lowercase, hyphens only)"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Severity Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(levelConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            {React.createElement(config.icon, {
                              className: "w-4 h-4",
                            })}
                            <span>{config.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    {levelConfig[watchedValues.level]?.description}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter broadcast title..." {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  A clear, concise title for your broadcast message
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bodyMarkdown"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content *</FormLabel>
                <FormControl>
                  <div data-color-mode="light">
                    <MDEditor
                      value={field.value}
                      onChange={(val) => field.onChange(val || "")}
                      preview="edit"
                      hideToolbar={false}
                      height={200}
                      data-testid="md-editor"
                    />
                  </div>
                </FormControl>
                <FormDescription className="text-xs">
                  Use Markdown for formatting. Keep it concise for better
                  readability on mobile devices.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Scheduling */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Scheduling (Optional)
            </h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startsAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Start Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      When this broadcast should start appearing (leave empty
                      for immediate)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endsAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">End Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      When this broadcast should stop appearing (leave empty for
                      manual control)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Activation */}
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm">Activate Broadcast</FormLabel>
                  <FormDescription className="text-xs">
                    When checked, this broadcast will be visible to users
                    according to the schedule above.
                    {!field.value && (
                      <span className="block mt-1 text-amber-600">
                        ⚠️ This broadcast is currently inactive and won&apos;t
                        be shown to users.
                      </span>
                    )}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <Separator />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="sm:order-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="sm:order-2">
              <Save className="w-4 h-4 mr-2" />
              {isLoading
                ? "Saving..."
                : broadcast
                ? "Update Broadcast"
                : "Create Broadcast"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
