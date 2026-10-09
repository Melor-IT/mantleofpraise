'use client';
import { useIntl } from 'react-intl';
import { useEffect, useRef, useState } from 'react';

const fieldLimits = {
  firstName: 100,
  lastName: 100,
  email: 254,
  phone: 40,
  city: 100,
  church: 150,
  pastor: 100,
  gifts: 2000
};

const emptyForm = {
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
};

export default function MembershipForm() {
  const { formatMessage } = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const requestRef = useRef(null);

  useEffect(
    () => () => {
      requestRef.current?.abort();
      requestRef.current = null;
    },
    []
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (!Object.hasOwn(emptyForm, name)) return;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (requestRef.current) return;
    setStatus(null);
    if (!e.currentTarget.reportValidity()) return;
    if (!formData.agreeTerms || !formData.agreePrivacy) {
      setStatus({ type: 'error', message: formatMessage({ id: 'mustAgree' }) });
      return;
    }
    const payload = {
      ...formData,
      ...Object.fromEntries(Object.keys(fieldLimits).map((name) => [name, formData[name].trim()]))
    };
    if (
      Object.entries(fieldLimits).some(
        ([name, limit]) => (name !== 'gifts' && !payload[name]) || payload[name].length > limit
      )
    ) {
      setStatus({ type: 'error', message: formatMessage({ id: 'formInvalid' }) });
      return;
    }

    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 15000);
    setIsSubmitting(true);

    try {
      const response = await fetch('https://www.ewcms.org/mantleofpraise/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        credentials: 'omit',
        redirect: 'error',
        cache: 'no-store',
        referrerPolicy: 'no-referrer'
      });

      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      if (requestRef.current !== controller) return;

      setStatus({
        type: 'success',
        message: formatMessage({ id: 'formSent', defaultMessage: 'Message sent!' })
      });
      setFormData(emptyForm);
    } catch {
      if (requestRef.current !== controller) return;
      setStatus({
        type: 'error',
        message: formatMessage({
          id: controller.signal.aborted ? 'formTimedOut' : 'formFailed',
          defaultMessage: 'Failed to send message. Please try again later.'
        })
      });
    } finally {
      clearTimeout(timeout);
      if (requestRef.current === controller) {
        requestRef.current = null;
        setIsSubmitting(false);
      }
    }
  };

  return (
    <section className="botoje form">
      <div className="page-content">
        <form className="form-block" onSubmit={handleSubmit} aria-busy={isSubmitting}>
          <label>
            <span className="title">{formatMessage({ id: 'firstName' })}</span>
            <input
              type="text"
              name="firstName"
              maxLength={fieldLimits.firstName}
              autoComplete="given-name"
              value={formData.firstName}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </label>

          <label>
            <span className="title">{formatMessage({ id: 'lastName' })}</span>
            <input
              type="text"
              name="lastName"
              maxLength={fieldLimits.lastName}
              autoComplete="family-name"
              value={formData.lastName}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </label>

          <label>
            <span className="title">{formatMessage({ id: 'email' })}</span>
            <input
              type="email"
              name="email"
              maxLength={fieldLimits.email}
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </label>

          <label>
            <span className="title">{formatMessage({ id: 'phone' })}</span>
            <input
              type="tel"
              name="phone"
              maxLength={fieldLimits.phone}
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </label>

          <label>
            <span className="title">{formatMessage({ id: 'city' })}</span>
            <input
              type="text"
              name="city"
              maxLength={fieldLimits.city}
              autoComplete="address-level2"
              value={formData.city}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </label>

          <label>
            <span className="title">{formatMessage({ id: 'church' })}</span>
            <input
              type="text"
              name="church"
              maxLength={fieldLimits.church}
              value={formData.church}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </label>

          <label>
            <span className="title">{formatMessage({ id: 'pastor' })}</span>
            <input
              type="text"
              name="pastor"
              maxLength={fieldLimits.pastor}
              value={formData.pastor}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </label>

          <label>
            <span className="title">{formatMessage({ id: 'gifts' })}</span>
            <textarea
              name="gifts"
              maxLength={fieldLimits.gifts}
              value={formData.gifts}
              onChange={handleChange}
              disabled={isSubmitting}
              rows="3"
            ></textarea>{' '}
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
            <span>
              <a href="/pdf/termsFa.pdf" target="_blank" rel="noopener noreferrer">
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
              disabled={isSubmitting}
              required
            />
            <span>{formatMessage({ id: 'agreePrivacy' })}</span>
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? formatMessage({ id: 'submitting', defaultMessage: 'Sending...' })
              : formatMessage({ id: 'submit' })}
          </button>
          <p
            className={`form-status${status ? ` ${status.type}` : ''}`}
            role={status?.type === 'error' ? 'alert' : 'status'}
            aria-live="polite"
          >
            {status?.message || ''}
          </p>
        </form>
      </div>
    </section>
  );
}
