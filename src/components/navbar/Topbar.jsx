import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
} from "@mui/material";

import {
  Menu,
  Notifications,
} from "@mui/icons-material";

export default function Topbar() {
  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <Toolbar>
        {/* Left */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <IconButton>
            <Menu />
          </IconButton>

          <Typography fontWeight={600}>
            หน้าหลัก
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Right */}

        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <IconButton>
            <Notifications />
          </IconButton>

          <Avatar />

          <Typography>
            Admin User
          </Typography>
        </Box> */}

      </Toolbar>
    </AppBar>
  );
}