import axios from "axios";
import { makeUseAxios } from "axios-hooks";

const API_URL = "http://localhost:5000/v2/admin";
export const API_UPLOAD_PATH = "http://localhost:5000";

export const useAxios = makeUseAxios({
  axios: axios.create({ baseURL: API_URL }),
});

const authString = localStorage.getItem("auth");
const auth = authString ? JSON.parse(authString) : null;

const token = auth ? auth.token : null;

export const useAuthedAxios = makeUseAxios({
  axios: axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
});
