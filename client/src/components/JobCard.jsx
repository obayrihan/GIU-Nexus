import { Link } from "react-router-dom";
import CategoryBadge from "./CategoryBadge";
import SaveJobButton from "./SaveJobButton";

function JobCard({ applicationStatus, job, showScore = false }) {
  if (!job) {
    return null;
  }

  const score = typeof job.score === "number" ? Math.round(job.score * 100) : null;

  return (
    <article className="job-card">
      <div className="job-card-header">
        <div>
          <h3>
            <Link to={`/jobs/${job._id}`}>{job.title}</Link>
          </h3>
          <p>{job.company || job.createdBy?.name || "GIU Nexus recruiter"}</p>
        </div>
        <CategoryBadge category={job.category} />
      </div>

      <div className="job-meta">
        <span>{job.location || "Remote"}</span>
        <span>{job.type || "Role"}</span>
        <span>{job.status || "open"}</span>
      </div>

      {showScore && score !== null && <span className="score-label">{score}% match</span>}
      {applicationStatus && (
        <p className={`application-note application-note-${applicationStatus}`}>
          {applicationStatus === "not-applied" ? "Not applied yet" : `Applied: ${applicationStatus}`}
        </p>
      )}

      <div className="job-card-actions">
        <Link className="text-button" to={`/jobs/${job._id}`}>
          View details
        </Link>
        <SaveJobButton
          key={`${job._id}-${Boolean(job.saved)}`}
          jobId={job._id}
          status={job.status}
          initialSaved={job.saved}
        />
      </div>
    </article>
  );
}

export default JobCard;
