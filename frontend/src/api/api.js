import axios from "axios";

const authAPI = axios.create({ baseURL: import.meta.env.VITE_API_AUTH });
const bookAPI = axios.create({ baseURL: import.meta.env.VITE_API_BOOK });

export { authAPI, bookAPI };
