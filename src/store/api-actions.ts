import { Dispatch } from 'redux';
import { AxiosInstance } from 'axios';
import { setOffers, setCurrentOffer, setLoading, setAuthorizationStatus, setUser, setComments } from './action';
import { State } from './reducer';
import { Offer, User, Comment } from '../types';

export const fetchOffers = () => async (
  dispatch: Dispatch,
  _getState: () => State,
  api: AxiosInstance
) => {
  dispatch(setLoading(true));
  const { data } = await api.get<Offer[]>('/offers');
  dispatch(setOffers(data));
};

export const fetchOfferById = (offerId: string) => async (
  dispatch: Dispatch,
  _getState: () => State,
  api: AxiosInstance
) => {
  dispatch(setLoading(true));
  dispatch(setCurrentOffer(null));
  const { data } = await api.get<Offer>(`/offers/${offerId}`);
  dispatch(setCurrentOffer(data));
};

export const fetchCommentsByOfferId = (offerId: string) => async (
  dispatch: Dispatch,
  _getState: () => State,
  api: AxiosInstance
) => {
  dispatch(setLoading(true));
  try {
    const { data } = await api.get<Comment[]>(`/comments/${offerId}`);
    dispatch(setComments(data));
  } catch (error) {
  } finally {
    dispatch(setLoading(false));
  }
};


export const login = () => async (
  dispatch: Dispatch,
  _getState: () => State,
  api: AxiosInstance
) => {
  dispatch(setLoading(true));
  try {
    const { data } = await api.get<User>('/login');
    dispatch(setUser(data));
    dispatch(setAuthorizationStatus('AUTH'));
  } catch {
    dispatch(setAuthorizationStatus('NO_AUTH'));
    dispatch(setUser(null));
  } finally {
    dispatch(setLoading(false));
  }
};

export const authorize = (email: string, password: string) => async (
  dispatch: Dispatch,
  _getState: () => State,
  api: AxiosInstance
) => {
  dispatch(setLoading(true));
  try {
    const { data } = await api.post<User>('/login', { email, password });
    dispatch(setUser(data));
    dispatch(setAuthorizationStatus('AUTH'));
    api.defaults.headers.common['X-Token'] = data.token;
  } catch {
    dispatch(setAuthorizationStatus('NO_AUTH'));
    dispatch(setUser(null));
  } finally {
    dispatch(setLoading(false));
  }
};
