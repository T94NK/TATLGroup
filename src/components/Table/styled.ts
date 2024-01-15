import { styled, TableRow, TableCell, Box } from "@mui/material";

export const StyledTableRow = styled(TableRow)`
  background-color: #fff;
  &:nth-of-type(odd) {
    background-color: #f1f1f1;
  }
  &:last-child th {
    border: 0;
  }
  td:first-of-type {
    width: 80px;
    min-width: 80px;
    max-width: 80px;
    position: sticky;
    left: 0;
    background-color: inherit;
    cursor: default;
    pointer-events: none;
  }

  td:nth-of-type(2) {
    position: sticky;
    left: 80px;
    background-color: inherit;
    cursor: default;
    pointer-events: none;
  }
  td:hover {
    background-color: #e6e6e6;

  }
`;

export const StyledTableCell = styled(TableCell)`
  cursor: pointer;
`;

export const StyledBox = styled(Box)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`