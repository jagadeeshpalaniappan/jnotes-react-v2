import React from 'react';
import { Outlet, Link } from 'react-router-dom';

import booksLayoutStyles from './BooksLayout.module.css';

export const BooksSideNav = () => {
  return (
    <nav className={booksLayoutStyles.sideNav}>
      <ul>
        <li>
          <Link to="/books">Books - Home</Link>
        </li>
        <li>
          <Link to="/books/new">Books - Create New</Link>
        </li>
      </ul>
    </nav>
  );
};

const BooksLayout = () => {
  return (
    <div className={booksLayoutStyles.root}>
      <BooksSideNav />
      <Outlet context={{ hello: 'world' }} />
    </div>
  );
};

export default BooksLayout;
