import { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { Table } from '../../components/Table';
import { Cell, ColumnDef, Row, createColumnHelper } from '@tanstack/react-table';
import {
  useGetColumnsQuery,
  useGetRateQuery,
  useGetSchoolboysQuery,
  useUpdateRateMutation
} from '../../api/timetableApi';
import { RateItem, TableItem } from '../../common/interfaces/common.interfaces';
import { SnackBarContext } from '../../components/Snackbar/Snackbar';
import { isErrorWithMessage, isFetchBaseQueryError } from '../../services/helpers';

const Header = (
  <Box display='flex' justifyContent='center'>
    <Typography variant='h4' alignItems='center'>
      Журнал учнів
    </Typography>
  </Box>
);

const columnHelper = createColumnHelper<TableItem>();

export const SchoolTimetable = () => {
  const { data: schoolboys, isLoading: schoolBoysLoading, error: schoolBoysError } = useGetSchoolboysQuery();
  const { data: columns, isLoading: columnsLoading, error: columnsError } = useGetColumnsQuery();
  const { data: rate, isLoading: rateLoading, error: rateError } = useGetRateQuery();
  const [updateRate] = useUpdateRateMutation();
  const { setNotify } = useContext(SnackBarContext);

  const onClickRow = async (cell: Cell<TableItem, unknown>, row: Row<TableItem>) => {
    if (cell?.id.includes('schoolBoyId') || cell?.id.includes('schoolboyName')) return;
    const value = cell.getValue();
    updateRate({
      url: value ? 'UnRate' : 'Rate',
      body: {
        SchoolboyId: Number(row.original.schoolboyId),
        ColumnId: Number(cell.column.id),
        ...(!value && {
          Title: 'H'
        })
      }
    })
      .unwrap()
      .then(() => {
        setNotify({
          isOpen: true,
          message: 'Оцінка успішно змінена',
          severity: 'success'
        });
      })
      .catch(() => {
        setNotify({
          isOpen: true,
          message: 'Помилка при зміні оцінки',
          severity: 'error'
        });
      });
  };

  const tableRows: TableItem[] =
    useMemo(() => {
      return (schoolboys?.Items || []).map((item) => {
        return {
          schoolboyId: item?.Id.toString() || '',
          schoolboyName: `${item?.LastName || ''} ${item?.FirstName || ''} ${item?.SecondName || ''}`,
          ...(columns?.Items || []).reduce((acc, column) => {
            return {
              ...acc,
              [column.Id?.toString() || '']:
                (rate?.Items || []).find(
                  (rate: RateItem) => rate.SchoolboyId === item.Id && rate.ColumnId === column.Id
                )?.Title || ''
            };
          }, {})
        } as TableItem;
      });
    }, [schoolboys, columns, rate]) || [];

  const tableColumns: Array<ColumnDef<TableItem>> = useMemo(() => {
    return [
      columnHelper.accessor('schoolboyId', {
        header: () => '№',
        cell: (cell) => cell.getValue()
      }),
      columnHelper.accessor('schoolboyName', {
        header: () => 'Учень',
        cell: (cell) => cell.getValue()
      }),
      ...(columns?.Items || []).map((column) =>
        columnHelper.accessor(column.Id?.toString(), {
          header: () => column.Title,
          cell: (cell) => cell.getValue()
        })
      )
    ] as Array<ColumnDef<TableItem>>;
  }, [columns]);

  const isError = useMemo(() => {
    return [schoolBoysError, columnsError, rateError].find((error) => error !== undefined);
  }, [columnsError, rateError, schoolBoysError]);

  const errorMsg = useMemo(() => {
    if (isFetchBaseQueryError(isError)) {
      const errStatusCode = 'originalStatus' in isError ? isError.originalStatus : isError.status;
      const errMsg = 'data' in isError ? isError.data : JSON.stringify(isError.data);
      return `${errStatusCode} ${errMsg}`;
    } else if (isErrorWithMessage(isError)) {
      return isError.message;
    }
  }, [isError]);

  const dataLoading = useMemo(() => {
    return schoolBoysLoading || columnsLoading || rateLoading;
  }, [columnsLoading, rateLoading, schoolBoysLoading]);

  return (
    <Box padding={6} width='100%' height='100vh'>
      <Table
        data={tableRows}
        columns={tableColumns}
        isFetching={dataLoading}
        errorMsg={errorMsg}
        headerComponent={Header}
        onClickRow={onClickRow}
      />
    </Box>
  );
};
