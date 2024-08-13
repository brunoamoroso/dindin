"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const InlineTabs = TabsPrimitive.Root

const InlineTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex flex-1 text-subtle border-b border-outline",
      className
    )}
    {...props}
  />
))
InlineTabsList.displayName = TabsPrimitive.List.displayName

const InlineTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex flex-1 h-12 items-center justify-center whitespace-nowrap px-3 py-1.5 label-large font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-primary data-[state=active]:border-b-4 border-primary",
      className
    )}
    {...props}
  />
))
InlineTabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const InlineTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
InlineTabsContent.displayName = TabsPrimitive.Content.displayName

export { InlineTabs, InlineTabsList, InlineTabsTrigger, InlineTabsContent }
