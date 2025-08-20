import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";

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
    pageSize = 10,
}) => {
    return (
        <Box sx={{ height: 500, width: "100%" }}>
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
    );
};

export default DataTable;
