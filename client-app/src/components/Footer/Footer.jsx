import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';
import footerLogo from '../../assets/images/footer.png';
import { blogService } from '../../services/api';

const Footer = () => {
  const { t } = useTranslation();
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await blogService.getAll();
        const blogs = response.data.blogs || response.data;
        setRecentPosts(Array.isArray(blogs) ? blogs.slice(0, 2) : []);
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      }
    };
    fetchRecentPosts();
  }, []);

  return (
    <footer className="row m0 footer">
      <div className="container">
        <div className="col-md-4">
          <h4>{t('footer.recent_posts')}</h4>
          {recentPosts.map(post => (
            <p className="small" key={post._id}>
              {post.title}
              <br />
              <span style={{ color: '#1b9bff' }}>{new Date(post.createdAt).toLocaleDateString()}</span>
            </p>
          ))}
        </div>
        <div className="col-md-4 text-center">
          <div className="footer_logo"><img src={footerLogo} alt="Logo" style={{ height: '40px' }} /></div>
          <p>Estate Pro is the leading provider of real estate services globally, connecting buyers and sellers since 1998.</p>
        </div>
        <div className="col-md-4">
          <h4>Newsletter</h4>
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Email Address" />
            <span className="input-group-btn">
              <button className="btn btn-primary" type="button" style={{ height: '45px', background: '#1b9bff', border: 'none' }}>GO</button>
            </span>
          </div>
        </div>
        <div className="col-xs-12 text-center footer_bottom">
          <p>&copy; 2024 Estate Pro. {t('footer.rights')}.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
