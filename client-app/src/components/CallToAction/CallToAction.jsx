import React from 'react';
import { useTranslation } from 'react-i18next';
import './CallToAction.css';

const CallToAction = () => {
    const { t } = useTranslation();
    return (
        <section className="cta_banner">
            <div className="container">
                <h3>{t('cta.title')}</h3>
                <p>{t('cta.subtitle')}</p>
                <button className="cta_btn">{t('cta.button')}</button>
            </div>
        </section>
    );
};

export default CallToAction;