import { useMemo, useState, useEffect, useRef } from "react";
import { getAssetByRows, exportAssetExcel } from "../../services/assetService";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
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

export default function AssetTable({
  org = "",
}) {
  const requestRef = useRef(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [orgOwner, setOrgOwner] = useState("ALL");
  const [tableLoading, setTableLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const { assetIndex, loading } = useAsset();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] =
    useState({
      page: 0,
      pageSize: 50,
    });

  const handleExportExcel1 = async () => {
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
        `Asset_${orgOwner}_${status}_${today.getFullYear()
        }-${String(today.getMonth() + 1)
          .padStart(2, "0")
        }-${String(today.getDate())
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

  const handleExportExcel = async () => {

    try {

      setTableLoading(true);
      setExportLoading(true);

      const result =
        await exportAssetExcel(
          filteredIds
        );

      console.log(result);
      console.log(
        JSON.stringify(
          result.debug,
          null,
          2
        )
      );


      if (
        result?.downloadUrl
      ) {

        // window.open(
        //   result.downloadUrl,
        //   "_blank"
        // );

        window.location.href = result.downloadUrl;

      }

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


  const ORG_MAP = {
    NSTDA: "สก.",
    NECTEC: "ศอ.",
    MTEC: "ศว.",
    BIOTEC: "ศช.",
    NANOTEC: "ศน.",
    ENTEC: "ศล.",
  };

  // const filteredIds = useMemo(() => {

  //   const keyword = search.trim().toLowerCase();

  //   const keywordParts = keyword.split(/\s+/);
  //   const matchSearch =
  //     keyword === ""
  //       ? true
  //       : keywordParts.every(part =>
  //         item.search_text
  //           .toLowerCase()
  //           .includes(part)
  //       );

  //   return assetIndex
  //     .filter(item => {
  //       const matchSidebarOrg =
  //         !org
  //           ? true
  //           : item.org_owner === ORG_MAP[org];

  //       const matchSearch =
  //         keyword === ""
  //           ? true
  //           : item.search_text
  //             .toLowerCase()
  //             .includes(keyword);

  //       if (
  //         keyword &&
  //         matchSearch
  //       ) {
  //         console.log(
  //           "MATCH",
  //           item.row_number,
  //           item.search_text
  //         );
  //       }

  //       const matchStatus =
  //         status === "ALL"
  //           ? true
  //           : item.asset_status === status;

  //       const matchOrg =
  //         orgOwner === "ALL"
  //           ? true
  //           : item.org_owner === orgOwner;

  //       return (
  //         matchSearch &&
  //         matchStatus &&
  //         matchOrg &&
  //         matchSidebarOrg
  //       );

  //     })
  //     .map(item => item.row_number);

  // }, [
  //   assetIndex,
  //   search,
  //   status,
  //   orgOwner,
  //   org
  // ]);

  const filteredIds = useMemo(() => {

    const keyword =
      search.trim().toLowerCase();

    const keywordParts =
      keyword.split(/\s+/);

    console.log(
      "assetIndex sample",
      assetIndex[0]
    );

    return assetIndex
      .filter(item => {

        const matchSidebarOrg =
          !org
            ? true
            : item.org_owner === ORG_MAP[org];

        const matchSearch =
          keyword === ""
            ? true
            : keywordParts.every(part =>
              item.search_text
                .toLowerCase()
                .includes(part)
            );

        // const matchStatus =
        //   status === "ALL"
        //     ? true
        //     : item.asset_status === status;
        const currentYear = new Date().getFullYear();
        // const matchStatus =
        //   status === "ALL"
        //     ? true
        //     : status === "CHECKED"
        //       ? (
        //         item.updated_at &&
        //         new Date(
        //           item.updated_at
        //         ).getFullYear() ===
        //         currentYear
        //       )
        //       : item.asset_status === status;
        const matchStatus =
          status === "ALL"
            ? true
            : status === "CHECKED"
              ? (
                item.updated_at &&
                new Date(item.updated_at)
                  .getFullYear() ===
                currentYear
              )
              : status === "UNCHECKED"
                ? !item.updated_at
                : item.asset_status === status;

        const matchOrg =
          orgOwner === "ALL"
            ? true
            : item.org_owner === orgOwner;

        return (
          matchSearch &&
          matchStatus &&
          matchOrg &&
          matchSidebarOrg
        );

      })
      .map(item => item.row_number);

  }, [
    assetIndex,
    search,
    status,
    orgOwner,
    org,
  ]);

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

  // useEffect(() => {
  //   setRows([]);
  //   setTableLoading(true);
  //   loadPageData();

  //   // }, [org, pageRows]);
  // }, [
  //   org,
  //   paginationModel.page,
  //   paginationModel.pageSize,
  //   filteredIds.length,
  // ]);

  useEffect(() => {

    if (
      pageRows.length >= 0
    ) {
      loadPageData();
    }

  }, [
    org,
    pageRows.join(",")
  ]);

  useEffect(() => {

    setPaginationModel(prev => ({
      ...prev,
      page: 0,
    }));

    setSearch("");
    setStatus("ALL");

  }, [org]);

  // useEffect(() => {

  //   const timer =
  //     setTimeout(() => {

  //       setSearchKeyword(
  //         search
  //       );

  //     }, 500);

  //   return () =>
  //     clearTimeout(timer);

  // }, [search]);

  // const loadPageData = async () => {

  //   if (pageRows.length === 0) {

  //     setRows([]);
  //     setTableLoading(false);
  //     return;

  //   }

  //   try {

  //     setTableLoading(true);

  //     const result =
  //       await getAssetByRows(
  //         pageRows
  //       );

  //     setRows(result);

  //   } catch (error) {

  //     console.error(
  //       "loadPageData error",
  //       error
  //     );

  //     setRows([]);

  //   } finally {

  //     setTableLoading(false);

  //   }

  // };

  //   const loadPageData = async () => {

  //   if (pageRows.length === 0) {

  //     setRows([]);
  //     setTableLoading(false);

  //     return;

  //   }

  //   try {

  //     setTableLoading(true);

  //     const result =
  //       await getAssetByRows(pageRows);

  //     setRows(result);

  //   } catch (error) {

  //     console.error(
  //       "loadPageData error",
  //       error
  //     );

  //     setRows([]);

  //   } finally {

  //     setTableLoading(false);

  //   }

  // };

  // const loadPageData = async () => {

  //   console.log(
  //     "filteredIds",
  //     filteredIds.length
  //   );

  //   console.log(
  //     "pageRows",
  //     pageRows
  //   );

  //   if (pageRows.length === 0) {

  //     setRows([]);
  //     setTableLoading(false);

  //     return;

  //   }

  //   try {

  //     setTableLoading(true);

  //     // console.time("getAssetByRows");

  //     console.log(
  //       "pageRows before api",
  //       pageRows
  //     );

  //     const result =
  //       await getAssetByRows(pageRows);

  //     // console.timeEnd("getAssetByRows");
  //     console.log(
  //       "result rows",
  //       result.length
  //     );

  //     setRows(result);

  //   } catch (error) {

  //     // console.error(
  //     //   "loadPageData error",
  //     //   error
  //     // );

  //     setRows([]);

  //   } finally {

  //     setTableLoading(false);

  //   }

  // };

  const loadPageData = async () => {

    const requestId =
      ++requestRef.current;

    if (
      pageRows.length === 0
    ) {

      setRows([]);
      setTableLoading(false);

      return;

    }

    try {

      setTableLoading(true);

      const result =
        await getAssetByRows(
          pageRows
        );

      if (
        requestId !==
        requestRef.current
      ) {
        return;
      }

      setRows(result);

    } catch (error) {

      console.error(error);

      if (
        requestId ===
        requestRef.current
      ) {
        setRows([]);
      }

    } finally {

      if (
        requestId ===
        requestRef.current
      ) {
        setTableLoading(false);
      }

    }

  };


  useEffect(() => {

    setPaginationModel(prev => ({
      ...prev,
      page: 0,
    }));

  }, [org]);

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
    // {
    //   field: "asset_status",
    //   headerName: "สถานะ",
    //   flex: 1,
    // },
    {
      field: "asset_status",
      headerName: "สถานะ",
      flex: 1,
      align: "center",
      headerAlign: "center",

      renderCell: (params) => {

        const status =
          params.value;

        let bgColor =
          "#F3F4F6";

        let textColor =
          "#6B7280";

        if (
          status === "ใช้งานปกติ"
        ) {

          bgColor =
            "#EEF4FF";

          textColor =
            "#1565C0";

        }

        else if (
          status === "รอจำหน่าย"
        ) {

          bgColor =
            "#FFF3E0";

          textColor =
            "#EF6C00";

        }

        else if (
          status === "ชำรุด" ||
          status === "เสียหาย"
        ) {

          bgColor =
            "#FFEBEE";

          textColor =
            "#C62828";

        }

        return (
          <Chip
            label={status}
            size="small"
            sx={{
              backgroundColor:
                bgColor,
              color:
                textColor,
              border:
                `1px solid ${textColor}`,
              fontWeight: 600,
            }}
          />
        );

      },
    },
    // {
    //   field: "asset_status",
    //   headerName: "สถานะ",
    //   flex: 1.2,
    //   align: "center",
    //   headerAlign: "center",

    //   renderCell: (params) => {

    //     const status =
    //       params.row.asset_status;

    //     const updatedAt =
    //       params.row.updated_at;

    //     const currentYear =
    //       new Date().getFullYear();

    //     const isChecked =
    //       updatedAt &&
    //       new Date(updatedAt)
    //         .getFullYear() === currentYear;

    //     let bgColor =
    //       "#F3F4F6";

    //     let textColor =
    //       "#6B7280";

    //     let label =
    //       status;

    //     // ตรวจสอบแล้ว + ใช้งานปกติ
    //     if (
    //       isChecked &&
    //       status === "ใช้งานปกติ"
    //     ) {

    //       bgColor =
    //         "#E8F5E9";

    //       textColor =
    //         "#2E7D32";

    //       label =
    //         "ตรวจสอบแล้ว";

    //     }

    //     // รอจำหน่าย
    //     else if (
    //       status === "รอจำหน่าย"
    //     ) {

    //       bgColor =
    //         "#FFF3E0";

    //       textColor =
    //         "#EF6C00";

    //     }

    //     // ชำรุด / เสียหาย
    //     else if (
    //       status === "ชำรุด" ||
    //       status === "เสียหาย"
    //     ) {

    //       bgColor =
    //         "#FFEBEE";

    //       textColor =
    //         "#C62828";

    //       label =
    //         "ชำรุด / เสียหาย";

    //     }

    //     return (
    //       <Chip
    //         label={label}
    //         size="small"
    //         sx={{
    //           backgroundColor:
    //             bgColor,

    //           color:
    //             textColor,

    //           fontWeight: 600,

    //           border:
    //             `1px solid ${textColor}`,
    //         }}
    //       />
    //     );

    //   },
    // },
    // {
    //   field: "verify_status",
    //   headerName: "สถานะการตรวจสอบ",
    //   flex: 1.2,
    //   align: "center",
    //   headerAlign: "center",

    //   renderCell: (params) => {

    //     // const currentYear =
    //     //   new Date().getFullYear();

    //     // const isChecked =
    //     //   params.row.updated_at &&
    //     //   new Date(
    //     //     params.row.updated_at
    //     //   ).getFullYear() === currentYear;
    //     const isChecked =
    //       !!params.row.updated_at;

    //     console.log("*****params.row*****",
    //       params.row
    //     );

    //     console.log(
    //       "****asset******",
    //       params.row.asset_code,
    //       "updated_at",
    //       params.row.updated_at,
    //       "date",
    //       new Date(params.row.updated_at),
    //       "year",
    //       new Date(params.row.updated_at).getFullYear()
    //     );

    //     return (
    //       <Chip
    //         label={
    //           isChecked
    //             ? "ตรวจสอบแล้ว"
    //             : "ยังไม่ตรวจ"
    //         }
    //         size="small"
    //         sx={{
    //           backgroundColor:
    //             isChecked
    //               ? "#E8F5E9"
    //               : "#F3F4F6",

    //           color:
    //             isChecked
    //               ? "#2E7D32"
    //               : "#6B7280",

    //           border:
    //             isChecked
    //               ? "1px solid #2E7D32"
    //               : "1px solid #9CA3AF",

    //           fontWeight: 600,
    //         }}
    //       />
    //     );

    //   },
    // },
    {
      field: "verify_status",
      headerName: "สถานะการตรวจสอบ",
      flex: 1.2,
      align: "center",
      headerAlign: "center",

      valueGetter: (_, row) =>
        row.updated_at
          ? "ตรวจสอบแล้ว"
          : "ยังไม่ตรวจ",

      renderCell: (params) => {

        const isChecked =
          params.value === "ตรวจสอบแล้ว";

        return (
          <Chip
            label={params.value}
            size="small"
            sx={{
              backgroundColor:
                isChecked
                  ? "#1e9b05"
                  : "#F3F4F6",

              color:
                isChecked
                  ? "#f4f8f4"
                  : "#6B7280",

              border:
                isChecked
                  ? "1px solid #2E7D32"
                  : "1px solid #9CA3AF",

              fontWeight: 600,
            }}
          />
        );

      },
    },
    // {
    //   field: "verify_status",
    //   headerName: "สถานะการตรวจสอบ",
    //   flex: 1.2,
    //   align: "center",
    //   headerAlign: "center",

    //   renderCell: (params) => {

    //     const isChecked =
    //       !!params.row.updated_at;

    //     return (
    //       <Chip
    //         label={
    //           isChecked
    //             ? "ตรวจสอบแล้ว"
    //             : "ยังไม่ตรวจ"
    //         }
    //         size="small"
    //         sx={{
    //           backgroundColor:
    //             isChecked
    //               ? "#E8F5E9"
    //               : "#F3F4F6",

    //           color:
    //             isChecked
    //               ? "#2E7D32"
    //               : "#6B7280",

    //           border:
    //             isChecked
    //               ? "1px solid #2E7D32"
    //               : "1px solid #9CA3AF",

    //           fontWeight: 600,
    //         }}
    //       />
    //     );

    //   },
    // },
    {
      field: "updated_at",
      headerName: "อัปเดตสถานะ",
      width: 180,
      align: "center",
      headerAlign: "center",
    }

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
      // console.log(
      //   [...new Set(assetIndex.map(x => x.org_owner))]
      // );
    }
  }, [assetIndex]);

  // console.log(assetIndex[0]);
  // console.log(Object.keys(assetIndex[0] || {}));
  // console.log(
  //   "assetIndex",
  //   assetIndex.length,
  //   "loading",
  //   loading
  // );



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
            {(tableLoading || loading)
              ? (<> <center>กำลังโหลดข้อมูล.......<CircularProgress /> </center> </>)
              // ? (<><div>กำลังโหลดข้อมูล..... </div> </>)
              : `จำนวน ${filteredIds.length.toLocaleString()} รายการ`}
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleExportExcel}
          disabled={exportLoading || tableLoading}
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
            <>
              {tableLoading
                ? "กำลังโหลด..."
                : `Export Excel (${filteredIds.length.toLocaleString()} รายการ)`}
            </>
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
          // disabled={tableLoading}
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

        {/* <TextField
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
        </TextField> */}

        <TextField
          select
          size="small"
          value={status}
          // disabled={tableLoading}
          onChange={(e) => {
            setPaginationModel((prev) => ({
              ...prev,
              page: 0,
            }));

            setStatus(e.target.value);
          }}
          sx={{ width: 180 }}
        >
          <MenuItem value="ALL">
            ทุกสถานะ
          </MenuItem>

          <MenuItem value="CHECKED">
            ตรวจสอบแล้ว
          </MenuItem>

          <MenuItem value="UNCHECKED">
            ยังไม่ตรวจ
          </MenuItem>

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