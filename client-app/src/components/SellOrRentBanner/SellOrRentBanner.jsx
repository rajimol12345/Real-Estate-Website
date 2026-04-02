import React from 'react';
import { useTranslation } from 'react-i18next';
import './SellOrRentBanner.css';
import houseImg from '../../assets/images/slider/1.jpg';

const SellOrRentBanner = () => {
  const { t } = useTranslation();
  return (
    <section className="sell-rent-banner">
      <div className="container">
        <div className="banner-content">
          <div className="banner-house-img">
            <img src={houseImg} alt="Sell or Rent" />
          </div>
          <div className="banner-text">
            <h3>{t('sell_rent.sell')} <span>{t('sell_rent.or')}</span> {t('sell_rent.rent')}</h3>
            <p>{t('sell_rent.your_property')}</p>
          </div>
          <div className="banner-action">
            <button className="btn-click-here">{t('sell_rent.click_here')}</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellOrRentBanner;