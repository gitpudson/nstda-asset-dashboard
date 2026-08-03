import { useMemo, useState, useEffect } from "react";
import { getAssetByRows } from "../../services/assetService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import AssetDetailDrawer from "../../pages/Assets/AssetDetailDrawer";

import {
  Box,
  Chip,
  IconButton,
  Paper,
  TextField,
  Typography,
  MenuItem,
  InputAdornment,
  Button,
  Tooltip,
  CircularProgress,
} from "@mui/material";

import {
  Search,
  Visibility,
  Edit,
  Download,
} from "@mui/icons-material";

import { DataGrid } from "@mui/x-data-grid";
import { useAsset } from "../../contexts/AssetContext";

export default function AssetTable() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [orgOwner, setOrgOwner] = useState("ALL");
  const [tableLoading, setTableLoading] =  useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const { assetIndex,loading } = useAsset();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] =
    useState({
      page: 0,
      pageSize: 50,
    });

    const handleExportExcel = async () => {
      try {
        setTableLoading(true);
        setExportLoading(true);

        const result = await getAssetByRows(filteredIds);

        const exportData = result.map((item) => ({
          "รหัสครุภัณฑ์": item.asset_code,
          "ชื่อครุภัณฑ์": item.asset_name,
          "หน่วยงาน": item.org_owner,
          "ผู้รับผิดชอบ": item.person_name,
          "อาคาร": item.build,
          "ชั้น": item.floor,
          "ห้อง": item.room,
          "สถานะ": item.asset_status,
        }));

        const worksheet =
          XLSX.utils.json_to_sheet(exportData);
          // กำหนดความกว้างคอลัมน์
          worksheet["!cols"] = [
          { wch: 25 }, // รหัสครุภัณฑ์
          { wch: 50 }, // ชื่อครุภัณฑ์
          { wch: 15 }, // หน่วยงาน
          { wch: 30 }, // ผู้รับผิดชอบ
          { wch: 20 }, // อาคาร
          { wch: 10 }, // ชั้น
          { wch: 15 }, // ห้อง
          { wch: 15 }, // สถานะ
          ];

        const workbook =
          XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          "Assets"
        );


        const excelBuffer =
          XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
          });

        const file = new Blob(
          [excelBuffer],
          {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }
        );

        // saveAs(
        //   file,
        //   `Asset_${new Date()
        //     .toISOString()
        //     .slice(0, 10)}.xlsx`
        // );

        const today = new Date();

        const fileName =
          `Asset_${orgOwner}_${status}_${
            today.getFullYear()
          }-${
            String(today.getMonth() + 1)
              .padStart(2, "0")
          }-${
            String(today.getDate())
              .padStart(2, "0")
          }.xlsx`;

        saveAs(file, fileName);

      } catch (error) {
        console.error(
          "Export Excel Error",
          error
        );
      } finally {
        setTableLoading(false);
        setExportLoading(false);
      }
};


const filteredIds = useMemo(() => {

  const keyword =
    search.trim().toLowerCase();

  return assetIndex
    .filter(item => {

      const matchSearch =
        keyword === ""
          ? true
          : item.search_text
              .toLowerCase()
              .includes(keyword);

      const matchStatus =
        status === "ALL"
          ? true
          : item.asset_status === status;

      const matchOrg =
        orgOwner === "ALL"
        ? true
        : item.org_owner === orgOwner;

      return (
        matchSearch &&
        matchStatus &&
        matchOrg
      );

    })
    .map(item => item.row_number);

}, [
  assetIndex,
  search,
  status,
  orgOwner,
]);

/*
const filteredIds = useMemo(() => {

  const keyword =
    search.trim().toLowerCase();

  return assetIndex
    .filter(item => {

      const matchSearch =
        keyword === ""
          ? true
          : item.search_text
              .toLowerCase()
              .includes(keyword);

      const matchStatus =
        status === "ALL"
          ? true
          : item.asset_status === status;

      const matchOrg =
        orgOwner === "ALL"
          ? true
          : item.org_owner === orgOwner;

      return (
        matchSearch &&
        matchStatus &&
        matchOrg
      );

    })
    .map(item => item.row_number);

}, [
  assetIndex,
  search,
  status,
  orgOwner,
]);
*/

const pageRows = useMemo(() => {

  const start =
    paginationModel.page *
    paginationModel.pageSize;

  return filteredIds.slice(
    start,
    start +
    paginationModel.pageSize
  );

}, [
  filteredIds,
  paginationModel,
]);

/*
useEffect(() => {

setPaginationModel(prev => ({
...prev,
page: 0,
}));

}, [search, status]);
*/

// useEffect(() => {
//   setRows([]);
//   setPaginationModel(prev => {
//     console.log("before reset", prev.page);
//     if (prev.page === 0) {
//       return prev;
//     }

//     return {
//       ...prev,
//       page: 0,
//     };

//   });

// }, [search, status]);
// useEffect(() => {
//   setPaginationModel((prev) => ({
//     ...prev,
//     page: 0,
//   }));
// }, [filteredIds.length]);

useEffect(() => {

  loadPageData();

}, [pageRows]);

// const loadPageData =
//   async () => {

//     if (pageRows.length === 0) {

//       setRows([]);
//       return;

//     }

//     const result =
//       await getAssetByRows(
//         pageRows
//       );

//     setRows(result);

// };

const loadPageData = async () => {

  if (pageRows.length === 0) {

    setRows([]);
    return;

  }

  try {

    setTableLoading(true);

    const result =
      await getAssetByRows(
        pageRows
      );

    setRows(result);

  } catch (error) {

    console.error(
      "loadPageData error",
      error
    );

    setRows([]);

  } finally {

    setTableLoading(false);

  }

};

  /*
  const columns = [
    {
      field: "assetNo",
      headerName: "รหัสครุภัณฑ์",
      flex: 1,
    },
    {
      field: "name",
      headerName: "ชื่อครุภัณฑ์",
      flex: 2,
    },
    {
      field: "category",
      headerName: "ประเภท",
      flex: 1,
    },
    {
      field: "center",
      headerName: "หน่วยงาน",
      flex: 1,
    },
    {
      field: "owner",
      headerName: "ผู้รับผิดชอบ",
      flex: 1.5,
    },
    {
      field: "status",
      headerName: "สถานะ",
      flex: 1,
      renderCell: (params) => {
        let color = "default";

        if (params.value === "ตรวจแล้ว")
          color = "success";

        if (params.value === "รอตรวจ")
          color = "warning";

        if (params.value === "ชำรุด")
          color = "error";

        return (
          <Chip
            label={params.value}
            color={color}
            size="small"
            variant="filled"
          />
        );
      },
    },
    {
      field: "verifyDate",
      headerName: "วันที่ตรวจสอบ",
      flex: 1,
    },
    {
      field: "action",
      headerName: "จัดการ",
      sortable: false,
      filterable: false,
      flex: 1,
      renderCell: () => (
        <Box>
          <Tooltip title="ดูรายละเอียด">
            <IconButton color="primary">
              <Visibility />
            </IconButton>
          </Tooltip>

          <Tooltip title="แก้ไขข้อมูล">
            <IconButton color="warning">
              <Edit />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];
  */

  const columns = [
    {
      field: "asset_code",
      headerName: "รหัสครุภัณฑ์",
      flex: 1.5,
    },
    {
      field: "asset_name",
      headerName: "ชื่อครุภัณฑ์",
      flex: 2.5,
    },
    {
      field: "org_owner",
      headerName: "หน่วยงาน",
      flex: 1,
    },
    {
      field: "person_name",
      headerName: "ผู้รับผิดชอบ",
      flex: 1.5,
    },
    {
      field: "build",
      headerName: "อาคาร",
      flex: 1.5,
    },
    {
      field: "floor",
      headerName: "ชั้น",
      flex: 1,
    },
    {
      field: "room",
      headerName: "ห้อง",
      flex: 1,
    },
    {
      field: "asset_status",
      headerName: "สถานะ",
      flex: 1,
    },
  ];

// if (
//   loading ||
//   assetIndex.length === 0
// ) {
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

//       <Typography>
//         กำลังโหลดข้อมูลครุภัณฑ์...
//       </Typography>

//     </Box>
//   );
// }

useEffect(() => {
  if (assetIndex.length > 0) {
    console.log(
      [...new Set(assetIndex.map(x => x.org_owner))]
    );
  }
}, [assetIndex]);

console.log(assetIndex[0]);
console.log(Object.keys(assetIndex[0] || {}));

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 3,
        p: 3,
        borderRadius: 4,
        border: "1px solid #E5E7EB",
        boxShadow:
          "0 2px 12px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight="bold"
          >
            {
              loading
              ? "กำลังโหลดรายการครุภัณฑ์ล่าสุด......"
              : `รายการครุภัณฑ์ล่าสุด`
            }
            
          </Typography>

          <Typography
          variant="body2"
          color="text.secondary"
        >
          {loading
              ? (<> <center><CircularProgress /> </center> </>)
              // ? (<><div>กำลังโหลดข้อมูล..... </div> </>)
              : `จำนวน ${filteredIds.length.toLocaleString()} รายการ`}
        </Typography>
        </Box>

        {/* <Button
          disabled={filteredIds.length === 0}
          variant="contained"
          startIcon={<Download />}
          onClick={handleExportExcel}
        >
          Export Excel ({filteredIds.length})
        </Button> */}
        <Button
          variant="contained"
          onClick={handleExportExcel}
          disabled={exportLoading}
          startIcon={
            exportLoading
              ? (
                  <CircularProgress
                    size={18}
                    color="inherit"
                  />
                )
              : (
                  <Download />
                )
          }
        >
          {exportLoading ? (
            "กำลัง Export..."
            ) : (
            <>Export Excel ({filteredIds.length.toLocaleString()} รายการ) </>
            )}
        </Button>

      </Box>

      {/* Summary Status */}
      {/* <Box
        sx={{
          display: "flex",
          gap: 1,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <Chip
          color="success"
          label="ตรวจแล้ว 10,980"
        />

        <Chip
          color="warning"
          label="รอตรวจ 1,250"
        />

        <Chip
          color="error"
          label="ชำรุด 220"
        />
      </Box> */}

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          pointerEvents: exportLoading
          ? "none"
          : "auto",
          opacity: exportLoading
          ? 0.6
          : 1,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="ค้นหาครุภัณฑ์..."
          value={search}
          // onChange={(e) =>
          //   setSearch(e.target.value)
          // }
          onChange={(e) => {
          setPaginationModel((prev) => ({
            ...prev,
            page: 0,
          }));

          setSearch(e.target.value);
        }}
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          size="small"
          value={orgOwner}
          onChange={(e) => {
            setPaginationModel((prev) => ({
              ...prev,
              page: 0,
            }));

            setOrgOwner(e.target.value);
          }}
          sx={{ width: 180 }}
        >
          <MenuItem value="ALL">
            ทุกศูนย์
          </MenuItem>

          <MenuItem value="สก.">สก.</MenuItem>
          <MenuItem value="ศช.">ศช.</MenuItem>
          <MenuItem value="ศว.">ศว.</MenuItem>
          <MenuItem value="ศล.">ศล.</MenuItem>
          <MenuItem value="ศน.">ศน.</MenuItem>
          <MenuItem value="ศอ.">ศอ.</MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          value={status}
          // onChange={(e) =>
          //   setStatus(e.target.value)
          // }

          onChange={(e) => {
          setPaginationModel((prev) => ({
            ...prev,
            page: 0,
          }));

          setStatus(e.target.value);
          // setOrgOwner(e.target.value);
        }}
          sx={{ width: 180 }}
        >
          <MenuItem value="ALL">
            ทุกสถานะ
          </MenuItem>

          {/* <MenuItem value="ตรวจแล้ว">
            ตรวจแล้ว
          </MenuItem>

          <MenuItem value="รอตรวจ">
            รอตรวจ
          </MenuItem> */}

          <MenuItem value="ใช้งานปกติ">
            ใช้งานปกติ
          </MenuItem>

          <MenuItem value="ชำรุด">
            ชำรุด
          </MenuItem> 

          <MenuItem value="รอจำหน่าย">
            รอจำหน่าย
          </MenuItem> 

          
        </TextField>
      </Box>

      {/* DataGrid */}
      {/* <DataGrid
        rows={filteredRows}
        columns={columns}
        autoHeight
        disableRowSelectionOnClick
        pageSizeOptions={[50, 100, 200]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 50,
            },
          },
        }}
        sx={{
          border: "1px solid #E5E7EB",
          borderRadius: 3,

          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#F8FAFC",
            fontWeight: 700,
            fontSize: 14,
          },

          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#F8FAFC",
          },

          "& .MuiDataGrid-cell": {
            borderBottom:
              "1px solid #F1F5F9",
          },

          "& .MuiDataGrid-footerContainer": {
            borderTop:
              "1px solid #E5E7EB",
          },
        }}
      /> */}

      <DataGrid
        key={`${filteredIds.length}-${search}-${status}`}
        rows={rows}
        columns={columns}
        getRowId={(row) => row.row_number}

        onRowClick={(params) => {
          console.log("params.row", params.row);
        setSelectedAsset(params.row);
        setDrawerOpen(true);
        }}

        rowCount={filteredIds.length}

        paginationMode="server"

        paginationModel={paginationModel}
        onPaginationModelChange={(model) => {
          const maxPage = Math.max(
            0,
            Math.ceil(filteredIds.length / model.pageSize) - 1
          );

          setPaginationModel({
            ...model,
            page: Math.min(model.page, maxPage),
          });
        }}

        pageSizeOptions={[
          10,
          25,
          50,
          100,
          200,
        ]}

        loading={tableLoading || loading}
        // loading={tableLoading}

      />

      <AssetDetailDrawer
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      asset={selectedAsset}
    />
      
    </Paper>
  );
}