"use client";
import { cn } from "@/lib/utils";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useBroadcasts } from "@/hooks/use-broadcasts";
import { useBroadcastStore } from "@/lib/store";
import { AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

const levelConfig = {
  info: {
    icon: Info,
    className: "border-blue-200 bg-blue-50 text-blue-900",
    iconClassName: "text-blue-600",
  },
  warn: {
    icon: AlertTriangle,
    className: "border-amber-200 bg-amber-50 text-amber-900",
    iconClassName: "text-amber-600",
  },
  critical: {
    icon: AlertCircle,
    className: "border-red-200 bg-red-50 text-red-900",
    iconClassName: "text-red-600",
  },
};

export function BroadcastBanners() {
  const { state } = useSidebar();
  const { data, isError } = useBroadcasts();
  const { isDismissed, dismiss } = useBroadcastStore();
  const [dismissingIds, setDismissingIds] = useState<Set<string>>(new Set());
  const [pointerVisible, setPointerVisible] = useState(false);

  // Track pointer visibility for mobile layout
  useEffect(() => {
    const checkPointer = () => {
      const isMobile = window.innerWidth < 768;
      const dismissed =
        localStorage.getItem("sidebar_pointer_dismissed") === "true";
      setPointerVisible(isMobile && !dismissed);
    };

    checkPointer();
    window.addEventListener("resize", checkPointer);
    const sidebarOpenedHandler = () => setPointerVisible(false);
    window.addEventListener("sidebar-opened", sidebarOpenedHandler);

    return () => {
      window.removeEventListener("resize", checkPointer);
      window.removeEventListener("sidebar-opened", sidebarOpenedHandler);
    };
  }, []);

  const visibleBroadcasts = useMemo(() => {
    return (
      data?.broadcasts.filter((broadcast) => {
        const broadcastKey = `${broadcast.slug}-${broadcast.version}`;
        return (
          !isDismissed(broadcast.slug, broadcast.version) &&
          !dismissingIds.has(broadcastKey)
        );
      }) || []
    );
  }, [data?.broadcasts, isDismissed, dismissingIds]);

  // Track impressions for analytics (commented out for now)
  useEffect(() => {
    if (visibleBroadcasts.length > 0) {
      // TODO: Add PostHog tracking here
      // visibleBroadcasts.forEach((b) => {
      //   posthog.capture("broadcast_impression", {
      //     slug: b.slug,
      //     version: b.version,
      //     level: b.level,
      //   });
      // });
    }
  }, [visibleBroadcasts]);

  const handleDismiss = (slug: string, version: number) => {
    const broadcastKey = `${slug}-${version}`;

    // Immediately hide the banner
    setDismissingIds((prev) => new Set(prev).add(broadcastKey));

    // Persist the dismissal
    dismiss(slug, version);

    // TODO: Add PostHog tracking here
    // posthog.capture("broadcast_dismissed", {
    //   slug,
    //   version,
    //   level: broadcast.level,
    // });
  };

  if (isError || !data || visibleBroadcasts.length === 0) return null;

  // Sidebar width is 16rem (256px) when expanded, 0 when collapsed
  const sidebarExpanded = state === "expanded";

  // Explicit class names for Tailwind
  const leftOffsetClass = sidebarExpanded ? "md:left-64" : "md:left-0";
  const widthClass = sidebarExpanded ? "md:w-[calc(100%-16rem)]" : "md:w-full";
  const mobileLeftOffsetClass = pointerVisible ? "left-20" : "left-16";
  const mobileWidthClass = pointerVisible
    ? "w-[calc(100%-5rem)]"
    : "w-[calc(100%-4rem)]";
  const mobileTopClass = "top-2";

  return (
    <div
      className={cn(
        "fixed flex justify-center pointer-events-none z-50 transition-all duration-300",
        mobileTopClass,
        leftOffsetClass,
        "right-0",
        mobileLeftOffsetClass,
        widthClass,
        mobileWidthClass
      )}
    >
      <div className="w-full max-w-4xl px-2 md:px-4 flex flex-col gap-2 pointer-events-auto mt-0 md:mt-2">
        {visibleBroadcasts.map((broadcast) => {
          const config =
            levelConfig[broadcast.level as keyof typeof levelConfig];
          const Icon = config.icon;
          const broadcastKey = `${broadcast.slug}-${broadcast.version}`;

          return (
            <div
              key={broadcastKey}
              className="animate-in slide-in-from-top-2 duration-300"
            >
              <Alert
                className={`${
                  config.className
                } shadow-lg border-l-4 pr-12 relative ${
                  pointerVisible ? "py-2 px-3" : "py-3 px-4"
                } md:py-3 md:px-4`}
              >
                <Icon className={`h-4 w-4 ${config.iconClassName}`} />
                <AlertTitle
                  className={`font-semibold mb-1 ${
                    pointerVisible ? "text-xs" : "text-sm"
                  } md:text-sm`}
                >
                  {broadcast.title}
                </AlertTitle>
                <AlertDescription
                  className={`${
                    pointerVisible ? "text-xs" : "text-sm"
                  } md:text-sm`}
                >
                  <div className="prose prose-sm max-w-none [&>*]:mb-0">
                    <ReactMarkdown
                      components={{
                        // Restrict to safe inline elements
                        p: ({ children }) => <span>{children}</span>,
                        strong: ({ children }) => <strong>{children}</strong>,
                        em: ({ children }) => <em>{children}</em>,
                        code: ({ children }) => (
                          <code className="bg-black/10 px-1 py-0.5 rounded text-xs font-mono">
                            {children}
                          </code>
                        ),
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            className="underline hover:no-underline transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {broadcast.bodyMarkdown}
                    </ReactMarkdown>
                  </div>
                </AlertDescription>

                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute top-1 right-1 rounded-full hover:bg-black/10 transition-colors ${
                    pointerVisible ? "h-5 w-5" : "h-6 w-6"
                  } md:h-6 md:w-6 md:top-2 md:right-2`}
                  onClick={() =>
                    handleDismiss(broadcast.slug, broadcast.version)
                  }
                  aria-label="Dismiss banner"
                >
                  <X
                    className={`${
                      pointerVisible ? "h-2.5 w-2.5" : "h-3 w-3"
                    } md:h-3 md:w-3`}
                  />
                </Button>
              </Alert>
            </div>
          );
        })}
      </div>
    </div>
  );
}
