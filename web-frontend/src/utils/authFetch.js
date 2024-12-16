import { useUserStore } from "@/stores/user";

/********** replaces fetch and adds authorization header + token to the request **********/
export function authFetch(url, options = {}) {
  const userStore = useUserStore();
  const token = userStore.getToken || localStorage.getItem('token') || sessionStorage.getItem('token');

  if (!token) throw new Error('No token found');

  options.headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  return fetch(url, options);
}