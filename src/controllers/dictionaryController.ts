import { Request, Response } from 'express';
import { RequestInfo, RequestInit } from "node-fetch";
import { getAsync, setAsync } from '../utils/cache';
import User from '../models/User';

const fetch = (url: RequestInfo, init?: RequestInit) =>  import("node-fetch").then(({ default: fetch }) => fetch(url, init));

export const getDictionaryWords = async (req: Request, res: Response) => {
  const search = req.query.search
  const page: any = req.query.page
  const limit: any = req.query.limit
  const startTime: any = req.startTime

  const cacheKey = `words_${search}_${limit}_${page}`;
  const cachedData = await getAsync(cacheKey);

  if (cachedData) {
    res.setHeader('x-cache', 'HIT');
    res.setHeader('x-response-time', `${Date.now() - startTime}ms`);
    return res.json(JSON.parse(cachedData));
  }

  const response = await fetch(`${process.env.BASE_URL}${search}`);
  const data: any = await response.json();

  const results = (data).slice(((page || 0) - 1) * limit, page * limit);

  const result = {
    results,
    totalDocs: data.length,
    page,
    totalPages: Math.ceil(data.length / limit),
    hasNext: page * limit < data.length,
    hasPrev: page > 1,
  };

  await setAsync(cacheKey, JSON.stringify(result));

  res.setHeader('x-cache', 'MISS');
  res.setHeader('x-response-time', `${Date.now() - startTime}ms`);
  res.json(result);

  return result
};

export const getWordDetails = async (req: Request, res: Response) => {
  const { word } = req.params;
  const cacheKey = `word_${word}`;
  const startTime: any = req.startTime
  const cachedData = await getAsync(cacheKey);

  if (cachedData) {
    res.setHeader('x-cache', 'HIT');
    res.setHeader('x-response-time', `${Date.now() - startTime}ms`);
    return res.json(JSON.parse(cachedData));
  }

  const response = await fetch(`${process.env.BASE_URL}${word}`);
  const data = await response.json();

  const user: any = await User.findById(req.params._id);
  user.history.push({ word, added: new Date() });
  await user.save();

  await setAsync(cacheKey, JSON.stringify(data));

  res.setHeader('x-cache', 'MISS');
  res.setHeader('x-response-time', `${Date.now() - startTime}ms`);
  res.json(data);

  return data
};

export const favoriteWord = async (req: Request, res: Response) => {
  const { word } = req.params;
  const user: any = await User.findById(req.params._id);
  if (!user.favorites.includes(word)) {
    user.favorites.push(word);
  }
  await user.save();
  res.status(204).end();
};

export const unfavoriteWord = async (req: Request, res: Response) => {
  const { word } = req.params;
  const user: any = await User.findById(req.params._id);
  user.favorites = user.favorites.filter((fav: any) => fav !== word);
  await user.save();
  res.status(204).end();
};
