import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";

import {
    Box,
    Typography,
    Skeleton
} from "@mui/material";

const COLORS = {
    NSTDA: "#2F80ED",
    NECTEC: "#EB5757",
    BIOTEC: "#27AE60",
    MTEC: "#F2C94C",
    NANOTEC: "#F2994A",
    ENTEC: "#56CCF2",
};

export default function AssetPieChart({
    data = [],
    loading,
}) {

    if (loading) {
        return (
            <Skeleton
                variant="rounded"
                width="100%"
                height={170}
                
            />
        );
    }

    const chartData = data.map(item => ({
        name: item.org,
        value: item.total,
        color:
            COLORS[item.org] || "#999999",
    }));

    const total = chartData.reduce(
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
                            data={chartData}
                            dataKey="value"
                            innerRadius={45}
                            outerRadius={75}
                        >
                            {chartData.map(item => (
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
                {chartData.map(item => (
                    <Box
                        key={item.name}
                        sx={{
                            display: "grid",
                            gridTemplateColumns:
                                "1fr 55px",
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
                            sx={{
                                textAlign: "right",
                            }}
                        >
                            {total > 0
                                ? (
                                    (item.value /
                                        total) *
                                    100
                                ).toFixed(2)
                                : 0}
                            %
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}