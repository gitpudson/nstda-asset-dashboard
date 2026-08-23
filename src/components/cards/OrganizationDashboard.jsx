import {
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import {
  getOrganizationStructure
} from "../../services/organizationService";

export default function OrganizationDashboard() {

  const [data, setData] =
    useState(null);

  const [org, setOrg] =
    useState("");

  const [divisionCode, setDivisionCode] =
    useState("");

  const [departmentCode, setDepartmentCode] =
    useState("");

  useEffect(() => {

    loadData();

  }, []);

  const loadData = async () => {

    try {

      const result =
        await getOrganizationStructure();

      setData(result);

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
            ?. [divisionCode]
            ?.departments || []
        )
      : [];

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

                    {
                      item.division_code
                    }

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

                    {
                      item.department_code
                    }

                  </MenuItem>

                )
              )
            }

          </TextField>

        </Grid>

      </Grid>

      <Box mt={3}>

        <pre>

{JSON.stringify({
  org,
  divisionCode,
  departmentCode
}, null, 2)}

        </pre>

      </Box>

    </Paper>

  );

}