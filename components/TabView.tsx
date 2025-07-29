"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type TabItem = {
  key: string;
  title: string;
  content: React.ReactNode;
};

interface TabViewProps {
  defaultTab?: string;
  tabs: TabItem[];
  tabListClassName?: string;
  tabTriggerClassName?: string;
  tabContentClassName?: string;
}

export const TabView: React.FC<TabViewProps> = ({
  defaultTab,
  tabs,
  tabListClassName = "",
  tabTriggerClassName = "",
  tabContentClassName = "",
}) => {
  const initialTab = defaultTab || tabs?.[0]?.key;

  return (
    <Tabs defaultValue={initialTab} className="w-full">
      <TabsList className={tabListClassName}>
        {tabs.map(tab => (
          <TabsTrigger key={tab.key} value={tab.key} className={tabTriggerClassName}>
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(tab => (
        <TabsContent
          key={tab.key}
          value={tab.key}
          className={tabContentClassName}
          // No forceMount - this is the key fix
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
