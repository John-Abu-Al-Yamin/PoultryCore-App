import * as SecureStore from "expo-secure-store";
import type { User } from "@/src/types";

const TOKEN_NAME = "Realestate_TOKEN";
const USER_KEY = "Realestate_USER";

// Save token
const setAuthToken = async (token: string) => {
  await SecureStore.setItemAsync(TOKEN_NAME, token);
};

// Get token
const getAuthToken = async (): Promise<string> => {
  return (await SecureStore.getItemAsync(TOKEN_NAME)) || "";
};

// Check token exists
const checkAuthToken = async (): Promise<boolean> => {
  const token = await getAuthToken();
  return !!token;
};

// Remove token
const removeAuthToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_NAME);
};
// ================= USER =================

const setUser = async (user: User) => {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
};

const getUser = async (): Promise<User | null> => {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as User;
};

const removeUser = async () => {
  await SecureStore.deleteItemAsync(USER_KEY);
};

export default getAuthToken;

export {
  setAuthToken,
  getAuthToken,
  checkAuthToken,
  removeAuthToken,

  setUser,
  getUser,
  removeUser,
};