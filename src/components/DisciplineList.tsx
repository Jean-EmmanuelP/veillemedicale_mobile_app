import React from 'react';

interface DisciplineListProps {
  disciplines: string[];
  selectedDiscipline: string | null;
  onSelectDiscipline: (discipline: string | null) => void;
}

export const DisciplineList = ({ disciplines, selectedDiscipline, onSelectDiscipline }: DisciplineListProps) => {
  return (
    <scroll-view
      scroll-orientation="horizontal"
      enable-scroll={true}
      scroll-bar-enable={false}
      bounces={true}
      style={{ 
        width: "calc(100% - 10px)", 
        height: "60px", 
        paddingLeft: "5px",
        marginBottom: "20px"
      }}
    >
      <view style={{ 
        display: "flex", 
        flexDirection: "row", 
        paddingRight: "5px",
        height: "100%",
        alignItems: "center"
      }}>
        <view
          bindtap={() => onSelectDiscipline(null)}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            borderRadius: "20px",
            backgroundColor: selectedDiscipline === null ? "#3b82f6" : "#f3f4f6",
            cursor: "pointer",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <text style={{ 
            color: selectedDiscipline === null ? "#ffffff" : "#4b5563",
            fontSize: "14px",
            fontWeight: "600"
          }}>
            Toutes
          </text>
        </view>
        {disciplines.map((discipline: string) => (
          <view
            key={discipline}
            bindtap={() => onSelectDiscipline(discipline)}
            style={{
              padding: "10px 20px",
              marginRight: "10px",
              borderRadius: "20px",
              backgroundColor: selectedDiscipline === discipline ? "#3b82f6" : "#f3f4f6",
              cursor: "pointer",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <text style={{ 
              color: selectedDiscipline === discipline ? "#ffffff" : "#4b5563",
              fontSize: "14px",
              fontWeight: "600",
              whiteSpace: "nowrap"
            }}>
              {discipline}
            </text>
          </view>
        ))}
      </view>
    </scroll-view>
  );
}; 