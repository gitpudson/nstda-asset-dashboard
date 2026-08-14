import {
  Home,
  Inventory2,
  Domain,
  FactCheck,
  Assessment,
  People,
  Settings,
  Help,
} from "@mui/icons-material";

import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { Link } from "react-router-dom";
import { useAsset } from "../../contexts/AssetContext";




const menus = [
  {
    text: "หน้าหลัก",
    path: "/nstda-asset-dashboard",
    icon: <Home />,
  },
  {
    text: "NSTDA",
    path: "/nstda-asset-dashboard/org/NSTDA",
    icon: <Domain htmlColor="#2B7FFF"/>,
  },
  {
    text: "NECTEC",
    path: "/nstda-asset-dashboard/org/NECTEC",
    icon: <Domain htmlColor="#FB2C36"/>,
  },
  {
    text: "BIOTEC",
    path: "/nstda-asset-dashboard/org/BIOTEC",
    icon: <Domain htmlColor="#31C950"/>,
  },
  {
    text: "MTEC",
    path: "/nstda-asset-dashboard/org/MTEC",
    icon: <Domain htmlColor="#FFF085"/>,
  },
  {
    text: "NANOTEC",
    path: "/nstda-asset-dashboard/org/NANOTEC",
    icon: <Domain htmlColor="orange"/>,
  },
  {
    text: "ENTEC",
    path: "/nstda-asset-dashboard/org/ENTEC",
    icon: <Domain htmlColor="#36BBA7"/>,
  },
  // {
  //   text: "ตรวจสอบครุภัณฑ์",
  //   icon: <FactCheck />,
  // },
  // {
  //   text: "รายงาน",
  //   icon: <Assessment />,
  // },
  // {
  //   text: "ผู้ใช้งาน",
  //   icon: <People />,
  // },
  // {
  //   text: "ตั้งค่า",
  //   icon: <Settings />,
  // },
  // {
  //   text: "ช่วยเหลือ",
  //   icon: <Help />,
  // },
];

export default function Sidebar() {
  const { loading: assetLoading} = useAsset();
  return (
    <Box
      sx={{
        width: 250,
        background:
          "linear-gradient(180deg,#005BAC,#003F7F)",
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ p: 3 }}
      >
        NSTDA
      </Typography>

      <List>
        {menus.map((item) => (
          <ListItemButton key={item.text}
            component={Link}
            to={item.path}
            disabled={assetLoading}
          >
            <ListItemIcon
              sx={{ color: "#fff" }}
            >
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.text}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}