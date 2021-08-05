import axios from 'axios';
import { array, guard, object, string } from 'decoders';
import settings from '../config/settings';
import { multipleArticles } from '../types/article';

axios.defaults.baseURL = settings.baseApiUrl;

export async function getArticles() {
  return guard(multipleArticles)((await axios.get('articles')).data);
}

export async function getTags() {
  return guard(object({ tags: array(string) }))((await axios.get('tags')).data);
}
