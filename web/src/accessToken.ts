export const setAccessToken = (s: string) => {
  localStorage.setItem('accessToken', s);
};

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const clearAccessToken = () => {
  return localStorage.removeItem('accessToken');
};
