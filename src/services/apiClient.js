import axios from "axios";
import { useAppContext } from "../utils/appContext";

const sheetId = process.env.SHEET_ID;
const sheetName = process.env.SHEET_NAME;
const baseURL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED`;

const { token } = useAppContext();

export const saveCart =  async (data) => {
    try {
        await axios.post(baseURL, JSON.stringify(data), {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
    } catch (error) {
        console.log("failed to save data: ", error);
    }
}