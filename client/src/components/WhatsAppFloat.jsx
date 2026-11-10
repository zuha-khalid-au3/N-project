import { useBusiness } from '../context/BusinessContext.jsx';
import { buildWhatsAppUrl, generalQuoteMessage } from '../utils/whatsapp.js';

export default function WhatsAppFloat() {
  const business = useBusiness();

  return (
    <a
      className="whatsapp-float"
      href={buildWhatsAppUrl(business.whatsapp, generalQuoteMessage())}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp to request a quote"
    >
      <span className="whatsapp-float__pulse" aria-hidden="true" />
      <span>Enquire now</span>
    </a>
  );
}
