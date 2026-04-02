import React, { useState, useEffect, useContext } from 'react';
import PageCover from '../components/PageCover/PageCover';
import BlogPostCard from '../components/BlogPostCard/BlogPostCard';
import Pagination from '../components/Pagination/Pagination';
import { blogService } from '../services/api';
import { LanguageContext } from '../context/LanguageContext';
import { getImageUrl } from '../utils/helpers'; // Import getImageUrl helper
import './Blog3Col.css';
import pageCoverBg from '../assets/images/slider/8.jpg';

const Blog3Col = () => {
    const { getLocalized } = useContext(LanguageContext);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const response = await blogService.getAll({
                    page: currentPage,
                    limit: itemsPerPage
                });
                setBlogs(response.data.blogs);
                setTotalPages(response.data.pages);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading && blogs.length === 0) return <div className="loading-container">Loading...</div>;

    return (
        <div className="blog-grid-page-fidelity">
            <PageCover title="Our Blog" homeLink="/" currentCrumb="our blog" backgroundImage={pageCoverBg} />

            <section className="blog-section-fidelity">
                <div className="container">
                    <div className="row">
                        {blogs.map((post) => {
                            const title = getLocalized(post.title);
                            const content = getLocalized(post.content);
                            return (
                                <div className="col-md-4 mb-4" key={post._id}>
                                    <BlogPostCard
                                        id={post._id}
                                        image={getImageUrl(post.imageUrl)}
                                        date={new Date(post.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                        title={title}
                                        excerpt={content ? content.substring(0, 100) + '...' : ''}
                                        commentsCount={post.comments?.length || 0}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </section>
        </div>
    );
};

export default Blog3Col;
