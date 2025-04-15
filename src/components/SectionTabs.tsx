import React from "react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { Label } from "@/components/ui/label";
import { useExamPageContext } from "@/context/ExamPageContext";

const tabsSx = (theme: any) => ({
  px: 2,
  boxShadow: `inset 0 -2px 0 0 ${theme.palette.grey[300]}`,
  overflowX: "auto",
  minHeight: "48px",
  "& .MuiTabs-flexContainer": {
    flexWrap: "nowrap",
  },
});

const renderTabLabel = (title: string, count: number, index: number) => (
  <div className="flex items-center gap-2">
    <span>{title || `Section ${index + 1}`}</span>
    <Label variant="soft" className="text-xs" color="default">
      {count} Qs
    </Label>
  </div>
);

export const SectionTabs: React.FC = React.memo(() => {
  const {
    state: {
      sectionStates: { currentSectionTab, sections },
    },
    actions: {
      sectionActions: { handleSetCurrentSectionTab },
    },
  } = useExamPageContext();

  return (
    <Tabs
      value={currentSectionTab}
      onChange={(_, newValue) => handleSetCurrentSectionTab(newValue)}
      variant="scrollable"
      scrollButtons="auto"
      allowScrollButtonsMobile
      sx={tabsSx}
    >
      {sections.map((section, index) => (
        <Tab
          key={section.id}
          value={index}
          label={renderTabLabel(section.title, section.questions.length, index)}
        />
      ))}
    </Tabs>
  );
});
