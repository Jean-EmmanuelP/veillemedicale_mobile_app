export interface Article {
  id: string;
  title: string;
  content: string;
  recommendationGrade: 'A' | 'B' | 'C' | 'D';
  date: string;
  discipline: string;
  author: string;
  abstract: string;
  readTime: number;
  likes: number;
  views: number;
}

export type Discipline = 
  | 'Cardiologie'
  | 'Neurologie'
  | 'Pédiatrie'
  | 'Oncologie'
  | 'Psychiatrie'
  | 'Dermatologie'
  | 'Rhumatologie'
  | 'Endocrinologie'; 