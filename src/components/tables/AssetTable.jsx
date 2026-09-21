import { useMemo, useState, useEffect, useRef } from "react";
import { getAssetByRows, exportAssetExcel } from "../../services/assetService";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import AssetDetailDrawer from "../../pages/Assets/AssetDetailDrawer";
import CustomPagination from "./CustomPagination";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";

dayjs.extend(customParseFormat);
dayjs.extend(buddhistEra);
dayjs.locale("th");

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
  Pagination,
  PaginationItem
} from "@mui/material";

import {
  GridPagination
} from "@mui/x-data-grid";

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

  const { assetIndex, loading, searchIndexLoading, reloadSearchIndex } = useAsset();

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

      if (
        result?.downloadUrl
      ) {

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

  const filteredIds = useMemo(() => {

    const keyword =
      search.trim().toLowerCase();

    const keywordParts =
      keyword.split(/\s+/);

    const currentYear =
      new Date().getFullYear();


    return assetIndex
      .filter(item => {

        const matchSidebarOrg =
          !org
            ? true
            : item.org_owner === ORG_MAP[org];

        const isPersonCode =
          /^\d{6}$/.test(keyword);

        const matchSearch =
          keyword === ""
            ? true
            : isPersonCode
              ? (
                String(item.person_key)
                  .padStart(6, "0") === keyword
              )
              : keywordParts.every(part =>
                item.search_text
                  .toLowerCase()
                  .includes(part)
              );


        const matchStatus =
          status === "ALL"
            ? true
            : status === "CHECKED"
              ? (
                item.updated_at &&
                String(item.updated_at).trim() !== ""
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
    {
      field: "updated_at",
      headerName: "อัปเดตสถานะ",
      width: 180,
      align: "center",
      headerAlign: "center",
      valueFormatter: (value) => {

        if (!value) return "-";

        return dayjs(
          value,
          "DD-MM-YYYY HH:mm:ss"
        ).format(
          "DD/MM/BBBB HH:mm:ss"
        );

      },
    }

  ];

  useEffect(() => {

    if (
      assetIndex.length === 0
    ) {

      reloadSearchIndex();

    }

  }, [org]);

  if (
    searchIndexLoading &&
    assetIndex.length === 0
  ) {
    return (
      <Box
        sx={{
          py: 4,
          textAlign: "center",
        }}
      >
        <CircularProgress />

        <Typography variant="h5" color="text.secondary"
          sx={{ mt: 2 }}
        >
          กำลังเตรียมข้อมูลครุภัณฑ์
        </Typography>
        <Typography variant="h6" color="text.secondary"
          sx={{ mt: 2 }}
        >
          โหลดครั้งแรกอาจใช้เวลาสักครู่.....
        </Typography>

      </Box>

    );
  }


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
            align="center"
          >
            {(tableLoading || loading)
              ? (<> กำลังโหลดข้อมูล.......<CircularProgress /> </>)
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
        {/* <TextField
          fullWidth
          size="small"
          placeholder="ค้นหาครุภัณฑ์..."
          value={search}
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
        /> */}
        <TextField
          fullWidth
          size="small"
          placeholder="ค้นหาครุภัณฑ์..."
          value={search}
          onChange={(e) => {
            setPaginationModel((prev) => ({
              ...prev,
              page: 0,
            }));

            setSearch(e.target.value);
          }}
          sx={{ flex: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          select
          size="small"
          value={status}
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

      <DataGrid
        key={`${filteredIds.length}-${search}-${status}`}
        rows={rows}
        columns={columns}
        getRowId={(row) => row.row_number}

        onRowClick={(params) => {
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
        ]}

        loading={tableLoading || loading}
        slots={{
          pagination: () => null
        }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          mt: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          select
          size="small"
          value={paginationModel.pageSize}
          onChange={(e) => {
            setPaginationModel({
              page: 0,
              pageSize: Number(e.target.value),
            });
          }}
          sx={{
            width: 140,
          }}
        >
          <MenuItem value={10}>10 รายการ</MenuItem>
          <MenuItem value={25}>25 รายการ</MenuItem>
          <MenuItem value={50}>50 รายการ</MenuItem>
          <MenuItem value={100}>100 รายการ</MenuItem>
        </TextField>

        <Pagination
          count={Math.ceil(
            filteredIds.length /
            paginationModel.pageSize
          )}
          page={paginationModel.page + 1}
          showFirstButton
          showLastButton
          onChange={(_, page) => {
            setPaginationModel((prev) => ({
              ...prev,
              page: page - 1,
            }));
          }}
        />
      </Box>



      <AssetDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        asset={selectedAsset}
      />

    </Paper>
  );


}