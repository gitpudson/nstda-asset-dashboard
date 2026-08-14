import axios from "axios";
import { assets } from "../assets/assets";

export const getAssets = async (
    page,
    pageSize
) => {

    //     const API_URL =
    //   "https://script.google.com/macros/s/AKfycbyg6MlP1rcgNjTaWgob_GZyQS4WiJfE56-nSmhkuk2AgAwUwK8tUeFE1LKIFAfgH5ryzA/exec";

    const post = {
        function: 'getAsset',
        payload: {
            "page": page,
            "pagesize": pageSize
        }
    };

    const response = await axios.post(
        assets.API_URL,
        post,
        {
            headers: {
                'Content-Type': 'text/plain'
            }
        }
    );

    console.log("SERVICE RESPONSE");
    console.log(response.data);
    return response.data.data;

};

export const getAssetSearchIndex =
    async () => {

        const post = {
            function: "getAssetSearchIndex",
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

export const getAssetLastUpdate =
    async () => {

        const post = {
            function: "getAssetLastUpdate",
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

export const getAssetByRows = async (
    rowNumbers
) => {

    const post = {
        function: "getAssetByRows",
        payload: {
            rowNumbers,
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

export const exportAssetExcel = async (
    rows
) => {

    console.log(
        "******rows******",
        rows
    );

    const post = {
        function: "exportAssetExcel",
        payload: {
            rows,
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

    console.log(
        "****exportAssetExcel response******",
        response.data.data
    );

    return response.data.data;
};


// export const getAssets = async ({
//     page,
//     pageSize,
//     org,
//     keyword,
//     status,
// }) => {

//     const response =
//         await axios.post(
//             API_URL,
//             {
//                 function: "getAssets",
//                 payload: {
//                     page,
//                     pageSize,
//                     org,
//                     keyword,
//                     status,
//                 },
//             }
//         );

//     return response.data.data;

// };