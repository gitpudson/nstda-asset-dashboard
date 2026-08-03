import axios from "axios";
import { assets } from "../assets/assets";

export const getDashboardSummary =
    async () => {

        const post = {
            function: "getDashboardSummary",
            payload: {},
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