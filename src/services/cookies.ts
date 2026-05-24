import * as SecureStore from "expo-secure-store";

const TOKEN_NAME = "Realestate_TOKEN";

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

export default getAuthToken;
export { checkAuthToken, removeAuthToken, setAuthToken };