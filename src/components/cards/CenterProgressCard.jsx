import {
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Box,
    Tooltip,
} from "@mui/material";

export default function CenterProgressCard({
    logo,
    title,
    centerName,
    total,
    checked,
    pending,
    damaged,
    color = "#1976D2",
}) {

    const percent =
        total > 0
            ? ((checked / total) * 100)
            : 0;

    const unchecked = total - checked;

    function InfoRow({
        bg,
        color,
        label,
        value,
    }) {
        return (
            <Box
                sx={{
                    backgroundColor: bg,
                    borderRadius: 2,
                    px: 1.5,
                    py: 0.7,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography
                    sx={{
                        color,
                        fontSize: 13,
                        fontWeight: 600,
                    }}
                >
                    {label}
                </Typography>

                <Typography
                    sx={{
                        fontWeight: 700,
                    }}
                >
                    {value.toLocaleString()}
                </Typography>
            </Box>
        );
    }

    return (
        <Tooltip
            arrow
            placement="top"
            title={
                <>
                    <div>
                        ทั้งหมด :
                        {" "}
                        {total.toLocaleString()}
                    </div>

                    <div>
                        ตรวจแล้ว :
                        {" "}
                        {checked.toLocaleString()}
                    </div>

                    <div>
                        ยังไม่ตรวจ :
                        {" "}
                        {unchecked.toLocaleString()}
                    </div>
                </>
            }
        >
            {/* <Card sx={{ cursor: "help" }} */}
            <Card
                sx={{
                    borderRadius: 3,
                    // height: "100%",
                    height: "465px",
                    width:"350px",

                    cursor: "help",
                    transition: "0.2s",

                    // "&:hover": {
                    //     transform:
                    //         "translateY(-2px)",
                    //     boxShadow:
                    //         "0 4px 16px rgba(0,0,0,0.12)",
                    // },
                }}
            >
                <CardContent
                    sx={{
                        py: 1.5,
                        "&:last-child": {
                            pb: 1.5,
                        },
                    }}
                >


                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "center",
                            mb: 1,
                        }}
                    >
                        <img
                            src={logo}
                            alt={title}
                            style={{
                                height: 28,
                                objectFit: "contain",
                                marginBottom: 12,
                            }}
                        />
                    </Box>

                    <Typography
                        align="center"
                        sx={{
                            fontSize: 18,
                            fontWeight: 600,
                        }}
                    >
                        {total.toLocaleString()}
                    </Typography>

                    <Typography
                        align="center"
                        variant="body2"
                        color="text.secondary"
                    >
                        รายการ
                    </Typography>

                    <Typography
                        align="center"
                        variant="body2"
                        sx={{
                            mt: 1,
                            fontWeight: 500,
                        }}
                    >
                        ตรวจแล้ว
                        {/* {" "}
                        {checked.toLocaleString()} */}
                        {" "}
                        (
                        {percent.toFixed(2)}
                        %)
                    </Typography>

                    <LinearProgress
                        variant="determinate"
                        value={percent}
                        sx={{
                            mt: 1,
                            height: 9,
                            borderRadius: 10,
                            backgroundColor: "#E5E7EB",
                            "& .MuiLinearProgress-bar":
                            {
                                backgroundColor: color,
                            },
                        }}
                    />

                    <Typography
                        align="right"
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            display: "block",
                            mt: 0.5,
                        }}
                    >
                        {/* {percent.toFixed(2)}% */}
                    </Typography>

                    <Box
                        sx={{
                            mt: 2,
                            display: "flex",
                            flexDirection: "column",
                            gap: 5,
                        }}
                    >
                        <InfoRow
                            bg="#F0FDF4"
                            color="#12a046"
                            label="ตรวจแล้ว"
                            value={checked}
                        />

                        <InfoRow
                            bg="#F8FAFC"
                            color="#64748B"
                            label="ยังไม่ตรวจ"
                            value={unchecked}
                        />

                        <InfoRow
                            bg="#FFF7ED"
                            color="#EA580C"
                            label="รอจำหน่าย"
                            value={pending}
                        />

                        <InfoRow
                            bg="#FEF2F2"
                            color="#DC2626"
                            label="ชำรุด"
                            value={damaged}
                        />
                    </Box>

                </CardContent>
            </Card>
        </Tooltip>
    );
}