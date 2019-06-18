// api/index.js
// usage : import { functionName } from "@/api"

import axios from "axios";
import store from "@/store";

// axios new variable
export const HTTP = axios;

// default API_URL
export const API_URL =
  window.location.href.indexOf("localhost") >= 0
    ? "http://35.200.54.33/api"
    : "http://35.200.54.33/api";
HTTP.defaults.headers.common[
  "Authorization"
] = `Bearer ${store.getters.authToken}`;

export const KEYWORD_URL =
  window.location.href.indexOf("localhost") >= 0
    ? "http://13.231.137.102:5000/api"
    : "http://13.231.137.102:5000/api";
HTTP.defaults.headers.common[
  "Authorization"
] = `Bearer ${store.getters.authToken}`;

// login
export function authenticate(userData) {
  return HTTP.post(`${API_URL}/auth/login`, userData);
}

export function keywordChurner() {
  return HTTP.get(`${KEYWORD_URL}/ping`);
}

export function keywordReport(userData) {
  return HTTP.post(`${KEYWORD_URL}/report`, userData);
}

// global interceptor for catch http status and error
export function interceptors(cb) {
  HTTP.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      cb(error);
      return Promise.reject(error);
    }
  );
}
