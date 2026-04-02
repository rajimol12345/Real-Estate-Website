import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './PageCover.css';

const PageCover = ({ title, homeLink, currentCrumb, backgroundImage, badgedTitle }) => {
  const { t } = useTranslation();
  return (
    <div className="pageCover-fidelity" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="pageCover-overlay"></div>
      <div className="container fidelity-container">
        <div className="page-title-box">
          {badgedTitle ? (
            <div className="badge-title-wrap">
              <span className="listing-badge">{badgedTitle}</span>
            </div>
          ) : (
            <h1 className="page_name_fid">{title}</h1>
          )}
        </div>
        <div className="page_dir_fid">
          <ul>
            <li><NavLink to={homeLink || "/"}>{t('page_cover.home')}</NavLink></li>
            <li className="sep"><i className="fa-solid fa-circle-arrow-right"></i></li>
            <li>{currentCrumb?.toLowerCase()}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PageCover;