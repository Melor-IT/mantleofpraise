import { useIntl } from 'react-intl';

const Gift = ({ locale, setLocale }) => {
  const { formatMessage } = useIntl();

  return (
    <section className="secondary">
      <div className="page-content">
        <div>
          <h2>
            {formatMessage({
              id: 'gift',
              defaultMessage: 'Gift'
            })}
          </h2>

          <p>
            {formatMessage({
              id: 'giftText',
              defaultMessage:
                'We invite you to participate with a grateful heart and steadfast faith, so that the name of the Lord may be glorified among the nations.'
            })}
          </p>

          <h3>
            {formatMessage({
              id: 'giftTextbibel',
              defaultMessage:
                'Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.'
            })}
          </h3>

          <p>
            {formatMessage({
              id: 'giftTextbibelOnder',
              defaultMessage:
                'We invite you to participate with a grateful heart and steadfast faith, so that the name of the Lord may be glorified among the nations.'
            })}
          </p>
        </div>

        <div>
          <div className="imageQR"></div>
        </div>
      </div>
    </section>
  );
};

export default Gift;
