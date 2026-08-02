import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import Sidebar from "../components/sidebar/Sidebar";
import Topbar from "../components/navbar/Topbar";

export default function MainLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        bgcolor: "#F5F7FB",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Topbar */}
        <Topbar />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: 4,
            width: "100%",
            maxWidth: "100%",
            overflowX: "hidden",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}