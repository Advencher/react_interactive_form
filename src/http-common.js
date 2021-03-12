import axios from "axios";

export default axios.create({
  baseURL: "94.230.129.205:3000/",
  headers: {
    "Content-type": "application/json"
  }
});