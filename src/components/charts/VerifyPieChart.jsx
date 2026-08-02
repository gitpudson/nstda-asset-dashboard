import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

import {
  Box,
  Typography,
} from "@mui/material";

const data = [
  {
    name: "ตรวจสอบแล้ว",
    value: 10980,
    color: "#22c55e",
  },
  {
    name: "รอตรวจ",
    value: 1250,
    color: "#f59e0b",
  },
  {
    name: "ชำรุด",
    value: 220,
    color: "#ef4444",
  },
];

export default function VerifyPieChart() {
  const verified = 10980;
  const total = 12450;

  const percent = (
    (verified / total) *
    100
  ).toFixed(1);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: 180,
      }}
    >
      {/* Chart */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          height: "100%",
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={75}
              stroke="none"
            >
              {data.map((item) => (
                <Cell
                  key={item.name}
                  fill={item.color}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform:
              "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
          >
            {percent}%
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
          >
            ตรวจสอบแล้ว
          </Typography>
        </Box>
      </Box>

      {/* Legend Right */}
      <Box
        sx={{
          width: 180,
          ml: 2,
        }}
      >
        {data.map((item) => (
          <Box
            key={item.name}
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: item.color,
                }}
              />

              <Typography
                variant="body2"
              >
                {item.name}
              </Typography>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {item.value.toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}