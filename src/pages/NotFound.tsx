import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="wrap" style={{ paddingBlock: 'clamp(5rem, 14vw, 12rem)' }}>
      <p className="label">404</p>
      <h1
        style={{
          marginTop: 'var(--space-5)',
          fontSize: 'var(--size-display-sm)',
          fontWeight: 500,
          letterSpacing: 'var(--track-display)',
          lineHeight: 'var(--leading-display)',
        }}
      >
        That page isn’t here.
      </h1>
      <p className="lead" style={{ marginTop: 'var(--space-5)' }}>
        <Link to="/" style={{ borderBottom: '1px solid var(--rule-strong)' }}>
          Back to the work
        </Link>
      </p>
    </section>
  );
}
