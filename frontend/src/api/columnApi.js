import axiosInstance from './axiosInstance';

export const createColumn = (data) => axiosInstance.post('/columns', data);
export const updateColumn = (id, data) => axiosInstance.put(`/columns/${id}`, data);
export const deleteColumn = (id) => axiosInstance.delete(`/columns/${id}`);
