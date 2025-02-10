import axios from "axios";

console.log(process.env.REACT_APP_API_URL);


const http = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'x-rapidapi-key': process.env.REACT_APP_API_KEY,
    'x-rapidapi-host': process.env.REACT_APP_API_HOST
  }
});

export default http