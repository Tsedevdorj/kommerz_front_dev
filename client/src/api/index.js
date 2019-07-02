// api/index.js
// usage : import { functionName } from "@/api"

import axios from "axios";
import store from "@/store";
// import https from "https";
// axios new variable
export const HTTP = axios
// .create({
//   httpsAgent: new https.Agent({  
//     rejectUnauthorized: false
//   })
// });

// default API_URL
export const API_URL =
  window.location.href.indexOf("localhost") >= 0
    ? "https://35.200.54.33/api"
    : "https://35.200.54.33/api";
HTTP.defaults.headers.common[
  "Authorization"
] = `Bearer ${store.getters.authToken}`;

export const KEYWORD_URL =
  window.location.href.indexOf("localhost") >= 0
    ? "https://13.231.137.102:5000/api"
    : "https://13.231.137.102:5000/api";
HTTP.defaults.headers.common[
  "Authorization"
] = `Bearer ${store.getters.authToken}`;

// login
export function authenticate(userData) {
  return HTTP.post(`${API_URL}/auth/login`, userData);
}

export function userRegister(userData) {
  return HTTP.post(`${API_URL}/auth/register`, userData);
}

export function newPassword(userData) {
  return HTTP.post(`${API_URL}/auth/newpassword`, userData);
}

export function keywordPlanner(userData) {
  return HTTP.post(`${API_URL}/keywords`, userData);
}

export function brandPlanner(userData) {
  return HTTP.post(`${API_URL}/planner`, userData);
}

export function corePlanner(userData) {
  return HTTP.post(`${API_URL}/core_planner`, userData);
}

export function userList() {
  return HTTP.post(`${API_URL}/admin/user/list`);
}

export function adminUserUpdate(userData) {
  return HTTP.post(`${API_URL}/admin/user/update`, userData);
}

export function domainList() {
  return HTTP.post(`${API_URL}/superadmin/domain/list`);
}

export function domainDelete(userData) {
  return HTTP.post(`${API_URL}/superadmin/domain/delete`, userData);
}

export function domainAdd(userData) {
  return HTTP.post(`${API_URL}/superadmin/domain/add`, userData);
}

export function keywordChurner() {
  return HTTP.get(`${KEYWORD_URL}/ping`);
}

export function keywordReport(userData) {
  return HTTP.post(`${KEYWORD_URL}/report`, userData);
}

export function recommendedKeyword(userData) {
  return HTTP.post(`${KEYWORD_URL}/recommend_keyword`, userData);
}

export function recommendObjective(userData) {
  return HTTP.post(`${KEYWORD_URL}/recommend_objective`, userData);
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
