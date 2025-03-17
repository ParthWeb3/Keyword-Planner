import React, { useState } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import Tooltip from '@mui/material/Tooltip'; // Add Material-UI Tooltip for interactivity

const KeywordSuggestionsTable = ({ data }) => {
  const [filterInput, setFilterInput] = useState('');

  const columns = React.useMemo(
    () => [
      {
        Header: 'Keyword',
        accessor: 'keyword',
        Filter: ({ column: { filterValue, setFilter } }) => (
          <input
            value={filterValue || ''}
            onChange={(e) => setFilter(e.target.value || undefined)}
            placeholder="Search keyword"
          />
        ),
      },
      {
        Header: 'Search Volume',
        accessor: 'searchVolume',
        Cell: ({ value }) => (
          <Tooltip title="Monthly search volume" arrow>
            <span>{value.toLocaleString()}</span>
          </Tooltip>
        ),
      },
      {
        Header: 'CPC',
        accessor: 'cpc',
        Cell: ({ value }) => (
          <Tooltip title="Cost per click (in USD)" arrow>
            <span>${value.toFixed(2)}</span>
          </Tooltip>
        ),
      },
      {
        Header: 'Competition',
        accessor: 'competition',
        Cell: ({ value }) => (
          <Tooltip title="Competition level" arrow>
            <span>{value}</span>
          </Tooltip>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useSortBy
  );

  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setFilter('keyword', value);
    setFilterInput(value);
  };

  return (
    <div>
      <input
        value={filterInput}
        onChange={handleFilterChange}
        placeholder="Filter by keyword"
        style={{ marginBottom: '10px', padding: '5px' }}
      />
      <table {...getTableProps()} style={{ border: 'solid 1px gray', width: '100%' }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{ cursor: 'pointer' }}
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default KeywordSuggestionsTable;
