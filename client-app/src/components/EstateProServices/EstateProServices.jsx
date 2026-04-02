import React from 'react';
import { useTranslation } from 'react-i18next';
import './EstateProServices.css';

const EstateProServices = () => {
    const { t } = useTranslation();

    const services = [
        { titleKey: 'services.property_management', icon: 'fa-home', link: '#' },
        { titleKey: 'services.market_analysis', icon: 'fa-line-chart', link: '#' },
        { titleKey: 'services.sale_services', icon: 'fa-key', link: '#' },
        { titleKey: 'services.renting_services', icon: 'fa-building', link: '#' }
    ];

    return (
        <section className="estate-pro-services pt70">
            <div className="container">
                <h2 className="section_title">{t('services.title')}</h2>
                <div className="row">
                    {services.map((service, index) => (
                        <div className="col-sm-3" key={index}>
                            <div className="service_block">
                                <div className="inner">
                                    <div className="block_icon">
                                        <i className={`fa ${service.icon}`}></i>
                                    </div>
                                    <div className="block_title">{t(service.titleKey)}</div>
                                    <a href={service.link} className="read_more">{t('services.read_more')}</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EstateProServices;