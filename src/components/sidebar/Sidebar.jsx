import {
  Home,
  Inventory2,
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

const menus = [
  {
    text: "หน้าหลัก",
    icon: <Home />,
  },
  {
    text: "ครุภัณฑ์",
    icon: <Inventory2 />,
  },
  {
    text: "ตรวจสอบครุภัณฑ์",
    icon: <FactCheck />,
  },
  {
    text: "รายงาน",
    icon: <Assessment />,
  },
  {
    text: "ผู้ใช้งาน",
    icon: <People />,
  },
  {
    text: "ตั้งค่า",
    icon: <Settings />,
  },
  {
    text: "ช่วยเหลือ",
    icon: <Help />,
  },
];

export default function Sidebar() {
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
          <ListItemButton key={item.text}>
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