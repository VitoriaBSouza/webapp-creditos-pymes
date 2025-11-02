import './Comments.css';

export default function Comments({ rating = 0, title, body, reviewer, date, avatar }) {
  // generar las estrellitas dinámicamente
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < rating ? '★' : '☆'
  ).join('');

  return (
    <div className="card review-card h-100 shadow-sm">
      <div className="card-body">
        {/* Estrellas */}
        <div className="mb-2 text-warning stars">
          {stars}
        </div>

        {/* Título y cuerpo */}
        <h5 className="card-title">{title}</h5>
        <p className="card-text text-muted">{body}</p>

        {/* Reviewer */}
        <div className="d-flex align-items-center mt-3">
          <img
            src={avatar}
            alt={reviewer}
            className="rounded-circle me-2 review-avatar"
          />
          <div>
            <small className="fw-bold">{reviewer}</small>
            <br />
            <small className="text-muted">{date}</small>
          </div>
        </div>
      </div>
    </div>
  );
}
