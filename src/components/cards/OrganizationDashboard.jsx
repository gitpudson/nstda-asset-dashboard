import {
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Box,
  Skeleton,
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import {
  getOrganizationStructure,
  getOrganizationSummary
} from "../../services/organizationService";
import SummaryCard from "./SummaryCard";
import { Inventory2 } from "@mui/icons-material";

export default function OrganizationDashboard() {

  const [data, setData] = useState(null);

  const [org, setOrg] = useState("");

  const [divisionCode, setDivisionCode] = useState("");

  const [departmentCode, setDepartmentCode] = useState("");

  const [summary, setSummary] = useState(null);

  useEffect(() => {

    loadData();

  }, []);

  const loadData = async () => {

    try {

      const result = await getOrganizationStructure();

      setData(result);

    } catch (error) {

      console.error(error);

    }

  };

  useEffect(() => {

    if (!org) {
      return;
    }

    loadSummary();

  }, [
    org,
    divisionCode,
    departmentCode
  ]);

  const loadSummary =
    async () => {

      try {

        const result =
          await getOrganizationSummary(
            org,
            divisionCode,
            departmentCode
          );

        setSummary(result);

      } catch (error) {

        console.error(error);

      }

    };

  const structure =
    data?.structure || {};

  const organizations =
    data?.organizations || [];

  const divisionList =
    org
      ? Object.values(
        structure[org] || {}
      )
      : [];

  const departmentList =
    org && divisionCode
      ? (
        structure[org]
          ?.[divisionCode]
          ?.departments || []
      )
      : [];

  function removeTrailingCode(text) {

    return String(text)
      .replace(/\([^()]*\)$/, "")
      .trim();

  }

  // console.log(
  //   "data",
  //   data
  // );

  // console.log(
  //   "organizations",
  //   organizations
  // );

  // console.log(
  //   "structure",
  //   structure
  // );

  return (

    <Paper
      sx={{
        mt: 4,
        p: 3,
        borderRadius: 3,
      }}
    >

      <Typography
        variant="h6"
        fontWeight={700}
        mb={3}
      >
        วิเคราะห์ข้อมูลตามหน่วยงาน
      </Typography>

      <Grid
        container
        spacing={2}
      >

        {/* Organization */}

        <Grid size={{
          xs: 12,
          md: 4
        }}>

          <TextField
            fullWidth
            select
            label="Organization"
            value={org}
            onChange={(e) => {

              setOrg(
                e.target.value
              );

              setDivisionCode("");
              setDepartmentCode("");

            }}
          >

            {
              organizations.map(item => (

                <MenuItem
                  key={item}
                  value={item}
                >

                  {item}

                </MenuItem>

              ))
            }

          </TextField>

        </Grid>

        {/* Division */}

        <Grid size={{
          xs: 12,
          md: 4
        }}>

          <TextField
            fullWidth
            select
            label="Division"
            value={divisionCode}
            disabled={!org}
            onChange={(e) => {

              setDivisionCode(
                e.target.value
              );

              setDepartmentCode("");

            }}
          >

            {
              divisionList.map(
                item => (

                  <MenuItem
                    key={
                      item.division_code
                    }
                    value={
                      item.division_code
                    }
                  >

                    {/* {
                      item.division_code
                    } */}
                    {item.division_code}
                    {" - "}
                    {removeTrailingCode(
                      item.division_name
                    )}

                  </MenuItem>

                )
              )
            }

          </TextField>

        </Grid>

        {/* Department */}

        <Grid size={{
          xs: 12,
          md: 4
        }}>

          <TextField
            fullWidth
            select
            label="Department"
            value={departmentCode}
            disabled={!divisionCode}
            onChange={(e) => {

              setDepartmentCode(
                e.target.value
              );

            }}
          >

            {
              departmentList.map(
                item => (

                  <MenuItem
                    key={
                      item.department_code
                    }
                    value={
                      item.department_code
                    }
                  >

                    {/* {
                      item.department_code
                    } */}
                    {item.department_code}
                    {" - "}
                    {item.department_name.replace(/\([^()]*\)$/, "")}

                  </MenuItem>

                )
              )
            }

          </TextField>

        </Grid>

      </Grid>

      {/* <Box mt={3}>

        <pre>

          {JSON.stringify({
            org,
            divisionCode,
            departmentCode
          }, null, 2)}

        </pre>

      </Box> */}

      {/* แสดง KPI */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "repeat(7,1fr)",
          gap: 2,
          mt: 3
        }}
      >

        <SummaryCard
          title="ครุภัณฑ์ทั้งหมดของศูนย์"
          value={
            summary?.orgTotalAssets
              ?.toLocaleString() || "-"
          }
          subtitle="รายการ"
          bgColor="#1565C0"
        />

        <SummaryCard
          title="เชื่อมโยงบุคลากรได้"
          value={
            summary?.matchedAssets
              ?.toLocaleString() || "-"
          }
          subtitle="รายการ"
          bgColor="#2E7D32"
        />

        <SummaryCard
          title="ไม่พบข้อมูลบุคลากร"
          value={
            summary?.noStaffMatch
              ?.toLocaleString() || "-"
          }
          subtitle="รายการ"
          bgColor="#EF6C00"
        />

        <SummaryCard
          title="ตรวจสอบแล้ว"
          value={
            summary?.checkedAssets
              ?.toLocaleString() || "-"
          }
        />

        <SummaryCard
          title="ยังไม่ตรวจ"
          value={
            summary?.uncheckedAssets
              ?.toLocaleString() || "-"
          }
        />

        <SummaryCard
          title="รอจำหน่าย"
          value={
            summary?.pendingAssets
              ?.toLocaleString() || "-"
          }
        />

        <SummaryCard
          title="ชำรุด"
          value={
            summary?.damagedAssets
              ?.toLocaleString() || "-"
          }
        />

      </Box>

    </Paper>

  );

}