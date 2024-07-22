import React from 'react';
import bookListStyles from './BookList.module.css';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function PageSizeDropdown() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageSize = searchParams.get('pageSize');
  const handlePageSizeChange = (event) => {
    const newPageSize = event.target.value;
    setSearchParams({ pageSize: newPageSize });
  };

  return (
    <label>
      Page Size:
      <select
        name="pageSize"
        value={pageSize}
        defaultValue={10}
        onChange={handlePageSizeChange}
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </label>
  );
}

export default function BookList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams({ pageSize: 10 });
  const pageSize = parseInt(searchParams.get('pageSize'));

  return (
    <div className={bookListStyles.root}>
      <p>BookList</p>
      <div className={bookListStyles.bookListToolbar}>
        <PageSizeDropdown />
      </div>
      <div className={bookListStyles.bookList}>
        {new Array(pageSize).fill(0).map((_, bookId) => (
          <button
            className={bookListStyles.bookListItem}
            onClick={() => navigate(`/books/${bookId}`)}
          >
            Book {bookId}
          </button>
        ))}
      </div>
    </div>
  );
}
