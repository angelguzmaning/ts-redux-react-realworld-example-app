import { Err, Ok, Result } from '@hqoss/monads';
import axios from 'axios';
import { array, guard, object, string } from 'decoders';
import settings from '../config/settings';
import { Article, articleDecoder, ArticleForEditor, MultipleArticles, multipleArticlesDecoder } from '../types/article';
import { GenericErrors, genericErrorsDecoder } from '../types/error';
import { User, userDecoder, UserForRegistration, UserSettings } from '../types/user';

axios.defaults.baseURL = settings.baseApiUrl;

export async function getArticles(): Promise<MultipleArticles> {
  return guard(multipleArticlesDecoder)((await axios.get('articles?limit=10')).data);
}

export async function getTags(): Promise<{ tags: string[] }> {
  return guard(object({ tags: array(string) }))((await axios.get('tags')).data);
}

export async function login(email: string, password: string): Promise<Result<User, GenericErrors>> {
  try {
    const { data } = await axios.post('users/login', { user: { email, password } });

    return Ok(guard(object({ user: userDecoder }))(data).user);
  } catch ({ data }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getUser(): Promise<User> {
  const { data } = await axios.get('user');
  return guard(object({ user: userDecoder }))(data).user;
}

export async function favoriteArticle(slug: string): Promise<Article> {
  return guard(object({ article: articleDecoder }))((await axios.post(`articles/${slug}/favorite`)).data).article;
}

export async function unfavoriteArticle(slug: string): Promise<Article> {
  return guard(object({ article: articleDecoder }))((await axios.delete(`articles/${slug}/favorite`)).data).article;
}

export async function updateSettings(user: UserSettings): Promise<Result<User, GenericErrors>> {
  try {
    const { data } = await axios.put('user', user);

    return Ok(guard(object({ user: userDecoder }))(data).user);
  } catch ({ data }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function signUp(user: UserForRegistration): Promise<Result<User, GenericErrors>> {
  try {
    const { data } = await axios.post('users', { user });

    return Ok(guard(object({ user: userDecoder }))(data).user);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function createArticle(article: ArticleForEditor): Promise<Result<Article, GenericErrors>> {
  try {
    const { data } = await axios.post('articles', { article });

    return Ok(guard(object({ article: articleDecoder }))(data).article);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}

export async function getArticle(slug: string): Promise<Article> {
  const { data } = await axios.get(`articles/${slug}`);
  return guard(object({ article: articleDecoder }))(data).article;
}

export async function updateArticle(slug: string, article: ArticleForEditor): Promise<Result<Article, GenericErrors>> {
  try {
    const { data } = await axios.put(`articles/${slug}`, { article });

    return Ok(guard(object({ article: articleDecoder }))(data).article);
  } catch ({ response: { data } }) {
    return Err(guard(object({ errors: genericErrorsDecoder }))(data).errors);
  }
}
