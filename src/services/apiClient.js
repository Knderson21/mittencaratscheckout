import axios from "axios";

export default axios.create({
  baseURL: `https://sheets.googleapis.com/v4/spreadsheets/${process.env.SHEET_ID}/values/${process.env.SHEET_NAME}:append?valueInputOption=USER_ENTERED`,
  headers: {
    "Content-Type": "application/json",
  },
});
