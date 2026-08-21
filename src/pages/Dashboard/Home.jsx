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
  WarningAmber,
} from "@mui/icons-material";

import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

import SummaryCard from "../../components/cards/SummaryCard";
import CenterCard from "../../components/cards/CenterCard";

import AssetPieChart from "../../components/charts/AssetPieChart";
import VerifyPieChart from "../../components/charts/VerifyPieChart";

import AssetTable from "../../components/tables/AssetTable";
import { useAsset } from "../../contexts/AssetContext";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";

import {
  centers,
  assetRows,
  dashboardSummary
} from "../../data/mockData";
import CenterProgressCard from "../../components/cards/CenterProgressCard";

dayjs.extend(buddhistEra);
dayjs.locale("th");

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

  const [summary, setSummary] = useState(null);

  const [centerSummary, setCenterSummary] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const { loading: assetLoading, reloadSearchIndex } = useAsset();


  // const handleRefresh = async () => {

  //   try {

  //     setLoadingSummary(true);

  //     // Rebuild Dashboard_Summary
  //     await refreshDashboardSummary();

  //     await loadCenterSummary();

  //     const data =
  //       await getDashboardSummary(
  //         org
  //       );

  //     setSummary(data);

  //   } catch (error) {

  //     console.error(
  //       "Refresh Error",
  //       error
  //     );

  //   } finally {

  //     setLoadingSummary(false);

  //   }

  // };

  // const handleRefresh = async () => {

  //   try {

  //     setLoadingSummary(true);

  //     // Rebuild Dashboard Summary
  //     await refreshDashboardSummary();

  //     // Reload Search Index
  //     await reloadSearchIndex();

  //     // Reload Center Summary
  //     await loadCenterSummary();

  //     // Reload Dashboard Summary
  //     const data =
  //       await getDashboardSummary(
  //         org
  //       );

  //     setSummary(data);

  //   } catch (error) {

  //     console.error(
  //       "Refresh Error",
  //       error
  //     );

  //   } finally {

  //     setLoadingSummary(false);

  //   }

  // };

  const handleRefresh = async () => {

    try {

      setLoadingSummary(true);

      await refreshDashboardSummary();

      await reloadSearchIndex();

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


  // if (!org && assetLoading) {

  //   return (
  //     <Box
  //       sx={{
  //         height: "70vh",
  //         display: "flex",
  //         flexDirection: "column",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         gap: 2,
  //       }}
  //     >
  //       <CircularProgress />

  //       <Typography variant="h4">
  //         กำลังเตรียมข้อมูลระบบ
  //       </Typography>

  //       {/* <Typography>
  //         กำลังโหลดข้อมูลครุภัณฑ์สำหรับการค้นหา (มากกว่า 70,000 รายการ)
  //       </Typography> */}
  //       {/* <Typography>
  //         กำลังโหลดข้อมูลครุภัณฑ์สำหรับการค้นหา...
  //       </Typography> */}

  //       <Typography
  //         variant="h4"
  //         color="text.secondary"
  //       >
  //         กรุณารอสักครู่.....
  //       </Typography>

  //     </Box>
  //   );

  // }

  const uncheckedAssets =
    (summary?.totalAssets || 0) -
    (summary?.checkedAssets || 0);

  const uncheckedPercent =
    summary?.totalAssets > 0
      ? (
        uncheckedAssets /
        summary.totalAssets *
        100
      ).toFixed(2)
      : "0.00";

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
              // summary?.lastUpdate
              //   ? dayjs(summary.lastUpdate)
              //     .locale("th")
              //     .format(
              //       "D MMM YYYY HH:mm น."
              //     )
              //   : "-"
              summary?.lastUpdate
                ? dayjs(summary.lastUpdate)
                  .format("D MMMM BBBB HH:mm น.")
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
            "repeat(5, 1fr)",
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
                  variant="rounded"
                  sx={{
                    borderRadius: 3
                  }}
                  animation="wave"

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
          }} />}
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
                  variant="rounded"
                  sx={{
                    borderRadius: 3
                  }}
                  animation="wave"
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

        <Tooltip
          arrow
          placement="top"
          title={
            <>
              ครุภัณฑ์ที่ยังไม่มีการอัปเดตสถานะ
              <br />
              ในรอบการตรวจสอบปัจจุบัน
            </>
          }
        >
          <Box sx={{ cursor: "help" }}>
            <SummaryCard
              title="ยังไม่ตรวจสอบ"
              value={
                loadingSummary
                  ? (
                    <Skeleton
                      width={100}
                      height={50}
                      variant="rounded"
                      sx={{
                        borderRadius: 3
                      }}
                      animation="wave"
                    />
                  )
                  : (
                    uncheckedAssets
                      .toLocaleString()
                  )
              }
              subtitle={`${uncheckedPercent}%`}
              bgColor="#9CA3AF"
              icon={
                <RadioButtonUncheckedIcon
                  sx={{ fontSize: 40 }}
                />
              }
            />
          </Box>
        </Tooltip>

        <SummaryCard
          title="รอจำหน่าย"
          // value={summary.pendingAssets.toLocaleString()}
          value={
            loadingSummary
              ? (
                <Skeleton
                  width={100}
                  height={50}
                  variant="rounded"
                  sx={{
                    borderRadius: 3
                  }}
                  animation="wave"
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
                  variant="rounded"
                  sx={{
                    borderRadius: 3
                  }}
                  animation="wave"
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
          icon={<WarningAmber sx={{
            fontSize: 35
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
            {
              centerSummary.length === 0
                ? (
                  <>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Skeleton
                        key={i}
                        width={350}
                        height={465}
                        variant="rounded"
                        sx={{
                          borderRadius: 3
                        }}
                        animation="wave"
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
                      // <CenterCard
                      //   key={center.org}
                      //   title={center.org}
                      //   logo={centerInfo?.logo}
                      //   total={center.total}
                      //   active={false}
                      // />
                      <CenterProgressCard
                        key={center.org}
                        title={center.org}
                        centerName={center.org}
                        logo={centerInfo?.logo}
                        total={center.total}
                        checked={center.checked || 0}
                        pending={center.pending}
                        damaged={center.damaged}
                        color={
                          {
                            "สก.": "#1976D2",
                            "ศอ.": "#E53935",
                            "ศช.": "#7CB342",
                            "ศว.": "#FBC02D",
                            "ศล.": "#26A69A",
                            "ศน.": "#FB8C00",
                          }[center.org]
                        }
                      />
                    );

                  })
                )
            }

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                alignItems: "stretch",
                mb: 3,
              }}
            >

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
                  ครุภัณฑ์แยกตามหน่วยงาน
                </Typography>

                <AssetPieChart data={centerSummary} loading={loadingSummary} />
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

                <VerifyPieChart summary={summary} loading={loadingSummary} />
              </Paper>

            </Box>



          </>
        )}

      </Box>

    </Box>
  );
}