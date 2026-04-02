import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageCover from '../components/PageCover/PageCover';
import { blogService } from '../services/api';
import { LanguageContext } from '../context/LanguageContext';
import { getImageUrl } from '../utils/helpers';
import './SinglePost.css';

import pageCoverBg from '../assets/images/slider/8.jpg';
import blog1 from '../assets/images/blog/1.jpg';
import blog2 from '../assets/images/blog/2.jpg';
import blog3 from '../assets/images/blog/3.jpg';

const SAMPLE_COMMENTS = [
    { id: 1, name: 'ShaneFreer', time: '3 minutes ago', text: 'great post!', avatar: null },
    { id: 2, name: 'Collis Ta\'eed', time: '42 minutes ago', text: 'yeah i really like it too, nice work!', avatar: null },
    { id: 3, name: 'jremick', time: '5 hours ago', text: 'I build this post very well too, the comment form looks per perfect, keep it up guys :)', avatar: null },
    { id: 4, name: 'joshjanssen', time: '1 day ago', text: 'yes!, Absolutely, what a chance to comments today..', avatar: null },
    { id: 5, name: 'stewboon', time: '10 months ago', text: 'nice work...', avatar: null },
    { id: 6, name: 'bensmithett', time: '8 months ago', text: 'careful my better :D', avatar: null },
    { id: 7, name: 'justinfrench', time: '14 months ago', text: 'so lets very planning..', avatar: null },
];

const POPULAR_POSTS = [
    { id: 1, title: "Envato's Most Wanted: Courses & Learning Themes - $7,000", image: blog1 },
    { id: 2, title: "Envato's Most Wanted: Courses & Learning Themes - $7,000", image: blog2 },
    { id: 3, title: "Envato's Most Wanted: Courses & Learning Themes - $7,000", image: blog3 },
];

const SinglePost = () => {
    const { id } = useParams();
    const { getLocalized } = useContext(LanguageContext);
    const [blogPost, setBlogPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('popular');
    const [commentForm, setCommentForm] = useState({ name: '', email: '', website: '', message: '' });
    const [comments, setComments] = useState(SAMPLE_COMMENTS);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const response = await blogService.getById(id);
                setBlogPost(response.data);
            } catch (error) {
                console.error("Error fetching single blog post:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchPost();
        } else {
            // Fallback sample data if no ID
            setBlogPost({
                title: { en: 'Marketplaces Rails 3 Upgrade' },
                content: { en: 'This is Photoshop\'s version of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum velit. Nam nec tellus a odio tincidunt auctor a ornare odio. Sed non mauris vitae erat consequat auctor eu in elit.' },
                imageUrl: '',
                fallbackImage: blog1, // Use local image as fallback
                createdAt: new Date().toISOString(),
                comments: [],
            });
            setLoading(false);
        }
    }, [id]);

    const handleCommentChange = (e) => {
        setCommentForm({ ...commentForm, [e.target.name]: e.target.value });
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        
        const newComment = {
            id: comments.length + 1,
            name: commentForm.name,
            time: 'Just now',
            text: commentForm.message,
            avatar: null
        };

        setComments([newComment, ...comments]);
        setCommentForm({ name: '', email: '', website: '', message: '' });
        alert('Comment posted successfully!');
    };

    if (loading) return <div className="loading-container">Loading...</div>;
    if (!blogPost) return <div className="no-post-found">No blog post found.</div>;

    const blogTitle = getLocalized(blogPost.title);
    const blogContent = getLocalized(blogPost.content);

    return (
        <div className="single-post-page-pro">
            <PageCover title="Our Blog" homeLink="/" currentCrumb="our blog" backgroundImage={pageCoverBg} />

            <section className="sp-section">
                <div className="container">
                    <div className="row">
                        {/* Main Content */}
                        <div className="col-md-8">
                            <article className="sp-article">
                                {/* Post Image */}
                                <div className="sp-post-image">
                                    {(blogPost.imageUrl || blogPost.fallbackImage) ? (
                                        <img 
                                            src={blogPost.imageUrl ? getImageUrl(blogPost.imageUrl) : blogPost.fallbackImage} 
                                            alt={blogTitle} 
                                        />
                                    ) : (
                                        <div className="sp-placeholder-image">
                                            <i className="fa-solid fa-image"></i>
                                        </div>
                                    )}
                                    <div className="sp-post-badges">
                                        <span className="sp-badge-comments">
                                            <i className="fa-regular fa-comment"></i> {blogPost.comments?.length || 6} comments
                                        </span>
                                        <span className="sp-badge-date">
                                            <i className="fa-regular fa-calendar"></i> {new Date(blogPost.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                                        </span>
                                    </div>
                                </div>

                                {/* Post Title */}
                                <h2 className="sp-post-title">{blogTitle}</h2>

                                {/* Post Content */}
                                <div className="sp-post-content">
                                    <p>{blogContent}</p>
                                    <p>Sed ut imperdiet nisi. Proin condimentum fermentum nunc. Etiam pharetra, erat sed fermentum feugiat, velit mauris egestas quam, ut aliquam massa nisl quis neque. Suspendisse in orci enim. This is Photoshop's version of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit.</p>
                                    <p>Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum velit. Nam nec tellus a odio tincidunt auctor a ornare odio. Sed non mauris vitae erat consequat auctor eu in elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris in erat justo. Nullam ac urna eu felis dapibus condimentum sit amet a augue. Sed non neque elit. Sed ut imperdiet</p>
                                </div>
                            </article>

                            {/* Comments Section */}
                            <div className="sp-comments-section">
                                <h3 className="sp-section-heading">{comments.length} Comments</h3>
                                <div className="sp-comments-list">
                                    {comments.map((comment) => (
                                        <div className="sp-comment-item" key={comment.id}>
                                            <div className="sp-comment-avatar">
                                                <i className="fa-solid fa-user"></i>
                                            </div>
                                            <div className="sp-comment-body">
                                                <div className="sp-comment-meta">
                                                    <a href="#" className="sp-comment-author">{comment.name}</a>
                                                    <span className="sp-comment-time">{comment.time}</span>
                                                </div>
                                                <p>{comment.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Leave a Comment Form */}
                            <div className="sp-leave-comment">
                                <h3 className="sp-section-heading">Leave a Comment</h3>
                                <form className="sp-comment-form" onSubmit={handleCommentSubmit}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="sp-form-group">
                                                <div className="sp-input-icon">
                                                    <i className="fa-solid fa-user"></i>
                                                </div>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="Name"
                                                    value={commentForm.name}
                                                    onChange={handleCommentChange}
                                                    required
                                                />
                                            </div>
                                            <div className="sp-form-group">
                                                <div className="sp-input-icon">
                                                    <i className="fa-solid fa-envelope"></i>
                                                </div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="e-Mail"
                                                    value={commentForm.email}
                                                    onChange={handleCommentChange}
                                                    required
                                                />
                                            </div>
                                            <div className="sp-form-group">
                                                <div className="sp-input-icon">
                                                    <i className="fa-solid fa-globe"></i>
                                                </div>
                                                <input
                                                    type="text"
                                                    name="website"
                                                    placeholder="website"
                                                    value={commentForm.website}
                                                    onChange={handleCommentChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="sp-form-group sp-textarea-group">
                                                <textarea
                                                    name="message"
                                                    placeholder="message"
                                                    rows="7"
                                                    value={commentForm.message}
                                                    onChange={handleCommentChange}
                                                    required
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" className="sp-btn-submit">POST A COMMENT</button>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="col-md-4">
                            <div className="sp-sidebar">
                                {/* Search Widget */}
                                <div className="sp-widget">
                                    <h4 className="sp-widget-title">Search</h4>
                                    <div className="sp-search-box">
                                        <input type="text" placeholder="Search here" />
                                        <button><i className="fa-solid fa-search"></i></button>
                                    </div>
                                </div>

                                {/* Tabbed Widget: Popular / Recent / Comments */}
                                <div className="sp-widget">
                                    <div className="sp-tabs">
                                        <button
                                            className={`sp-tab ${activeTab === 'popular' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('popular')}
                                        >Popular</button>
                                        <button
                                            className={`sp-tab ${activeTab === 'recent' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('recent')}
                                        >Recent</button>
                                        <button
                                            className={`sp-tab ${activeTab === 'comments' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('comments')}
                                        >Comments</button>
                                    </div>
                                    <div className="sp-tab-content">
                                        {POPULAR_POSTS.map((post, index) => (
                                            <div className="sp-tab-item" key={index}>
                                                <div className="sp-tab-thumb">
                                                    {post.image ? (
                                                        <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <i className="fa-solid fa-image"></i>
                                                    )}
                                                </div>
                                                <div className="sp-tab-info">
                                                    <h6>{post.title}</h6>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Tags Widget */}
                                <div className="sp-widget">
                                    <h4 className="sp-widget-title">Tags</h4>
                                    <div className="sp-tag-cloud">
                                        {['photography', 'logo', 'house', 'wp', 'photography', 'photography', 'travelling', 'sports', 'business', 'racing'].map((tag, i) => (
                                            <span key={i} className="sp-tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Text Widget */}
                                <div className="sp-widget">
                                    <h4 className="sp-widget-title">Text Widget</h4>
                                    <div className="sp-text-widget">
                                        <p>This is Photoshop's version of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum</p>
                                        <p>auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SinglePost;
