import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Skeleton,
  CircularProgress
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

import { useEffect, useState } from "react";
import { getDashboardSummary, getCenterSummary, refreshDashboardSummary } from "../../services/dashboardService";

import {
  Inventory2,
  CheckCircle,
  Update,
  Warning,
  Error,
} from "@mui/icons-material";

import SummaryCard from "../../components/cards/SummaryCard";
import CenterCard from "../../components/cards/CenterCard";

import AssetPieChart from "../../components/charts/AssetPieChart";
import VerifyPieChart from "../../components/charts/VerifyPieChart";

import AssetTable from "../../components/tables/AssetTable";
import { useAsset } from "../../contexts/AssetContext";
import dayjs from "dayjs";
import "dayjs/locale/th";

import {
  centers,
  assetRows,
  dashboardSummary
} from "../../data/mockData";

export default function Home({
  org = "",
}) {

  const selectedCenter = centers.find(
    (center) => center?.name === org
  );

  // const title = org
  //   ? `รายการครุภัณฑ์ทั้งหมดของศูนย์ ${logo}`
  //   : "รายการครุภัณฑ์ทั้งหมดของทุกศูนย์ สวทช.";

  // const handleRefresh = () => {
  //   await loadDashboardSummary();
  //   await loadCenterSummary();
  // };
  const handleRefresh = async () => {

    try {

      setLoadingSummary(true);

      // Rebuild Dashboard_Summary
      await refreshDashboardSummary();

      await loadCenterSummary();

      const data =
        await getDashboardSummary(
          org
        );

      setSummary(data);

    } catch (error) {

      console.error(
        "Refresh Error",
        error
      );

    } finally {

      setLoadingSummary(false);

    }

  };

  // const [summary, setSummary] = useState({
  //   totalAssets: 0,
  //   checkedAssets: 0,
  //   pendingAssets: 0,
  //   damagedAssets: 0,
  // });
  const [summary, setSummary] = useState(null);

  const [centerSummary, setCenterSummary] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const { loading: assetLoading, } = useAsset();

  useEffect(() => {
    loadCenterSummary();
  }, []);

  const loadCenterSummary =
    async () => {

      const result =
        await getCenterSummary();

      setCenterSummary(result);
      // console.log("getCenterSummary", result);
      // setLoadingSummary(false);
    };

  useEffect(() => {

    const loadData = async () => {

      // setSummary({
      //   totalAssets: 0,
      //   checkedAssets: 0,
      //   pendingAssets: 0,
      //   damagedAssets: 0,
      // });
      setLoadingSummary(true);
      setSummary(null);

      try {

        const data =
          await getDashboardSummary(org);

        console.log(
          "ORG",
          org
        );

        // console.log(
        //   "Dashboard Summary",
        //   data
        // );

        setSummary(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoadingSummary(false);

      }

    };

    loadData();

  }, [org]);

  const loadDashboardSummary = async () => {
    try {
      setLoadingSummary(true);
      const data = await getDashboardSummary(org);

      console.log("Dashboard Summary:", data);

      setSummary(data);
      setLoadingSummary(false);
    } catch (error) {
      console.error(error);
    }
    finally {
      setLoadingSummary(false);
    }
  };

  const checkedPercent =
    summary?.totalAssets > 0
      ? (
        (summary.checkedAssets /
          summary.totalAssets) *
        100
      ).toFixed(2)
      : "0.00";

  const pendingPercent =
    summary?.totalAssets > 0
      ? (
        (summary.pendingAssets /
          summary.totalAssets) *
        100
      ).toFixed(2)
      : "0.00";

  const damagedPercent =
    summary?.totalAssets > 0
      ? (
        (summary.damagedAssets /
          summary.totalAssets) *
        100
      ).toFixed(2)
      : "0.00";

  // console.log("centerSummary", centerSummary);
  if (!org && assetLoading) {

    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress />

        <Typography variant="h4">
          กำลังเตรียมข้อมูลระบบ...
        </Typography>

        {/* <Typography>
          กำลังโหลดข้อมูลครุภัณฑ์สำหรับการค้นหา (มากกว่า 70,000 รายการ)
        </Typography> */}
        {/* <Typography>
          กำลังโหลดข้อมูลครุภัณฑ์สำหรับการค้นหา...
        </Typography> */}

        <Typography
          variant="h4"
          color="text.secondary"
        >
          กรุณารอสักครู่
        </Typography>

      </Box>
    );

  }

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
            variant="h5"
            fontWeight={700}
          >
            {/* ระบบตรวจสอบครุภัณฑ์ สวทช. */}
            {/* {
              selectedCenter && (
                <img
                  src={selectedCenter.logo}
                  alt={selectedCenter.title}
                  style={{
                    height: 50,
                    objectFit: "contain",
                    marginBottom: -10,
                    marginRight: 40,
                  }}
                />

              )
            } */}

            {org
              ? `สรุปข้อมูลครุภัณฑ์ของศูนย์ ${selectedCenter.initial_name}`
              : "สรุปข้อมูลครุภัณฑ์ทั้งหมดของทุกศูนย์"}

          </Typography>

          <Typography color="text.secondary">
            {`ปีงบประมาณ ${new Date().getFullYear() + 543}`}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* <Typography
            variant="body2"
            color="text.secondary"
          >
            อัปเดตล่าสุด :
            24 พ.ค. 2569 10:30 น.
          </Typography> */}

          <Typography
            variant="body2"
            color="text.secondary"
          >
            อัปเดตล่าสุด :{" "}
            {
              summary?.lastUpdate
                ? dayjs(summary.lastUpdate)
                  .locale("th")
                  .format(
                    "D MMM YYYY HH:mm น."
                  )
                : "-"
            }
          </Typography>

          {/* <Tooltip title="รีเฟรชข้อมูล">
            <IconButton
              onClick={handleRefresh}
              size="small"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip> */}

          <Tooltip title="รีเฟรชข้อมูล">
            <IconButton
              onClick={handleRefresh}
              size="small"
              disabled={loadingSummary}
            >
              {
                loadingSummary
                  ? <CircularProgress size={18} />
                  : <RefreshIcon />
              }
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
          // value={summary.totalAssets.toLocaleString()}
          value={
            loadingSummary
              ? (
                <Skeleton
                  width={100}
                  height={50}
                />
              )
              : (
                // summary.totalAssets.toLocaleString()
                summary?.totalAssets
                  ?.toLocaleString() || "-"
              )
          }
          subtitle="รายการ"
          bgColor="#1976D2"
          icon={<Inventory2 sx={{
            fontSize: 40
          }}/>}
        />


        <SummaryCard
          title="ตรวจสอบแล้ว"
          // value={summary.checkedAssets.toLocaleString()}
          value={
            loadingSummary
              ? (
                <Skeleton
                  width={100}
                  height={50}
                />
              )
              : (
                // summary.checkedAssets.toLocaleString()
                summary?.checkedAssets
                  ?.toLocaleString() || "-"
              )
          }
          subtitle={`${checkedPercent}%`}
          bgColor="#22C55E"
          icon={<CheckCircle sx={{
            fontSize: 40
          }} />}
        />

        <SummaryCard
          title="รอจำหน่าย"
          // value={summary.pendingAssets.toLocaleString()}
          value={
            loadingSummary
              ? (
                <Skeleton
                  width={100}
                  height={50}
                />
              )
              : (
                // summary.pendingAssets.toLocaleString()
                summary?.pendingAssets
                  ?.toLocaleString() || "-"
              )
          }
          subtitle={`${pendingPercent}%`}
          bgColor="#F59E0B"
          icon={<Update sx={{
            fontSize: 40
          }} />}
        />

        <SummaryCard
          title="ชำรุด / เสียหาย"
          // value={summary.damagedAssets.toLocaleString()}
          value={
            loadingSummary
              ? (
                <Skeleton
                  width={100}
                  height={50}
                />
              )
              : (
                // summary.damagedAssets.toLocaleString()
                summary?.damagedAssets
                  ?.toLocaleString() || "-"
              )
          }
          subtitle={`${damagedPercent}%`}
          bgColor="#EF4444"
          icon={<Error sx={{
            fontSize: 40
          }} />}
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
        {!org && (
          <>
            {/* {centerSummary.map((center, index) => {
              // console.log("logo", center);
              const centerInfo =
                centers.find(
                  x => x?.name === center?.org
                );

              return (
                <CenterCard
                  key={center.name}
                  title={center.name}
                  logo={centerInfo?.logo}
                  total={center.total}
                  active={false}
                />
              );
            })} */}
            {
              centerSummary.length === 0
                ? (
                  <>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Skeleton
                        key={i}
                        variant="rounded"
                        width={120}
                        height={140}
                      />
                    ))}
                  </>
                )
                : (
                  centerSummary.map((center) => {

                    const centerInfo =
                      centers.find(
                        x => x?.name === center?.org
                      );

                    return (
                      <CenterCard
                        key={center.org}
                        title={center.org}
                        logo={centerInfo?.logo}
                        total={center.total}
                        active={false}
                      />
                    );

                  })
                )
            }

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

              <AssetPieChart data={centerSummary} loading={loadingSummary} />
            </Paper>

          </>
        )}

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

          <VerifyPieChart summary={summary} loading={loadingSummary} />
        </Paper>

      </Box>


      {/* Table */}
      {/* <AssetTable rows={assetRows} /> */}
    </Box>
  );
}