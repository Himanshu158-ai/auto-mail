import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export const sendMail = (transcript) =>
  API.post("/mail/send", { transcript });

export const loginUser = (data) =>
  API.post("/auth/login", data);

export const registerUser = (data) =>
  API.post("/auth/register", data);

export const getAllTeachers = () =>
  API.get("/auth/teachers");