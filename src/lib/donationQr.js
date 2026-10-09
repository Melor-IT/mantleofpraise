import QRCode from 'qrcode';
import { donation } from '../data/donation';

let qrPromise;

export function getDonationQr() {
  if (!donation.paymentUrl) return Promise.resolve(null);
  qrPromise ??= QRCode.toDataURL(donation.paymentUrl, {
    errorCorrectionLevel: 'M',
    margin: 4,
    width: 560
  });
  return qrPromise;
}
