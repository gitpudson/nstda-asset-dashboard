import {
  Paper,
  Box,
  Typography,
} from "@mui/material";

export default function SummaryCard({
  icon,
  title,
  value,
  subtitle,
  bgColor,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid #E5E7EB",
        boxShadow:
          "0 2px 12px rgba(0,0,0,0.05)",
        height: 135,

        "&:hover": {
          boxShadow:
            "0 8px 30px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          height: "100%",
        }}
      >
        {/* Icon Circle */}
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: bgColor,

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            color: "#fff",
          }}
        >
          {icon}
        </Box>

        {/* Content */}
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {title}
          </Typography>

          <Typography
            variant="h4"
            fontWeight="bold"
          >
            {value}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}