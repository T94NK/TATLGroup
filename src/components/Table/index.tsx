import { Fragment, useLayoutEffect, useRef, useState } from 'react';
import {
  Box,
  Paper,
  Skeleton,
  Table as MuiTable,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer
} from '@mui/material';
import { Cell, ColumnDef, flexRender, getCoreRowModel, Row, useReactTable } from '@tanstack/react-table';
import { isEqual } from 'lodash';
import { memo, useMemo } from 'react';
import { StyledBox, StyledTableCell, StyledTableRow } from './styled';
import { TableItem } from '../../common/interfaces/common.interfaces';

interface TableProps {
  data: TableItem[];
  columns: Array<ColumnDef<TableItem>>;
  isFetching?: boolean;
  errorMsg?: string;
  skeletonCount?: number;
  skeletonHeight?: number;
  headerComponent?: JSX.Element;
  onClickRow?: (cell: Cell<TableItem, unknown>, row: Row<TableItem>) => void;
}

const TableComponent = ({
  data,
  columns,
  isFetching,
  errorMsg,
  skeletonCount = 10,
  skeletonHeight = 28,
  headerComponent,
  onClickRow
}: TableProps): JSX.Element => {
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const headerComponentRef = useRef<HTMLDivElement>(null);
  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoisedHeaderComponent = useMemo(() => headerComponent, [headerComponent]);

  const { getHeaderGroups, getRowModel, getAllColumns } = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel()
  });

  const skeletons = Array.from({ length: skeletonCount }, (_, idx) => idx);
  const columnCount = getAllColumns().length;
  const noDataFound = !errorMsg && !isFetching && (!memoizedData || memoizedData.length === 0);

  useLayoutEffect(() => {
    if (!headerComponentRef?.current) return;
    setHeaderHeight(headerComponentRef?.current?.getBoundingClientRect().height);
  }, [headerComponentRef]);

  if (errorMsg) {
    return (
      <StyledBox my={2} textAlign='center' color='red'>
        {`${errorMsg}`}
      </StyledBox>
    );
  }

  // Вибрав варіант зі скролом з огляду на ux, в даній таблиці кількість учнів не буде перевищувати 30-40 штук, тому користувачу  буде зручніше взаємодіяти з таблицею скролом, ніж пагінацією.
  // В іншому випадку, я б реалізовував пагінацію, або virtual scroll для великих списків.
  // Також було реалізовано відображення id та імені учня при горизонтальному скролі (sticky cell)

  return (
    <Paper sx={{ width: '100%', height: '100%', maxHeight: '100%', overflow: 'hidden' }}>
      {noDataFound ? (
        <StyledBox my={2} textAlign='center'>
          Журнал пустий, додайте дані
        </StyledBox>
      ) : (
        <Fragment>
          <Box ref={headerComponentRef} paddingX='1rem'>
            {memoisedHeaderComponent && <Box>{memoisedHeaderComponent}</Box>}
          </Box>
          <TableContainer
            sx={{ maxWidth: '100%', height: `calc(100% - ${headerHeight}px)`, overflow: 'auto' }}
          >
            <MuiTable stickyHeader>
              {!isFetching && (
                <TableHead>
                  {getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableCell key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
              )}
              <TableBody>
                {!isFetching ? (
                  getRowModel().rows.map((row) => (
                    <StyledTableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <StyledTableCell onClick={() => onClickRow?.(cell, row)} key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  ))
                ) : (
                  <Fragment>
                    {skeletons.map((skeleton) => (
                      <TableRow key={skeleton}>
                        {Array.from({ length: columnCount }, (_, idx) => idx).map((elm) => (
                          <TableCell key={elm}>
                            <Skeleton height={skeletonHeight} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </Fragment>
                )}
              </TableBody>
            </MuiTable>
          </TableContainer>
        </Fragment>
      )}
    </Paper>
  );
};

export const Table = memo(TableComponent, (prevProps, nextProps) => isEqual(prevProps, nextProps));
