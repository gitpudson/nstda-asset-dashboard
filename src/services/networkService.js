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

export async function checkNetworkAccessxx() {

    try {

        const ip =
            await getPublicIP();

        const networks =
            await getAllowedNetwork();

        //  console.log(
        //     "Current IP:",
        //     ip
        // );

        const matched =
            networks.find(
                item =>
                    ip.startsWith(
                        item.ip
                    )
            );

        if (
            matched &&
            matched.allow === "Y"
        ) {

            return {
                allowed: true,
                ip,
                error: false
            };

        }

        // บันทึก IP ใหม่เข้า Sheet
        await addUnknownIP(ip);

        return {
            allowed: false,
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

export async function addUnknownIP(ip) {

    const response =
        await axios.post(
            assets.API_URL,
            {
                function:
                    "addUnknownIP",

                payload: {
                    ip
                }
            },
            {
                headers: {
                    "Content-Type":
                        "text/plain",
                },
            }
        );

    return response.data;

}


//ตรวจสอบว่าเชื่อมต่อ VPN ของ NSTDA หรือไม่
async function isNSTDAVPN1() {

    try {

        await fetch(
            "https://ehr.nstda.or.th",
            {
                mode: "no-cors"
            }
        );

        console.log(
            "***vpnConnected***");

        return true;

    }

    catch {
        console.log(
            "***vpn Not Connected***");
        return false;

    }

}
// ตรวจสอบว่าเชื่อมต่อ VPN NSTDA หรือไม่
async function isNSTDAVPN() {

    try {

        await fetch(
            "https://ehr.nstda.or.th",
            // "https://i.nstda.or.th",
            {
                mode: "no-cors"
            }
        );

        // console.log(
        //     "*** VPN Connected ***"
        // );

        return true;

    }

    catch (error) {

        // console.log(
        //     "*** VPN Not Connected ***"
        // );

        return false;

    }

}



export async function
    checkNetworkAccess3() {

    const ip =
        await getPublicIP();

    const networks =
        await getAllowedNetwork();

    const matched =
        networks.find(
            item =>
                ip.startsWith(
                    item.ip
                )
        );

    if (
        matched &&
        matched.allow === "Y"
    ) {

        return {
            allowed: true
        };

    }

    const vpnConnected =
        await isNSTDAVPN();

    if (
        vpnConnected
    ) {          
        return {
            allowed: true
        };

    }

    await addUnknownIP(ip);

    return {
        allowed: false
    };

}

export async function checkNetworkAccess() {

    try {

        //--------------------------------------------------
        // 1. VPN มาก่อน
        //--------------------------------------------------

        const vpnConnected =
            await isNSTDAVPN();

        if (vpnConnected) {

            // console.log(
            //     "Access Granted : NSTDA VPN"
            // );

            return {
                allowed: true,
                type: "VPN",
                error: false
            };

        }

        //--------------------------------------------------
        // 2. ตรวจ Public IP
        //--------------------------------------------------

        const ip =
            await getPublicIP();

        const networks =
            await getAllowedNetwork();

        const matched =
            networks.find(
                item =>
                    ip.startsWith(
                        item.ip
                    )
            );

        if (
            matched &&
            (
                matched.allow === "Y" ||
                matched.allow === "YES"
            )
        ) {

            // console.log(
            //     "Access Granted : Allow List"
            // );

            return {
                allowed: true,
                type: "ALLOW_LIST",
                ip,
                error: false
            };

        }

        //--------------------------------------------------
        // 3. ไม่พบ -> Block และบันทึก IP
        //--------------------------------------------------

        await addUnknownIP(ip);

        // console.log(
        //     "Blocked IP:",
        //     ip
        // );

        return {
            allowed: false,
            type: "BLOCKED",
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

            type: "ERROR",

            ip: null,

            error: true

        };

    }

}

