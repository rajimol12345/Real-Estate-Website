import React, { useState, useEffect, useContext } from 'react';
import PageCover from '../components/PageCover/PageCover';
import BlogPostCard from '../components/BlogPostCard/BlogPostCard';
import Pagination from '../components/Pagination/Pagination';
import { blogService } from '../services/api'; // Import blogService
import { LanguageContext } from '../context/LanguageContext';
import { getImageUrl } from '../utils/helpers'; // Import getImageUrl helper
import './Blog2Col.css';

import pageCoverBg from '../assets/images/slider/8.jpg';

const Blog2Col = () => {
  const { getLocalized } = useContext(LanguageContext);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setLoading(true);
      try {
        const response = await blogService.getAll({
          page: currentPage,
          limit: itemsPerPage
        });
        setBlogPosts(response.data.blogs || []);
        setTotalPages(response.data.pages || 1);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPosts();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="blog-grid-page">
      <PageCover title="Blog 2 Columns" homeLink="/" currentCrumb="Blog" backgroundImage={pageCoverBg} />

      <section className="blog-section">
        <div className="container">
          <div className="row">
            <div className="col-md-9 main-blog-column">
              <div className="row">
                {loading ? (
                  <div className="col-12 text-center">Loading blog posts...</div>
                ) : blogPosts.length > 0 ? (
                  blogPosts.map((post, index) => {
                    const title = getLocalized(post.title);
                    const content = getLocalized(post.content);
                    return (
                      <div className="col-md-6" key={post._id || index}>
                        <BlogPostCard
                          id={post._id}
                          image={getImageUrl(post.imageUrl)}
                          date={new Date(post.createdAt).toLocaleDateString()}
                          title={title}
                          excerpt={content ? content.substring(0, 150) + '...' : ''}
                          category="General"
                          commentsCount={0}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="col-12 text-center">No blog posts found.</div>
                )}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>

            <div className="col-md-3 sidebar-column">
              {/* Simple Sidebar Implementation for now */}
              <div className="sidebar-widget">
                <h3 className="widget-title">Search <span>Blog</span></h3>
                <div className="sidebar-search">
                  <input type="text" placeholder="Search..." className="form-control" />
                  <button><i className="fa-solid fa-search"></i></button>
                </div>
              </div>
              <div className="sidebar-widget">
                <h3 className="widget-title">Categories</h3>
                <ul className="widget-links">
                  <li><a href="#">Apartments <span>(10)</span></a></li>
                  <li><a href="#">Houses <span>(8)</span></a></li>
                  <li><a href="#">Villas <span>(5)</span></a></li>
                  <li><a href="#">Commercial <span>(3)</span></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog2Col;
