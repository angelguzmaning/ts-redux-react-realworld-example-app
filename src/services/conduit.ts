import { Err, Ok, Result } from '@hqoss/monads';
import axios from 'axios';
import { array, guard, object, string } from 'decoders';
import settings from '../config/settings';
import { Article, articleDecoder, MultipleArticles, multipleArticlesDecoder } from '../types/article';
import { LoginError, loginErrorDecoder } from '../types/login';
import { User, userDecoder } from '../types/user';

axios.defaults.baseURL = settings.baseApiUrl;

export async function getArticles(): Promise<MultipleArticles> {
  return guard(multipleArticlesDecoder)((await axios.get('articles?limit=10')).data);
}

export async function getTags(): Promise<{ tags: string[] }> {
  return guard(object({ tags: array(string) }))((await axios.get('tags')).data);
}

export async function login(email: string, password: string): Promise<Result<User, LoginError>> {
  try {
    const { data } = await axios.post('login', { user: { email, password } });

    return Ok(guard(object({ user: userDecoder }))(data).user);
  } catch ({ data }) {
    return Err(guard(object({ errors: loginErrorDecoder }))(data).errors);
  }
}

export async function favoriteArticle(slug: string): Promise<{ article: Article }> {
  return guard(object({ article: articleDecoder }))((await axios.post(`articles/${slug}/favorite`)).data);
}
