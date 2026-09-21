import React from 'react'
import {
    Box,
    Paper,
    Typography
} from "@mui/material";

const Maintenance = () => {
    return (

        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "#F5F7FB",
                marginTop: "-200px",
            }}
        >

            <Paper
                sx={{
                    p: 5,
                    borderRadius: 4,
                    textAlign: "center"
                }}
            >

                <Typography
                    variant="h4"
                    fontWeight={700}
                    gutterBottom
                >

                    ระบบครุภัณฑ์ สวทช.

                </Typography>

                <Typography
                    variant="h6"
                    color="error"
                >

                    อยู่ระหว่างปรับปรุงข้อมูล

                </Typography>

                <Typography
                    sx={{ mt: 2 }}
                >

                    ขออภัยในความไม่สะดวก

                </Typography>

            </Paper>

        </Box>

    );
}

export default Maintenance
