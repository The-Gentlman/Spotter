import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Box, Paper } from "@mui/material";

interface DataTableProps {
    rows: unknown[];
    columns: GridColDef[];
    loading?: boolean;
    pageSize?: number;
}

const DataTable: React.FC<DataTableProps> = ({
    rows,
    columns,
    loading = false,
    pageSize = 25,
}) => {
    return (
        <Paper
            elevation={1}
            sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "background.paper",
            }}
        >
            <Box
                sx={{
                    height: 500,
                    width: "100%",
                    "& .MuiDataGrid-columnHeaders": {
                        bgcolor: "grey.100",
                        fontWeight: "bold",
                        fontSize: 14,
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                        fontWeight: "bold",
                    },
                    "& .MuiDataGrid-row:hover": {
                        bgcolor: "action.hover",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    },
                }}
            >
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5, 10, 20, 50]}
                    initialState={{
                        pagination: { paginationModel: { pageSize } },
                    }}
                    loading={loading}
                    disableRowSelectionOnClick
                />
            </Box>
        </Paper>
    );
};

export default DataTable;
