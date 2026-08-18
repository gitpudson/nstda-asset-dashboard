import {
  Avatar,
  Drawer,
  Box,
  Typography,
  Divider,
  Chip,
  IconButton,
  Paper,
  Stack,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

const InfoCard = ({ label, value }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      mb: 2,
      borderRadius: 3,
      background: "#FFF8F3",
      border: "1px solid #FCE7D6",
      transition: "0.2s",
      "&:hover": {
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.06)",
      },
    }}
  >
    <Typography
      variant="caption"
      sx={{
        color: "#D97706",
        fontWeight: 700,
        letterSpacing: 0.3,
      }}
    >
      {label}
    </Typography>

    <Typography
      sx={{
        mt: 1,
        fontSize: 16,
        fontWeight: 500,
        color: "#111827",
        wordBreak: "break-word",
      }}
    >
      {value || "-"}
    </Typography>
  </Paper>
);


export default function AssetDetailDrawer({
  open,
  onClose,
  asset,
}) {

  // console.log("asset", asset);
  // console.log(" asset?.asset_image", asset?.asset_image);
  // console.log("asset_image =", asset?.asset_image);
  // console.log("length =", asset?.asset_image?.length);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{
          width: 550,
          p: 3,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
          >

            {/* <Avatar
              src={asset?.image_person}
              sx={{
                width: 120,
                height: 120,
                bgcolor: "#ff6b00",
                // border: "1px solid #FCE7D6",
                // boxShadow: "0 2px 6px"
              }}
            /> */}

            {/* <Avatar
              src={asset?.image_person}
              imgProps={{
                loading: "eager",
                referrerPolicy: "no-referrer",
              }}
              sx={{
                width: 120,
                height: 120,
                "& img": {
                  objectFit: "cover",
                  imageRendering: "auto"
                },
              }}
            /> */}
            {/* <Box
              component="img"
              {
                console.log(
                "natural",
                e.target.naturalWidth,
                e.target.naturalHeight
              );
              };
            src={asset?.image_person}
            alt=""
            sx={{
              width: 120,
              height: 120,
              // borderRadius: "50%",
              objectFit: "cover",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
            /> */}
            {/* 
            <Box
              component="img"
              src={asset?.image_person}
              alt=""
              onLoad={(e) => {
                console.log(
                  asset?.image_person,
                  e.target.naturalWidth,
                  e.target.naturalHeight
                );

              }}
              sx={{
                width: 120,
                height: 120,
                objectFit: "cover",
              }}
            /> */}
            <Box
              component="img"
              src={asset?.image_person}
              alt=""
              width={120}
              height={120}
              style={{
                borderRadius: "50%",
              }}
            />

            <Box
              sx={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: 12,
                  color: "text.secondary",
                  letterSpacing: 1,
                  fontWeight: 600,
                  mb: 0.5,
                  textTransform: "uppercase",
                }}
              >
                ผู้รับผิดชอบครุภัณฑ์
              </Typography>

              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 500,
                  lineHeight: 1.2,
                  color: "#1F2937",
                  mb: 1.5,
                  wordBreak: "break-word",
                }}
              >
                {asset?.person_name || "-"}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  label={`สังกัด : ${asset?.org_owner || "-"}`}
                  color="warning"
                  sx={{
                    fontWeight: 600,
                  }}
                />

                <Chip
                  label={`รหัสพนักงาน : ${asset?.person_key || "-"}`}
                  color="info"
                  sx={{
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>


          </Box>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* ข้อมูล */}
        <Stack spacing={0}>
          <InfoCard
            label="รหัสครุภัณฑ์"
            value={asset?.asset_code}
          />

          <InfoCard
            label="ชื่อครุภัณฑ์"
            value={asset?.asset_name}
          />
          {/* 
          <InfoCard
            label="หน่วยงาน"
            value={asset?.org_owner}
          /> */}

          {/* <InfoCard
            label="ผู้รับผิดชอบ"
            value={asset?.person_name}
          /> */}

          <InfoCard
            label="อาคาร"
            value={asset?.build}
          />

          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 3,
              background: "#FFF8F3",
              border: "1px solid #FCE7D6",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#D97706",
                fontWeight: 700,
                display: "block",
                mb: 1,
              }}
            >
              ตำแหน่ที่ตั้ง
            </Typography>

            <Typography>
              ชั้น : {asset?.floor || "-"}
            </Typography>

            <Typography>
              ห้อง : {asset?.room || "-"}
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              background: "#FFF8F3",
              border: "1px solid #FCE7D6",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#D97706",
                fontWeight: 700,
                display: "block",
                mb: 1,
              }}
            >
              สถานะ
            </Typography>

            <Chip
              label={asset?.asset_status || "-"}
              color={
                asset?.asset_status === "ชำรุด"
                  ? "error"
                  : "success"
              }
            />

          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              mt: 2,
              borderRadius: 3,
              background: "#FFF8F3",
              border: "1px solid #FCE7D6",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#D97706",
                fontWeight: 700,
                display: "block",
                mb: 1,
              }}
            >
              รูปภาพครุภัณฑ์
            </Typography>

            {/* <img
  // src="https://lh3.googleusercontent.com/d/1jsk3Tc2-zLhD3rAIkGPtGciNNF2ZBuR_=w1000"
  src={asset.asset_image}
  alt="test"
  style={{
    width: "100%",
    maxHeight: "350px",
    objectFit: "contain",
  }}
  onLoad={() => console.log("OK")}
  onError={() => console.log("ERROR",asset)}
/> */}

            {/* {asset?.asset_image ? (
    <Box
      component="img"
      src={asset.asset_image}
      alt={asset?.asset_name}
      sx={{
        width: "100%",
        maxHeight: 350,
        objectFit: "contain",
        borderRadius: 2,
        border: "1px solid #ddd",
      }}
    />
  ) : (
    <Typography color="text.secondary">
      ไม่มีรูปภาพครุภัณฑ์
    </Typography>
  )} */}
            {/* <img
  src="https://drive.google.com/thumbnail?id=1jsk3Tc2-zLhD3rAIkGPtGciNNF2ZBuR_&sz=w400-h300"
  alt="asset"
  style={{
    width: "100%",
    maxHeight: "350px",
    objectFit: "contain",
  }}
/> */}

            {/* <img src="https://drive.google.com/thumbnail?id=0B6wwyazyzml-OGQ3VUo0Z2thdmc&sz=w1000" alt="asset" style={{
  width: "100%",
  maxHeight: "350px",
  objectFit: "contain",
  marginTop: "10px"
}} /> */}

            {/* {asset?.asset_image && asset.asset_image.length > 0 ? (

              <img src={asset?.asset_image} 
                alt="ไม่สามารถโหลดรูปภาพได้" 
                style={{
                width: "100%",
                height: "auto",
                display: "block",
                marginTop: "10px",
                borderRadius: "8px"
              }} />
            ) : (
              <Typography color="text.secondary">
                ไม่มีรูปภาพครุภัณฑ์
              </Typography>
            )} */}

            {asset?.asset_image?.trim() ? (

              <img
                src={asset.asset_image}
                alt={asset?.asset_name || "Asset Image"}
                style={{
                  width: "100%",
                  height: "auto",
                  // maxHeight: "350px",
                  objectFit: "contain",
                  display: "block",
                  marginTop: "10px",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />

            ) : (
              <Typography color="text.secondary">
                ไม่มีรูปภาพครุภัณฑ์
              </Typography>
            )}



            {/* <img
  src="https://lh3.googleusercontent.com/d/1jsk3Tc2-zLhD3rAIkGPtGciNNF2ZBuR_=w1000"
  alt="test"
/> */}

          </Paper>


        </Stack>
      </Box>

    </Drawer>
  );
}