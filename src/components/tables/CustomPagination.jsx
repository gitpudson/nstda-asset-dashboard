
import {
  Box,
  Pagination,
} from "@mui/material";

export default function CustomPagination({
  paginationModel,
  setPaginationModel,
  rowCount,
}) {

  const pageCount = Math.ceil(
    rowCount /
    paginationModel.pageSize
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 2,
      }}
    >
      <Pagination
        count={pageCount}
        page={paginationModel.page + 1}
        showFirstButton
        showLastButton
        onChange={(_, page) => {

          setPaginationModel(prev => ({
            ...prev,
            page: page - 1,
          }));

        }}
      />
    </Box>
  );
}