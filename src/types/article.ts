import { Article } from '../services/useFetchArticles';

export interface Multimedia {
  url: string;
  format: string;
  height: number;
  width: number;
  type: string;
  subtype: string;
  caption: string;
  copyright: string;
}

export interface ArticleWithMultimedia extends Article {
  multimedia?: Multimedia[];
}

