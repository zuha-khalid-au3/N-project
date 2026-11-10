import Seo from '../components/Seo.jsx';
import { useBusiness } from '../context/BusinessContext.jsx';

export default function About() {
  const business = useBusiness();

  return (
    <div className="page narrow">
      <Seo
        title="About Us"
        description={`About ${business.name} — artificial gems and stones for wholesale and custom orders.`}
        path="/about"
      />
      <h1>About Us</h1>
      <p className="lead">
        {business.name} manufactures and supplies artificial gems and stones for jewellery makers,
        designers, and wholesale buyers. Update this story from the shared business configuration.
      </p>
      <h2>Manufacturing approach</h2>
      <ul className="claim-list">
        {business.manufacturingClaims.map((claim) => (
          <li key={claim}>{claim}</li>
        ))}
      </ul>
      <h2>Service area</h2>
      <p>
        Contact us for current service coverage and wholesale availability. Do not treat placeholder
        content as certification, export history, or capacity claims.
      </p>
    </div>
  );
}
