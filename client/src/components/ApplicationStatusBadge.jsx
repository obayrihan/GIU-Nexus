const STATUS_LABELS = {
  pending: "Pending",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
};

function ApplicationStatusBadge({ status = "pending" }) {
  return (
    <span className={`status-badge status-${status}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export default ApplicationStatusBadge;
