import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../context/LanguageContext';
import { blogService } from '../../services/api';
import { getImageUrl } from '../../utils/helpers';
import './style.css';

const NewsCard = ({ news }) => {
    return (
        <div className="lnews-card">
            {/* Blue left accent bar */}
            <div className="lnews-accent-bar"></div>

            <div className="lnews-inner">
                {/* Image + overlaid meta */}
                <div className="lnews-img-wrap">
                    <img src={getImageUrl(news.image, 'blog')} alt={news.title} />
                    <div className="lnews-meta">
                        <span className="lnews-meta-comments">
                            <i className="fa-solid fa-comment"></i> {news.commentsCount || 0} comments
                        </span>
                        <span className="lnews-meta-date">
                            <i className="fa-solid fa-calendar-days"></i> {news.date}
                        </span>
                    </div>
                </div>

                {/* Card body */}
                <div className="lnews-body">
                    <h3 className="lnews-title">
                        <Link to={`/single-post/${news.id}`}>{news.title}</Link>
                    </h3>
                    <p className="lnews-excerpt">
                        {news.excerpt}&nbsp;
                        <Link to={`/single-post/${news.id}`} className="lnews-readmore">[ read more ]</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const LatestNews = () => {
    const { t } = useTranslation();
    const { getLocalized } = useContext(LanguageContext);
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await blogService.getAll();
                const blogs = response.data.blogs || response.data;
                const blogsArray = Array.isArray(blogs) ? blogs : [];
                const mappedBlogs = blogsArray.slice(0, 3).map(blog => {
                    const title = getLocalized(blog.title);
                    const content = getLocalized(blog.content);
                    return {
                        id: blog._id,
                        title: title,
                        excerpt: content.substring(0, 130) + '...',
                        date: new Date(blog.datePosted || blog.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                        commentsCount: blog.comments?.length || 0,
                        image: blog.imageUrl
                    };
                });
                setNewsItems(mappedBlogs);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, [getLocalized]);

    if (loading) return null;

    return (
        <section className="lnews-section">
            <div className="container-fluid px-5">
                {/* Section Header */}
                <div className="lnews-header">
                    <h2 className="lnews-section-title">{t('news.title') || 'Latest News'}</h2>
                    <div className="lnews-separator"></div>
                </div>

                {/* Cards Grid */}
                <div className="lnews-grid">
                    {newsItems.map(news => (
                        <NewsCard key={news.id} news={news} />
                    ))}
                    {newsItems.length === 0 && (
                        <div className="lnews-empty">{t('news.empty') || 'No news updates available.'}</div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default LatestNews;
