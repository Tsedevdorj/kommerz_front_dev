// api/index.js
// usage : import { functionName } from "@/api"

import axios from "axios";
import store from "@/store";
// import https from "https";
// axios new variable
export const HTTP = axios;


// default API_URL
export const API_URL =
  "https://test.kommerz.ddad.systems/api";
  // "http://127.0.0.1:5000/api"
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

// planner
export function keywordPlanner(userData) {
  return HTTP.post(`${API_URL}/planner/keywords`, userData);
}

export function brandPlanner(userData) {
  return HTTP.post(`${API_URL}/planner/planner`, userData);
}

export function corePlanner(userData) {
  return HTTP.post(`${API_URL}/planner/core_planner`, userData);
}

export function competitionPlanner(userData) {
  return HTTP.post(`${API_URL}/planner/competition_planner`, userData);
}

export function competitorCreate(userData){
  return HTTP.post(`${API_URL}/planner/competition`, userData);
}

// admin user part

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

export function keywordChurner(userData) {
  if(userData != null && userData !== undefined){
    return HTTP.get(`${API_URL}/keyword_churner/campaigns/${userData}`);
  }
  else{
    return HTTP.get(`${API_URL}/keyword_churner/campaigns`);
  }
}

export function changeKeywordBid(userData){
  return HTTP.post(`${API_URL}/keyword_churner/change_bid`, userData);
}

export function addKeyword(userData){
  return HTTP.post(`${API_URL}/keyword_churner/add_keyword`, userData);
}


export function  keywordChurnerProfile() {
  return HTTP.get(`${API_URL}/keyword_churner/profiles`);
}

export function campaignInfo(userData) {
  return HTTP.post(`${API_URL}/keyword_churner/campaign_info`, userData);
}

export function targetGet(userData) {
  return HTTP.get(`${API_URL}/keyword_churner/target_info/${userData}`);
}

export function targetCreate(userData) {
  return HTTP.post(`${API_URL}/keyword_churner/target_info`, userData);
}

export function targetDelete(userData) {
  return HTTP.delete(`${API_URL}/keyword_churner/target_info/${userData}`);
}

export function targetEdit(userData) {
  return HTTP.put(`${API_URL}/keyword_churner/target_info`, userData);
}

export function campaignTargetGetO(userData) {
  return HTTP.get(`${API_URL}/keyword_churner/campaign_target_ongoing/${userData}`);
}

export function campaignTargetCreateO(userData) {
  return HTTP.post(`${API_URL}/keyword_churner/campaign_target_ongoing`, userData);
}

export function campaignTargetDeleteO(userData) {
  return HTTP.delete(`${API_URL}/keyword_churner/campaign_target_ongoing/${userData}`);
}

export function campaignTargetEditO(userData) {
  return HTTP.put(`${API_URL}/keyword_churner/campaign_target_ongoing`, userData);
}

export function keywordReport(userData) {
  return HTTP.post(`${API_URL}/keyword_churner/keywords`, userData);
}

export function allRecommendedKeyword(userData){
  return HTTP.post(`${API_URL}/keyword_churner/recommend_keyword_all`, userData);
}

export function recommendedKeyword(userData) {
  return HTTP.post(`${API_URL}/keyword_churner/recommend_keyword`, userData);
}

export function recommendedKeywordFromSimilarCampaign(userData) {
  return HTTP.post(`${API_URL}/keyword_churner/recommend_keyword_similar_campaign`, userData);
}

export function competitorKeyword(userData) {
  return HTTP.post(`${API_URL}/keyword_churner/competitor_keyword`, userData);
}

export function recommendObjective(userData) {
  return HTTP.post(`${API_URL}/keyword_churner/recommended_objective`, userData);
}

export function requestOptimization(userData) {
  return HTTP.post(`${API_URL}/keyword_churner/optimization`, userData);
}


export function SA_profiles() {
  return HTTP.get(`${API_URL}/seasonal_analysis/profiles`);
}

export function SA_campaigns(userData) {
  return HTTP.get(`${API_URL}/seasonal_analysis/campaigns/${userData}`);
}

export function SA_get_seasonal(userData) {
  return HTTP.post(`${API_URL}/seasonal_analysis/get_seasonal`, userData );
}
// Juggler

export function Juggler_get_target(userData){
  return HTTP.get(`${API_URL}/juggler/portfolio_target/${userData}`);
}

export function Juggler_create_target(userData){
  return HTTP.post(`${API_URL}/juggler/portfolio_target`,userData);
}

export function Juggler_edit_target(userData){
  return HTTP.put(`${API_URL}/juggler/portfolio_target`,userData);
}

export function Juggler_budget_optimization(userData){
  return HTTP.post(`${API_URL}/juggler/budget_optimization`,userData);
}

export function Juggler_list_profiles(){
  return HTTP.get(`${API_URL}/juggler/profiles`);
}

export function Juggler_list_portfolios(userData){
  return HTTP.get(`${API_URL}/juggler/porfolios/${userData}`);
}

export function list_basic_profiles(){
  return HTTP.get(`${API_URL}/keyword_churner/basic_profiles`);
}

export function list_basic_portfolios(userData){
  return HTTP.get(`${API_URL}/keyword_churner/basic_portfolios`, { params: userData });
}

export function list_basic_campaigns(userData){
  return HTTP.get(`${API_URL}/keyword_churner/basic_campaigns`, { params: userData });
}

export function crawler_report_get(userData) {
  return HTTP.post(`${API_URL}/crawler/crawler_report`, userData);
}

export function review_crawler_get(userData) {
  return HTTP.post(`${API_URL}/crawler/review_crawler`, userData);
}


export function get_search_keywords(userData) {
  return HTTP.get(`${API_URL}/crawler/search_keywords`, { params: userData });
}

export function post_search_keywords(userData) {
  return HTTP.post(`${API_URL}/crawler/search_keywords`, userData);
}

export function get_product_listing(userData) {
  return HTTP.get(`${API_URL}/crawler/product_listing`, { params: userData });
}

export function get_product_listing_images(userData) {
  return HTTP.get(`${API_URL}/crawler/product_listing/${userData}`);
}


export function fetch_grouping(userData) {
  return HTTP.get(`${API_URL}/amazon_planner/grouping`, { params: userData });
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
