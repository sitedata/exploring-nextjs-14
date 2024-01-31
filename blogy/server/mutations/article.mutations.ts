'use server';

import { SafeAction } from 'next-safe-action';

import { action } from '@/config/safeAction';
import { ArticleSchema } from '@/validations/article.validations';
import { collections } from '@/utils/constants';
import { setValues } from '@/utils/parse.utils';

import { IArticle } from '@/types/article.type';

const ARTICLE_PROPERTIES = new Set<string>(['title']);

const Article = Parse.Object.extend(collections.Article);

export const createArticle = action(
  ArticleSchema,
  async (values): Promise<SafeAction<typeof ArticleSchema, IArticle>> => {
    const parsedData = ArticleSchema.parse(values);
    const article = new Article();

    setValues(article, parsedData, ARTICLE_PROPERTIES);
    const savedArticle = await article.save();
    return savedArticle.toJSON();
  },
);
