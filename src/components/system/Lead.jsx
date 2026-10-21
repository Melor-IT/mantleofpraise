import Paisley from './Paisley';

export default function Lead({ title, description, members, className = 'primary' }) {
  return (
    <section className={`lead ${className}`}>
      <div className="page-content">
        <div className="lead__intro content-card">
          <div className="section-heading--ornament">
            <h2 className="section-title">{title}</h2>
            <Paisley seed={title} />
          </div>
          <p>{description}</p>
        </div>
        <div className="team">
          {members.map((member) => (
            <div className="team-member" key={member.id}>
              <img src={member.image} alt={member.imageAlt} />
              <strong>{member.name}</strong>
              {member.role && <p>{member.role}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
