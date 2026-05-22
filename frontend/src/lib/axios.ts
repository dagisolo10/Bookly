import axios from "axios";

const baseURL = process.env["NEXT_PUBLIC_API_URL"];

if (!baseURL) {
    throw new Error("NEXT_PUBLIC_API_URL environment variable is not defined");
}

const api = axios.create({
    withCredentials: true,
    baseURL,
});

export default api;
