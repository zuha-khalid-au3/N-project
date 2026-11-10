export default function StatusMessage({ tone = 'info', children }) {
  return <div className={`status-message status-message--${tone}`} role="status">{children}</div>;
}
