// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Box,
//   IconButton,
//   Avatar,
// } from "@mui/material";

// import {
//   Menu,
//   Notifications,
// } from "@mui/icons-material";

// export default function Topbar() {
//   return (
//     <AppBar
//       position="static"
//       color="inherit"
//       elevation={0}
//       sx={{
//         borderBottom: "1px solid #E5E7EB",
//       }}
//     >
//       <Toolbar>
//         {/* Left */}
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             gap: 2,
//           }}
//         >
//           <IconButton>
//             <Menu />
//           </IconButton>

//           <Typography fontWeight={600}>
//             หน้าหลัก
//           </Typography>
//         </Box>

//         {/* Spacer */}
//         <Box sx={{ flexGrow: 1 }} />

//         {/* Right */}

//         {/* <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             gap: 2,
//           }}
//         >
//           <IconButton>
//             <Notifications />
//           </IconButton>

//           <Avatar />

//           <Typography>
//             Admin User
//           </Typography>
//         </Box> */}

//       </Toolbar>
//     </AppBar>
//   );
// }

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
} from "@mui/material";

import { Menu } from "@mui/icons-material";
import { useLocation } from "react-router-dom";

export default function Topbar() {

  const location =
    useLocation();

  let title =
    "หน้าหลัก";

  if (
    location.pathname ===
    "/nstda-asset-dashboard"
  ) {

    title =
      "หน้าหลัก";

  } else if (
    location.pathname.includes(
      "/nstda-asset-dashboard/org/"
    )
  ) {

    const org =
      location.pathname
        .split("/")
        .pop();

    title =
      `ศูนย์ ${org.toUpperCase()}`;

  }

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom:
          "1px solid #E5E7EB",
      }}
    >
      <Toolbar>

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

          <Typography
            fontWeight={600}
          >
            {title}
          </Typography>

        </Box>

        <Box
          sx={{ flexGrow: 1 }}
        />

        {/* Right */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              // color: "#0e35b4",
              color: "#991b2c",
              fontWeight: 700,
            }}
          >
            DEVELOPED BY SMR@NECTEC
          </Typography>

        </Box>

      </Toolbar>
    </AppBar>
  );

}