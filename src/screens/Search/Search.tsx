import React, { useState } from 'react';

interface SearchItem {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
}

const mockItems: SearchItem[] = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  title: `Article de recherche ${index + 1}`,
  description: `Description de l'article de recherche ${index + 1}. Ceci est un exemple de contenu pour démontrer le scroll vertical.`,
  category: `Catégorie ${Math.floor(index / 5) + 1}`,
  date: new Date(2024, 0, index + 1).toLocaleDateString('fr-FR')
}));

const mockCategories = Array.from({ length: 10 }, (_, index) => `Catégorie ${index + 1}`);

export function Search() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<SearchItem | null>(null);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [displayedItems, setDisplayedItems] = useState<SearchItem[]>(mockItems.slice(0, 10));
  const [page, setPage] = useState(1);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    const startIndex = page * 10;
    const newItems = mockItems.slice(startIndex, startIndex + 10);
    
    if (newItems.length > 0) {
      setDisplayedItems(prev => [...prev, ...newItems]);
      setPage(nextPage);
      setHasMoreData(startIndex + 10 < mockItems.length);
    } else {
      setHasMoreData(false);
    }
  };

  return (
    <view className="AppContainer" style={{ width: "100%", height: "100%" }}>
      <view className="MainContent">
        <view className="Header" style={{ padding: "16px" }}>
          <text style={{ 
            fontSize: "24px", 
            fontWeight: "bold",
            marginBottom: "16px",
            color: "#111827"
          }}>
            Recherche ({displayedItems.length} résultats)
          </text>

          <view className="FilterSection">
            <text style={{ 
              fontSize: "16px", 
              marginBottom: "8px",
              color: "#4b5563"
            }}>
              Catégories
            </text>
            {/* <scroll-view
              scroll-orientation="horizontal"
              enable-scroll={true}
              scroll-bar-enable={false}
              bounces={true}
              style={{ 
                width: "100%", 
                height: "50px",
                marginBottom: "16px"
              }}
            >
              <view style={{ 
                display: "flex", 
                flexDirection: "row",
                height: "100%",
                alignItems: "center",
                paddingRight: "16px"
              }}>
                <view
                  bindtap={() => setSelectedCategory(null)}
                  style={{
                    padding: "8px 16px",
                    marginRight: "8px",
                    borderRadius: "16px",
                    backgroundColor: selectedCategory === null ? "#3b82f6" : "#f3f4f6",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <text style={{ 
                    color: selectedCategory === null ? "#ffffff" : "#4b5563",
                    fontSize: "14px",
                    fontWeight: "600"
                  }}>
                    Toutes
                  </text>
                </view>
                {mockCategories.map((category) => (
                  <view
                    key={category}
                    bindtap={() => setSelectedCategory(category)}
                    style={{
                      padding: "8px 16px",
                      marginRight: "8px",
                      borderRadius: "16px",
                      backgroundColor: selectedCategory === category ? "#3b82f6" : "#f3f4f6",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <text style={{ 
                      color: selectedCategory === category ? "#ffffff" : "#4b5563",
                      fontSize: "14px",
                      fontWeight: "600"
                    }}>
                      {category}
                    </text>
                  </view>
                ))}
              </view>
            </scroll-view> */}
          </view>
        </view>

        <view className="SearchList" style={{ flex: 1 }}>
          <list
            style="display:flex;flex:1;padding-bottom:52px"
            list-type="single"
            span-count={1}
            scroll-orientation="vertical"
            initial-scroll-index={1}
            scroll-event-throttle={16}
            lower-threshold-item-count={1}
            bounces={false}
            bindscrolltolower={handleLoadMore}
          >
            {displayedItems.map((item, index) => (
              <list-item
                item-key={`list-item-${index}`}
                key={`list-item-${index}`}
                full-span={true}
              >
                <view
                  bindtap={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                  style={{
                    width: "100%",
                    borderBottom: "1px solid #e5e7eb",
                    backgroundColor: index % 2 === 0 ? "#f9fafb" : "#ffffff",
                  }}
                >
                  <view style={{ padding: "16px" }}>
                    <text style={{ 
                      fontSize: "18px", 
                      fontWeight: "bold", 
                      marginBottom: "8px", 
                      color: "#111827" 
                    }}>
                      {item.title}
                    </text>
                    <view style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      marginBottom: "6px" 
                    }}>
                      <text style={{ fontSize: "14px", color: "#4b5563" }}>
                        {item.category}
                      </text>
                      <text style={{ fontSize: "14px", color: "#4b5563" }}>
                        {item.date}
                      </text>
                    </view>
                    {selectedItem?.id === item.id && (
                      <view style={{ 
                        marginTop: "12px",
                        paddingTop: "12px",
                        borderTop: "1px solid #e5e7eb"
                      }}>
                        <text style={{ 
                          fontSize: "14px",
                          lineHeight: "1.5",
                          color: "#4b5563"
                        }}>
                          {item.description}
                        </text>
                      </view>
                    )}
                  </view>
                </view>
              </list-item>
            ))}
            {hasMoreData && (
              <list-item 
                item-key="loading" 
                key="loading"
                full-span={true}
              >
                <view style={{ 
                  padding: "16px",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <text style={{ color: "#6b7280" }}>Chargement...</text>
                </view>
              </list-item>
            )}
          </list>
        </view>
      </view>
    </view>
  );
} 