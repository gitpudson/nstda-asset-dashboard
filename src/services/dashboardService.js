import axios from "axios";
import { assets } from "../assets/assets";

export const getDashboardSummary =
    async (org = "") => {

        const post = {
            function: "getDashboardSummary",
            payload: {
                org,
            },
        };

        const response =
            await axios.post(
                assets.API_URL,
                post,
                {
                    headers: {
                        "Content-Type":
                            "text/plain",
                    },
                }
            );

        return response.data.data;
    };

export const getCenterSummary =
    async () => {

        const post = {
            function: "getCenterSummary",
            payload: {
               
            },
        };

        const response =
            await axios.post(
                assets.API_URL,
                post,
                {
                    headers: {
                        "Content-Type":
                            "text/plain",
                    },
                }
            );

        return response.data.data;
    };