const ALLOW_ADMIN_IP = [
  "27.145.124.242"
  ];

export const ALLOWED_NETWORKS = [
    // ใส่ Public IP องค์กร
    "110.164.198.",
    "203.185.130.",
    "203.185.133.",
    "27.145.124.231",
    ALLOW_ADMIN_IP
];

export async function getPublicIP() {
    const response = await fetch(
        "https://api.ipify.org?format=json"
    );

    if (!response.ok) {
        throw new Error("Unable to get public IP");
    }

    const data = await response.json();

    return data.ip;
}

function isOfficeNetwork(ip) {
    return ALLOWED_NETWORKS.some(network =>
        ip.startsWith(network)
    );
}

export async function checkNetworkAccess() {
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