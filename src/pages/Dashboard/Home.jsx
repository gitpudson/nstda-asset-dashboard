import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

import {
  Inventory2,
  CheckCircle,
  Warning,
  Error,
} from "@mui/icons-material";

import SummaryCard from "../../components/cards/SummaryCard";
import CenterCard from "../../components/cards/CenterCard";

import AssetPieChart from "../../components/charts/AssetPieChart";
import VerifyPieChart from "../../components/charts/VerifyPieChart";

import AssetTable from "../../components/tables/AssetTable";

import {
  centers,
  assetRows,
} from "../../data/mockData";

export default function Home() {
  const handleRefresh = () => {
    console.log("refresh");
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
          >
            ระบบตรวจสอบครุภัณฑ์ สวทช.
          </Typography>

          <Typography color="text.secondary">
            ประจำปี 2569
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            อัปเดตล่าสุด :
            24 พ.ค. 2569 10:30 น.
          </Typography>

          <Tooltip title="รีเฟรชข้อมูล">
            <IconButton
              onClick={handleRefresh}
              size="small"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* KPI */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, 1fr)",
          gap: 3,
          mb: 3,
        }}
      >
        <SummaryCard
          title="ครุภัณฑ์ทั้งหมด"
          value="12,450"
          subtitle="รายการ"
          bgColor="#1976D2"
          icon={<Inventory2 />}
        />

        <SummaryCard
          title="ตรวจสอบแล้ว"
          value="10,980"
          subtitle="88.20%"
          bgColor="#22C55E"
          icon={<CheckCircle />}
        />

        <SummaryCard
          title="รอการตรวจสอบ"
          value="1,250"
          subtitle="10.04%"
          bgColor="#F59E0B"
          icon={<Warning />}
        />

        <SummaryCard
          title="ชำรุด / เสียหาย"
          value="220"
          subtitle="1.76%"
          bgColor="#EF4444"
          icon={<Error />}
        />
      </Box>

      {/* Cards + Charts */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "stretch",
          mb: 3,
        }}
      >
        {centers.map((center, index) => {
          // console.log("logo", center);

            return (
              <CenterCard
                key={center.name}
                title={center.name}
                logo={center.logo}
                total={center.total}
                active={index === 0}
              />
            );
          })}

        <Paper
          sx={{
            width: 380,
            height: 220,
            p: 2,
            borderRadius: 3,
            flexShrink: 0,
          }}
        >
          <Typography
            fontWeight={700}
            mb={2}
          >
            ครุภัณฑ์แยกตามหน่วยงาน
          </Typography>

          <AssetPieChart />
        </Paper>

        <Paper
          sx={{
            width: 390,
            height: 220,
            p: 2,
            borderRadius: 3,
            flexShrink: 0,
          }}
        >
          <Typography
            fontWeight={700}
            mb={2}
          >
            ความคืบหน้าการตรวจสอบ
          </Typography>

          <VerifyPieChart />
        </Paper>
      </Box>

      {/* Table */}
      <AssetTable rows={assetRows} />
    </Box>
  );
}