import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";

import {
    Box,
    Typography,
} from "@mui/material";

const data = [
    { name: "NSTDA", value: 3450, color: "#2F80ED" },
    { name: "NECTEC", value: 2450, color: "#EB5757" },
    { name: "BIOTEC", value: 1860, color: "#27AE60" },
    { name: "MTEC", value: 2210, color: "#F2C94C" },
    { name: "NANOTEC", value: 2480, color: "#F2994A" },
];

export default function AssetPieChart() {
    const total = data.reduce(
        (sum, item) => sum + item.value,
        0
    );

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                height: 180,
            }}
        >
            <Box
                sx={{
                    width: 190,
                    position: "relative",
                    height: "100%",
                    flexShrink: 0,
                }}
            >
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            innerRadius={45}
                            outerRadius={75}
                        >
                            {data.map((item) => (
                                <Cell
                                    key={item.name}
                                    fill={item.color}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform:
                            "translate(-50%, -50%)",
                        textAlign: "center",
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        {total.toLocaleString()}
                    </Typography>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        รายการ
                    </Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    width: 180,
                    ml: -1,
                }}
            >
                {data.map((item) => (
                    <Box
                        key={item.name}
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 55px",
                            alignItems: "center",
                            mb: 1,
                            columnGap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                whiteSpace: "nowrap",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    bgcolor: item.color,
                                }}
                            />

                            <Typography
                                variant="body2"
                            >
                                {item.name}
                            </Typography>
                        </Box>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            textAlign="right"
                        >
                            {(
                                (item.value / total) *
                                100
                            ).toFixed(1)}
                            %
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}