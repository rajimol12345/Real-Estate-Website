import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import recentPost1 from '../../assets/images/blog/1.jpg';
import recentPost2 from '../../assets/images/blog/2.jpg';
import recentPost3 from '../../assets/images/blog/3.jpg';


const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="widget widget-search">
        <form className="search-form">
          <input type="text" placeholder="Search..." />
          <button type="submit"><i className="fas fa-search"></i></button>
        </form>
      </div>

      <div className="widget widget-categories">
        <h3 className="widget-title">Categories</h3>
        <ul>
          <li><NavLink to="#">Apartments</NavLink></li>
          <li><NavLink to="#">Houses</NavLink></li>
          <li><NavLink to="#">Villas</NavLink></li>
          <li><NavLink to="#">Retail</NavLink></li>
          <li><NavLink to="#">Land</NavLink></li>
        </ul>
      </div>

      <div className="widget widget-recent-posts">
        <h3 className="widget-title">Recent Posts</h3>
        <ul>
          <li>
            <div className="post-thumbnail">
              <img src={recentPost1} alt="Recent Post" />
            </div>
            <div className="post-content">
              <h4><NavLink to="#">Beautiful Homes in the Best Neighborhoods</NavLink></h4>
              <span className="post-date">July 25, 2024</span>
            </div>
          </li>
          <li>
            <div className="post-thumbnail">
                <img src={recentPost2} alt="Recent Post" />
            </div>
            <div className="post-content">
              <h4><NavLink to="#">How to Stage Your Home for a Quick Sale</NavLink></h4>
              <span className="post-date">July 24, 2024</span>
            </div>
          </li>
          <li>
            <div className="post-thumbnail">
                <img src={recentPost3} alt="Recent Post" />
            </div>
            <div className="post-content">
              <h4><NavLink to="#">Tips for First-Time Home Buyers</NavLink></h4>
              <span className="post-date">July 23, 2024</span>
            </div>
          </li>
        </ul>
      </div>

      <div className="widget widget-archives">
        <h3 className="widget-title">Archives</h3>
        <ul>
          <li><NavLink to="#">July 2024</NavLink></li>
          <li><NavLink to="#">June 2024</NavLink></li>
          <li><NavLink to="#">May 2024</NavLink></li>
          <li><NavLink to="#">April 2024</NavLink></li>
        </ul>
      </div>

      <div className="widget widget-tags">
        <h3 className="widget-title">Tags</h3>
        <div className="tag-cloud">
          <NavLink to="#">real estate</NavLink>
          <NavLink to="#">houses</NavLink>
          <NavLink to="#">villas</NavLink>
          <NavLink to="#">apartments</NavLink>
          <NavLink to="#">rent</NavLink>
          <NavLink to="#">sale</NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
