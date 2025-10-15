'use client';

import { useIntl } from 'react-intl';
import { useState } from 'react';
import BackgroundImage from '../../../components/BackgroundImage';

export default function JoinUsPage() {
  const { formatMessage } = useIntl();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    church: '',
    pastor: '',
    gifts: '',
    agreeTerms: false,
    agreePrivacy: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreeTerms || !formData.agreePrivacy) {
      alert(formatMessage({ id: 'joinus.mustAgree' }));
      return;
    }
    const response = await fetch('https://www.ewcms.org/mantleofpraise/contact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) alert('Message sent!');
    else alert('Failed to send message.');
  };

  return (
    <div className="page join-us">
      <section className="banner">
        <BackgroundImage url="/images/juneUs.png" />
        <div className="page-content">
          <h1>{formatMessage({ id: 'joinUs', defaultMessage: 'Join Us' })}</h1>
          <h3 className="page-intro">{formatMessage({ id: 'joinUsText', defaultMessage: 'And let us consider how we may spur one another on toward love and good deeds...' })}</h3>
          <h3>{formatMessage({ id: 'joinUsTextOnder', defaultMessage: '- Hebrews 10:24-25' })}</h3>
        </div>
      </section>

      <section className="botoje form">
        <div className="page-content">
          <form className="form-block" onSubmit={handleSubmit}>
            {/* تمامی input ها مانند firstName، lastName، email ... */}
            <button type="submit">{formatMessage({ id: 'submit' })}</button>
          </form>
        </div>
      </section>
    </div>
  );
}
