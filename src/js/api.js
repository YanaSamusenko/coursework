export const API_URL =
  "https://66da17524ad2f6b8ed56f3b4.mockapi.io/api/product";

// Запрос к API
export async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}
