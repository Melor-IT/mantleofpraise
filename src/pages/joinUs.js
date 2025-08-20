import { useIntl } from "react-intl";
import { useState } from "react";

export default function JoinUs() {
  const { formatMessage } = useIntl();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    church: "",
    pastor: "",
    gifts: "",
    agreeTerms: false,
    agreePrivacy: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreeTerms || !formData.agreePrivacy) {
      alert(formatMessage({ id: "joinus.mustAgree" }));
      return;
    }
    console.log("Form submitted:", formData);
  };

  return (
    <div className="joinus max-w-xl mx-auto p-6 bg-white shadow rounded-lg">
      <form onSubmit={handleSubmit}>
        <div>
          <label>{formatMessage({ id: "firstName" })}</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>{formatMessage({ id: "lastName" })}</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>{formatMessage({ id: "email" })}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>{formatMessage({ id: "phone" })}</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>{formatMessage({ id: "city" })}</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block mb-1">
            {formatMessage({ id: "church" })}
          </label>
          <input
            type="text"
            name="church"
            value={formData.church}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label>{formatMessage({ id: "pastor" })}</label>
          <input
            type="text"
            name="pastor"
            value={formData.pastor}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>{formatMessage({ id: "gifts" })}</label>
          <textarea
            name="gifts"
            value={formData.gifts}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
            />
            {formatMessage({ id: "agreeTerms" })}
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="agreePrivacy"
              checked={formData.agreePrivacy}
              onChange={handleChange}
            />
            {formatMessage({ id: "agreePrivacy" })}
          </label>
        </div>

        <button type="submit">{formatMessage({ id: "submit" })}</button>
      </form>
    </div>
  );
}
