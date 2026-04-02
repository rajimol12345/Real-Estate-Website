import React from 'react';
import { NavLink } from 'react-router-dom';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination-wrapper-fid">
      <ul className="pagination-fid">
        {pages.map((page) => (
          <li key={page} className={currentPage === page ? 'active' : ''}>
            <button
              onClick={() => onPageChange(page)}
              className="page-link"
              disabled={currentPage === page}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pagination;