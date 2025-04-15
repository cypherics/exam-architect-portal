import React from "react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { Label } from "@/components/ui/label";
import { Section } from "@/types/exam";

interface SectionTabsProps {
  sections: Section[];
  currentTab: number;
  setCurrentTab: (index: number) => void;
}

export const SectionTabs: React.FC<SectionTabsProps> = ({
  sections,
  currentTab,
  setCurrentTab,
}) => {
  return (
    <Tabs
        value={currentTab}
        onChange={(_, newValue) => setCurrentTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
    sx={(theme) => ({
        px: 2,
        boxShadow: `inset 0 -2px 0 0 ${theme.palette.grey[300]}`,
        overflowX: 'auto',
        minHeight: '48px', '& .MuiTabs-flexContainer': {
        flexWrap: 'nowrap',
    },
  })}
>
      {sections.map((section, index) => (
        <Tab
          key={section.id}
          value={index}
          label={
            <div className="flex items-center gap-2">
              <span>Section {index + 1}</span>
              <Label
                variant="soft"
                className="text-xs"
                color="default"
              >
                {section.questions.length} Qs
              </Label>
            </div>
          }
        />
      ))}
    </Tabs>
  );
};
