import { useIntl } from 'react-intl';
import { useState } from 'react';
import BackgroundImage from '../components/BackgroundImage';

export default function JoinUs() {
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
    console.log('Form submitted:', formData);

    const response = await fetch('https://www.ewcms.org/mantleofpraise/contact.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      alert('Message sent!');
    } else {
      alert('Failed to send message.');
    }
  };

  return (
    <div className="page join-us">
      <section className="banner">
        <BackgroundImage url="/images/juneUs.png" />

        <div className="page-content">
          <h1>
            {formatMessage({
              id: 'joinUs',
              defaultMessage: 'Join Us'
            })}
          </h1>

          <h3 className='page-intro'>
            {formatMessage({
              id: 'joinUsText',
              defaultMessage:
                'And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together, as some are in the habit of doing, but encouraging one another—and all the more as you see the Day approaching.'
            })}
          </h3>
          <h3>
            {formatMessage({
              id: 'joinUsTextOnder',
              defaultMessage: '- Hebrews 10:24-25'
            })}
          </h3>
        </div>
      </section>
{/* 
      <section className="our-team">

        <div className="page-content">
          <div className="circle">
            <h2>
              {formatMessage({
                id: 'team',
                defaultMessage: 'our team'
              })}
            </h2>

            <p>
              {formatMessage({
                id: 'teamText',
                defaultMessage: ''
              })}
            </p>
          </div>

            <div className="image-big">
              <img src="/images/family.jpg" alt="Hamid & Sima" />
            </div>


        </div>
      </section> */}

      <section className="botoje form">

        <div className="page-content">
          <form className="form-block" onSubmit={handleSubmit}>
            <label>
              <span className="title">{formatMessage({ id: 'firstName' })}</span>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span className="title">{formatMessage({ id: 'lastName' })}</span>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span className="title">{formatMessage({ id: 'email' })}</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span className="title">{formatMessage({ id: 'phone' })}</span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span className="title">{formatMessage({ id: 'city' })}</span>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span className="title">{formatMessage({ id: 'church' })}</span>
              <input
                type="text"
                name="church"
                value={formData.church}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </label>

            <label>
              <span className="title">{formatMessage({ id: 'pastor' })}</span>
              <input
                type="text"
                name="pastor"
                value={formData.pastor}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span className="title">{formatMessage({ id: 'gifts' })}</span>
              <textarea
                name="gifts"
                value={formData.gifts}
                onChange={handleChange}
                rows="3"></textarea>{' '}
            </label>

            <label className="checkbox">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
              />
              <span>
                <a href="../../pdf/termsFa.pdf" target="_blank" rel="noopener noreferrer">
                  {formatMessage({ id: 'agreeTerms' })}
                </a>{' '}
              </span>
            </label>

            <label className="checkbox">
              <input
                type="checkbox"
                name="agreePrivacy"
                checked={formData.agreePrivacy}
                onChange={handleChange}
                required
              />
              <span>{formatMessage({ id: 'agreePrivacy' })}</span>
            </label>

            <button type="submit">{formatMessage({ id: 'submit' })}</button>
          </form>
        </div>
      </section>
    </div>
  );
}
