import React from 'react';

export interface Article {
  id: number;
  article_id: number;
  title: string;
  content: string;
  grade: string;
  published_at: string;
  discipline: string;
  journal: string;
  link: string | null;
  is_article_of_the_day: boolean;
}

export interface ArticleCardProps {
  article: Article;
  isSelected: boolean;
  onSelect: () => void;
}

export function ArticleCard({ article, isSelected, onSelect }: ArticleCardProps) {
  return (
    <view
      bindtap={onSelect}
      style={{
        width: "100%",
        padding: "16px",
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "#ffffff",
      }}
    >
      <text style={{ 
        fontSize: "18px", 
        fontWeight: "bold", 
        marginBottom: "8px", 
        color: "#111827" 
      }}>
        {article.title}
      </text>
      <view style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        marginBottom: "6px" 
      }}>
        <text style={{ 
          fontSize: "14px", 
          color: "#4b5563", 
          fontWeight: "500" 
        }}>
          Grade {article.grade}
        </text>
        <text style={{ 
          fontSize: "14px", 
          color: "#6b7280" 
        }}>
          {new Date(article.published_at).toLocaleDateString('fr-FR')}
        </text>
      </view>
      <view style={{ 
        display: "flex", 
        justifyContent: "space-between" 
      }}>
        <text style={{ 
          fontSize: "14px", 
          color: "#6b7280" 
        }}>
          {article.discipline}
        </text>
        <text style={{ 
          fontSize: "14px", 
          color: "#6b7280", 
          fontStyle: "italic" 
        }}>
          {article.journal}
        </text>
      </view>
    </view>
  );
} 