import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});
/**
 * console.log all requests and responses
 */
api.interceptors.request.use(
  (request) => {
    console.log("Starting Request", request);
    return request;
  },
  function (error) {
    console.log("REQUEST ERROR", error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  function (error) {
    error = error.response.data;
    console.log("RESPONSE ERROR", error);
    return Promise.reject(error);
  }
);

export async function login({ email, password }) {
  const response = await api.post("/user/login", { email, password });
  return response;
}

export async function register({ email, name, password }) {
  const response = await api.post("/user/join", { email, name, password });
  return response;
}

export async function checkEmail({ email }) {
  const response = await api.post("/user/check-email", { email });
  return response;
}

export default api;
