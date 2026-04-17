import axiosInstance from './axiosInstance';

export const getBoards     = ()           => axiosInstance.get('/boards');
export const createBoard   = (data)       => axiosInstance.post('/boards', data);
export const deleteBoard   = (id)         => axiosInstance.delete(`/boards/${id}`);
export const getBoardById  = (id)         => axiosInstance.get(`/boards/${id}`);