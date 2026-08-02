import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

export default function CenterCard({
  title,
  total,
  logo,
  active = false,
}) {

  console.log("CenterCard logo =", logo);
  return (
    <Card
      sx={{
        width: 120,
        height: 140,
        flexShrink: 0,

        borderRadius: 3,

        border: active
          ? "2px solid #2196F3"
          : "1px solid #E5E7EB",

        boxShadow:
          "0 2px 8px rgba(0,0,0,.05)",

        transition: ".3s",

        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            "0 4px 12px rgba(0,0,0,.08)",
        },
      }}
    >
      <CardContent
        sx={{
          textAlign: "center",
          p: 1.5,
        }}
      >
        <img
          src={logo}
          alt={title}
          style={{
            height: 28,
            objectFit: "contain",
            marginBottom: 12,
          }}
        />

        {/* <Typography
          fontWeight={700}
          gutterBottom
        >
          {title}
        </Typography> */}

        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mt: 0.5 }}
        >
          {total.toLocaleString()}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          รายการ
        </Typography>
      </CardContent>
    </Card>
  );
}