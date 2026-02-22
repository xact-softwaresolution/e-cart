import api from '../lib/axios';

export const userService = {
  getMe: async () => {
    const res = await api.get('/users/me');
    return res.data;
  },

  updateMe: async (data) => {
    const res = await api.patch('/users/me', data);
    return res.data;
  },

  getAddresses: async () => {
    const res = await api.get('/users/addresses');
    return res.data;
  },

  addAddress: async (data) => {
    const res = await api.post('/users/addresses', data);
    return res.data;
  },
};
