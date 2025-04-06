import { StatusCodes } from "http-status-codes";

import { useAppContext } from "../utils/appContext";
import apiClient from "./apiClient";

const { token, setLoading } = useAppContext();

export const saveCart = async (data) => {
  setLoading(true);
  try {
    const response = await apiClient.post("", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === StatusCodes.OK) {
      console.log("Data saved successfully");
    } else {
      console.error(
        `Failed to save data: ${response.status} - ${response.statusText}`,
      );
      throw new Error(`Failed to save data: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error saving data:", error.message);
    throw error; // Re-throw the error for the caller to handle
  }
};
