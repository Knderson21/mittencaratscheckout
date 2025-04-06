import axios from "axios";
import { useAppContext } from "../utils/appContext";

const baseURL = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.SHEET_ID}/values/${process.env.SHEET_NAME}:append?valueInputOption=USER_ENTERED`;

const { token } = useAppContext();

export const saveCart = async (data) => {
  try {
    await axios.post(baseURL, JSON.stringify(data), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("failed to save data: ", error);
  }
};
