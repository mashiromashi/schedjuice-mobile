import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

interface Tab {
  title: string;
  content: React.ReactNode;
}
interface TabListProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  tabs: Tab[];
  className?: string;
  contentClassName?: string;
  listClassName?: string;
}

export default function TabList({
  tabs,
  value,
  setValue,
  className,
  contentClassName,
  listClassName,
}: TabListProps) {
  return (
    <>
      <Tabs value={value} onValueChange={setValue} className={cn(className)}>
        <TabsList className={cn(listClassName)}>
          {tabs.map((tab, index) => (
            <TabsTrigger
              key={index}
              value={tab.title}
              className={cn('', value === tab.title ? 'bg-white shadow-sm' : 'bg-transparent')}>
              <Text className={`${value === tab.title ? 'text-primary' : 'text-secondary'}`}>
                {tab.title}
              </Text>
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab, index) => (
          <TabsContent key={index} value={tab.title} className={cn('w-full', contentClassName)}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
