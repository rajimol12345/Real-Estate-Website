import React from 'react';
import PageCover from '../components/PageCover/PageCover';
import './FAQ.css';
import pageCoverBg from '../assets/images/slider/1.jpg';

const FAQ = () => {
    const faqs = [
        {
            question: "How do I list my property on EstatePro?",
            answer: "You can easily list your property by clicking on the 'Submit Property' button in the navigation menu. Follow the multi-step form to provide details, photos, and location of your property."
        },
        {
            question: "Are there any fees for buyers?",
            answer: "No, EstatePro is completely free for buyers. We earn our commission from the sellers or landlords upon a successful transaction."
        },
        {
            question: "How can I contact an agent directly?",
            answer: "Each listing details page has the contact information of the assigned agent. You can call them directly or send a message through the contact form on that page."
        },
        {
            question: "Does EstatePro verify the listings?",
            answer: "Yes, our team manually reviews every submission to ensure accuracy and legitimacy. However, we always recommend conducting your own due diligence before making any payments."
        },
        {
            question: "What areas do you cover?",
            answer: "We currently cover a wide range of metropolitan and suburban areas across the region. Use our advanced search to filter properties by your preferred location."
        }
    ];

    return (
        <div className="faq-page">
            <PageCover title="Frequently Asked Questions" homeLink="/" currentCrumb="FAQ" backgroundImage={pageCoverBg} />

            <section className="faq-content-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="section-title text-center">
                                <span className="sub-title">Got Questions?</span>
                                <h2>We Have <span>Answers</span></h2>
                                <div className="yellow-separator"></div>
                            </div>

                            <div className="faq-accordion">
                                {faqs.map((faq, index) => (
                                    <div className="faq-item" key={index}>
                                        <div className="faq-question">
                                            <h4>{index + 1}. {faq.question}</h4>
                                        </div>
                                        <div className="faq-answer">
                                            <p>{faq.answer}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQ;
