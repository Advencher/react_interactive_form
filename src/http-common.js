import axios from "axios";

export default axios.create({
  baseURL: "seeecret",
  headers: {
    "Content-type": "application/json"
  }
});