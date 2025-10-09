'use client'; 

import { useIntl } from 'react-intl';
import BackgroundImage from '../../components/BackgroundImage';

export default function OurVisionPage() {
  const { formatMessage } = useIntl();

  return (
    <div className="page OurVision">
      {/* Header */}
      <section>
        <BackgroundImage
          url="/images/ourvision-banner.jpg"
          className="OurVisionHeader"
        />
        <div className="page-content">
          <h1>{formatMessage({ id: 'ourVisionTitle', defaultMessage: 'Our Vision' })}</h1>
        </div>
      </section>

      {/* Section 1 – Unity in Prayer and True Worship */}
      <section className="primary">
        <div className="page-content">
          <div className="text-block">
            <h2>
              {formatMessage({
                id: 'unityPrayerWorshipTitle',
                defaultMessage: 'Unity in Prayer and True Worship'
              })}
            </h2>
            <p>
              {formatMessage({ 
                id: 'unityPrayerWorshipIntro', 
                defaultMessage: 'Christian faith is not merely an individual faith. From the beginning of the Bible, God gathers His people to worship Him together. True worship becomes more powerful when believers unite their hearts and spirits.' 
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 – God enthroned through praise */}
      <section className="secondary">
        <div className="page-content">
          <div className="text-block">
            <h2>
              {formatMessage({
                id: 'godThroneTitle',
                defaultMessage: 'God enthroned through the praise of His people'
              })}
            </h2>
            <p>
              {formatMessage({ 
                id: 'godThroneText', 
                defaultMessage: 'Psalm 22:3: "Yet you are holy, enthroned on the praises of Israel." When God’s people lift their voices together, He sits enthroned on their worship, establishing His presence on earth.' 
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 – God’s throne among His people */}
      <section className="primary">
        <div className="page-content">
          <div className="text-block">
            <h2>
              {formatMessage({
                id: 'godsThroneAmongPeopleTitle',
                defaultMessage: 'God’s throne among His people'
              })}
            </h2>
            <p>
              {formatMessage({ 
                id: 'godsThroneAmongPeopleText', 
                defaultMessage: 'Jeremiah 49:38: "I will set up my throne there." When we unite in prayer and worship, God’s throne is established, and His authority is revealed in our church.' 
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Section 4 – We are God’s temple */}
      <section className="secondary">
        <div className="page-content">
          <div className="text-block">
            <h2>
              {formatMessage({
                id: 'godsTempleTitle',
                defaultMessage: 'We are God’s temple'
              })}
            </h2>
            <p>
              {formatMessage({ 
                id: 'godsTempleText', 
                defaultMessage: '1 Corinthians 3:16: "Do you not know that you are God’s temple and that God’s Spirit dwells in you?" Each believer is a living temple, and together we form a greater temple where God’s presence is revealed.' 
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Section 5 – Worship in spirit and truth */}
      <section className="primary">
        <div className="page-content">
          <div className="text-block">
            <h2>
              {formatMessage({
                id: 'worshipSpiritTruthTitle',
                defaultMessage: 'Worship in Spirit and Truth'
              })}
            </h2>
            <p>
              {formatMessage({ 
                id: 'worshipSpiritTruthText', 
                defaultMessage: 'John 4:20-23: True worshipers will worship the Father in spirit and truth. True worship occurs when our whole being aligns with God’s truth.' 
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Section 6 – Application for today */}
      <section className="secondary">
        <div className="page-content">
          <div className="text-block">
            <h2>
              {formatMessage({
                id: 'applicationTodayTitle',
                defaultMessage: 'Application for Today'
              })}
            </h2>
            <p>
              {formatMessage({ 
                id: 'applicationTodayText', 
                defaultMessage: 'Acts 2:46-47: When our prayer and worship are united, God’s presence comes in a fresh way, the enemy is defeated, our faith grows stronger, and others see God’s glory and are drawn to Christ.' 
              })}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
