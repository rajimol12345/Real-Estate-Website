import React from 'react';
import { Link } from 'react-router-dom';
import './BlogPostCard.css';

const BlogPostCard = ({ id, image, date, title, excerpt, commentsCount }) => {
  return (
    <div className="blog-post-card-fidelity">
      <div className="blog-image-wrapper-fid">
        <Link to={`/single-post/${id}`}>
          <img src={image} alt={title} />
        </Link>
        <div className="blog-meta-fid">
          <div className="meta-block comments-fid">
            <i className="fa-solid fa-comment"></i> {commentsCount} comments
          </div>
          <div className="meta-block date-fid">
            <i className="fa-solid fa-calendar-days"></i> {date}
          </div>
        </div>
      </div>
      <div className="blog-content-fid">
        <h3 className="blog-title-fid">
          <Link to={`/single-post/${id}`}>{title}</Link>
        </h3>
        <p className="blog-excerpt-fid">{excerpt}</p>
        <Link to={`/single-post/${id}`} className="read-more-fid">[ read more ]</Link>
      </div>
    </div>
  );
};

export default BlogPostCard;
