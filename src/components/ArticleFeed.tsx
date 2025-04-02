import React, { useEffect } from 'react';
import { useArticleStore } from '../store/articleStore.ts';
import { ArticleCard } from './ArticleCard.tsx';
import type { Article } from './ArticleCard.tsx';
import { DisciplineList } from './DisciplineList.tsx';
import { Modal } from './Modal.tsx';

export const ArticleFeed = () => {
  const { 
    articles, 
    disciplines,
    loading, 
    error, 
    selectedArticle, 
    selectedDiscipline,
    selectArticle,
    selectDiscipline,
    initializeStore,
    loadMoreArticles
  } = useArticleStore();

  useEffect(() => {
    initializeStore();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Date non disponible";
      }
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "Date non disponible";
    }
  };

  const handleOpenLink = (url: string | null) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (loading && articles.length === 0) return <text style={{ padding: "16px" }}>Loading articles...</text>;
  if (error) return <text style={{ padding: "16px", color: "#ef4444" }}>Error: {error}</text>;

  return (
    <view style={{ marginTop: "4vh", marginBottom: "10vh", width: "100%", height: "100%", padding: "10px", display: "linear", backgroundColor: "#ffffff" }}>
      {/* Disciplines Header */}
      <text style={{ 
        fontSize: "20px", 
        fontWeight: "bold", 
        height: "40px", 
        paddingLeft: "10px", 
        marginTop: "10px",
        color: "#111827"
      }}>
        Disciplines médicales
      </text>

      {/* Disciplines List */}
      <DisciplineList
        disciplines={disciplines}
        selectedDiscipline={selectedDiscipline}
        onSelectDiscipline={selectDiscipline}
      />

      {/* Articles Header */}
      <text style={{ 
        fontSize: "20px", 
        fontWeight: "bold", 
        height: "40px",
        paddingLeft: "10px",
        color: "#111827"
      }}>
        Articles {selectedDiscipline ? `en ${selectedDiscipline}` : ''}
      </text>

      {/* Articles List */}
      <scroll-view
        scroll-orientation="vertical"
        enable-scroll={true}
        scroll-bar-enable={true}
        bounces={true}
        lower-threshold={100}
        bindscroll={(e: any) => console.log('Articles scroll:', e.detail)}
        bindscrolltolower={() => {
          console.log('Reached bottom, loading more articles...');
          loadMoreArticles();
        }}
        style={{ 
          width: "100%",
          height: "calc(100% - 180px)", 
          display: "linear",
          flexDirection: "column"
        }}
      >
        {articles.map((article: Article) => (
          <ArticleCard
            key={article.id}
            article={article}
            isSelected={selectedArticle?.id === article.id}
            onSelect={() => selectArticle(article)}
          />
        ))}
        {loading && articles.length > 0 && (
          <view style={{ 
            padding: "16px", 
            display: "flex", 
            justifyContent: "center",
            alignItems: "center"
          }}>
            <text style={{ color: "#6b7280" }}>Chargement des articles...</text>
          </view>
        )}
      </scroll-view>

      {/* Article Detail Modal */}
      <Modal
        isOpen={!!selectedArticle}
        onClose={() => selectArticle(null)}
      >
        {selectedArticle && (
          <view style={{ color: "#ffffff" }}>
            <text style={{ 
              fontSize: "24px", 
              fontWeight: "bold",
              marginBottom: "16px",
              lineHeight: "1.2",
              color: '#fff'
            }}>
              {selectedArticle.title}
            </text>

            <view style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "24px",
              gap: "16px"
            }}>
              <text style={{ 
                fontSize: "14px",
                color: "#9ca3af",
                backgroundColor: "#1f2937",
                padding: "4px 12px",
                borderRadius: "12px"
              }}>
                Grade {selectedArticle.grade}
              </text>
              <text style={{ 
                fontSize: "14px",
                color: "#9ca3af",
                backgroundColor: "#1f2937",
                padding: "4px 12px",
                borderRadius: "12px"
              }}>
                {selectedArticle.discipline}
              </text>
              <text style={{ 
                fontSize: "14px",
                color: "#9ca3af"
              }}>
                {formatDate(selectedArticle.published_at)}
              </text>
            </view>

            <text style={{ 
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#d1d5db",
              marginBottom: "24px"
            }}>
              {selectedArticle.content}
            </text>

            <view style={{
              marginTop: "32px",
              borderTop: "1px solid #374151",
              paddingTop: "24px"
            }}>
              <text style={{ 
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "16px",
                color: "#e5e7eb"
              }}>
                Source
              </text>
              <view style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}>
                <text style={{ 
                  fontSize: "14px",
                  color: "#9ca3af",
                  fontStyle: "italic"
                }}>
                  {selectedArticle.journal}
                </text>
                {selectedArticle.link && (
                  <text 
                    style={{ 
                      fontSize: "14px",
                      color: "#3b82f6",
                      textDecoration: "underline"
                    }}
                    bindtap={() => handleOpenLink(selectedArticle.link)}
                  >
                    Voir l'article original →
                  </text>
                )}
              </view>
            </view>
          </view>
        )}
      </Modal>
    </view>
  );
}; 