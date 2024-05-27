import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { getAsync, setAsync } from '../utils/cache';
import User from '../models/User';

const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

export const getDictionaryWords = async (req: Request, res: Response) => {
  const { search, limit, page } = req.query;
  const cacheKey = `words_${search}_${limit}_${page}`;
  const cachedData = await getAsync(cacheKey);

  if (cachedData) {
    res.setHeader('x-cache', 'HIT');
    res.setHeader('x-response-time', `${Date.now() - req.startTime}ms`);
    return res.json(JSON.parse(cachedData));
  }

  const response = await fetch(`${BASE_URL}${search}`);
  const data = await response.json();

  // Simulação de paginação
  const results = data.slice((page - 1) * limit, page * limit);

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
  res.setHeader('x-response-time', `${Date.now() - req.startTime}ms`);
  res.json(result);
};

export const getWordDetails = async (req: Request, res: Response) => {
  const { word } = req.params;
  const cacheKey = `word_${word}`;
  const cachedData = await getAsync(cacheKey);

  if (cachedData) {
    res.setHeader('x-cache', 'HIT');
    res.setHeader('x-response-time', `${Date.now() - req.startTime}ms`);
    return res.json(JSON.parse(cachedData));
  }

  const response = await fetch(`${BASE_URL}${word}`);
  const data = await response.json();

  const user = await User.findById(req.user._id);
  user.history.push({ word, added: new Date() });
  await user.save();

  await setAsync(cacheKey, JSON.stringify(data));

  res.setHeader('x-cache', 'MISS');
  res.setHeader('x-response-time', `${Date.now() - req.startTime}ms`);
  res.json(data);
};

export const favoriteWord = async (req: Request, res: Response) => {
  const { word } = req.params;
  const user = await User.findById(req.user._id);
  if (!user.favorites.includes(word)) {
    user.favorites.push(word);
  }
  await user.save();
  res.status(204).end();
};

export const unfavoriteWord = async (req: Request, res: Response) => {
  const { word } = req.params;
  const user = await User.findById(req.user._id);
  user.favorites = user.favorites.filter((fav) => fav !== word);
  await user.save();
  res.status(204).end();
};
