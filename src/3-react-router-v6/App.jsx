import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';

import Home from './pages/Home';

import BooksLayout from './pages/BooksLayout';
import BookList from './pages/BookList';
import Book from './pages/Book';
import NewBook from './pages/NewBook';

import Blogs from './pages/Blogs';
import Contact from './pages/Contact';
import NoPage from './pages/NoPage';

import reactLogo from './assets/react.svg';
import appHeaderStyles from './AppHeader.module.css';
import appBodyStyles from './AppBody.module.css';
import { ThemePicker } from './ThemePicker';

function AppNav() {
  return (
    <nav>
      <ul className={appHeaderStyles.appNavList}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/books">Books</Link>
        </li>
        <li>
          <Link to="/blogs">Blogs</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
}

function AppHeader() {
  return (
    <div className={appHeaderStyles.root}>
      <div className={appHeaderStyles.leftSection}>
        <a href="#" target="_blank">
          <img src={reactLogo} className="logo react" alt="App Logo" />
        </a>
        <div>AppTitle</div>
        <AppNav />
      </div>
      <div className={appHeaderStyles.rightSection}>
        <ThemePicker />
      </div>
    </div>
  );
}

function AppLayout() {
  return (
    <>
      <AppHeader />
      <div className={appBodyStyles.root}>
        <Outlet />
      </div>
    </>
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />

          <Route path="/books" element={<BooksLayout />}>
            <Route index element={<BookList />} />
            <Route path=":id" element={<Book />} />
            <Route path="new" element={<NewBook />} />
          </Route>

          <Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
