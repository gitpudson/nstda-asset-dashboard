import axios from "axios";
import { assets } from "../assets/assets";

const ALLOW_ADMIN_IP = [
    "49.237.20.33"
];

export const ALLOWED_NETWORKS = [
    // ใส่ Public IP องค์กร
    "110.164.198.",
    "110.78.70.161",
    "122.155.95.",
    "203.185.133.",
    "203.185.133.",
    "27.145.124.231",
    ALLOW_ADMIN_IP
];

export async function getPublicIP1() {
    const response = await fetch(
        "https://api.ipify.org?format=json"
    );

    if (!response.ok) {
        throw new Error("Unable to get public IP");
    }

    const data = await response.json();

    return data.ip;
}

export async function getPublicIP() {

    const response =
        await fetch(
            "https://api.ipify.org?format=json"
        );

    if (!response.ok) {

        throw new Error(
            "Unable to get public IP"
        );

    }

    const data =
        await response.json();

    return data.ip;

}

function isOfficeNetwork1(ip) {
    return ALLOWED_NETWORKS.some(network =>
        ip.startsWith(network)
    );
}

function isOfficeNetwork(
    ip,
    networks
) {

    return networks.some(
        network =>
            ip.startsWith(
                network
            )
    );

}

export async function checkNetworkAccess1() {
    try {
        const ip = await getPublicIP();
        // console.log("Current IP:", ip);
        return {
            allowed: isOfficeNetwork(ip),
            ip,
            error: false
        };
    } catch (error) {
        console.error(error);
        return {
            allowed: false,
            ip: null,
            error: true
        };
    }
}

export async function checkNetworkAccess() {

    try {

        const ip =
            await getPublicIP();

        const networks =
            await getAllowedNetwork();

        // console.log(
        //     "Current IP:",
        //     ip
        // );

        // console.log(
        //     "Allowed Networks:",
        //     networks
        // );

        return {

            allowed:
                isOfficeNetwork(
                    ip,
                    networks
                ),

            ip,

            error: false

        };

    }

    catch (error) {

        console.error(
            error
        );

        return {

            allowed: false,

            ip: null,

            error: true

        };

    }

}

export async function getAllowedNetwork() {

    const post = {
        function: "getAllowedNetwork",
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

    // return response.data.data;

    return response.data.data || [];

}