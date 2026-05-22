import { useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ApplicationStatusBadge from '../components/ApplicationStatusBadge';
import { useAuth } from "../context/AuthContext";
const categoryColors = {
  Technology: { bg: '#E6F1FB', text: '#0C447C', border: '#185FA5' },
  Engineering: { bg: '#EAF3DE', text: '#27500A', border: '#3B6D11' },
  Marketing: { bg: '#FAEEDA', text: '#633806', border: '#854F0B' },
  Finance: { bg: '#EEEDFE', text: '#3C3489', border: '#534AB7' },
  Healthcare: { bg: '#E1F5EE', text: '#085041', border: '#0F6E56' },
  Design: { bg: '#FBEAF0', text: '#72243E', border: '#993556' },
  Education: { bg: '#FAECE7', text: '#712B13', border: '#993C1D' },
  default: { bg: '#F1EFE8', text: '#444441', border: '#5F5E5A' },
};

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
      <div style={{
        width: '40px', height: '40px',
        border: '3px solid var(--color-border-tertiary)',
        borderTopColor: '#185FA5',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ApplyModal({ job, onClose, onSuccess }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await api.post(`/jobs/${job._id}/apply`, { coverLetter });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Application failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '1rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--color-background-primary)',
          borderRadius: '16px',
          border: '0.5px solid var(--color-border-tertiary)',
          padding: '2rem',
          width: '100%',
          maxWidth: '520px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Apply for this job
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              {job.title} · {job.company}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none',
              fontSize: '20px', cursor: 'pointer',
              color: 'var(--color-text-secondary)', lineHeight: 1,
              padding: '2px',
            }}
          >
            ×
          </button>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
            Cover Letter <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            value={coverLetter}
            onChange={e => setCoverLetter(e.target.value)}
            rows={6}
            placeholder="Tell the recruiter why you're a great fit for this role…"
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              border: '0.5px solid var(--color-border-secondary)',
              borderRadius: '8px',
              background: 'var(--color-background-secondary)',
              color: 'var(--color-text-primary)',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              lineHeight: 1.6,
            }}
          />
        </div>

        {error && (
          <div style={{
            background: '#FCEBEB',
            border: '0.5px solid #A32D2D',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#791F1F',
            fontSize: '13px',
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '9px 20px',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '8px',
              border: '0.5px solid var(--color-border-secondary)',
              background: 'transparent',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: '9px 24px',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '8px',
              border: 'none',
              background: submitting ? '#B5D4F4' : '#185FA5',
              color: '#fff',
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {submitting ? 'Submitting…' : 'Submit Application'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [applied, setApplied] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.job || res.data);

        // Check if user already applied
        if (user) {
          try {
            const appRes = await api.get(`/jobs/${id}/application-status`);
            if (appRes.data.status) {
              setApplied(true);
              setApplicationStatus(appRes.data.status);
            }
          } catch {
            // Not applied — that's fine
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load this job.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, user]);

  const catStyle = job
    ? (categoryColors[job.category] || categoryColors.default)
    : categoryColors.default;

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 8px' }}>
          Something went wrong
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
        <button
          onClick={() => navigate('/jobs')}
          style={{
            padding: '9px 20px', fontSize: '14px', fontWeight: 500,
            borderRadius: '8px', border: '0.5px solid var(--color-border-secondary)',
            background: 'transparent', color: 'var(--color-text-primary)', cursor: 'pointer',
          }}
        >
          ← Back to Jobs
        </button>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Back link */}
      <button
        onClick={() => navigate('/jobs')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '13px', color: 'var(--color-text-secondary)',
          padding: 0, marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}
      >
        ← Back to Jobs
      </button>

      {/* Success message */}
      {successMsg && (
        <div style={{
          background: '#EAF3DE',
          border: '0.5px solid #3B6D11',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          color: '#27500A',
          marginBottom: '1.5rem',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          ✅ {successMsg}
        </div>
      )}

      {/* Job header card */}
      <div style={{
        background: 'var(--color-background-primary)',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            {/* AI Category badge */}
            <span style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 500,
              padding: '3px 12px',
              borderRadius: '20px',
              background: catStyle.bg,
              color: catStyle.text,
              border: `0.5px solid ${catStyle.border}`,
              marginBottom: '12px',
              letterSpacing: '0.02em',
            }}>
              🤖 AI Category: {job.category || 'General'}
            </span>

            <h1 style={{
              fontSize: '24px', fontWeight: 700,
              color: 'var(--color-text-primary)', margin: '0 0 6px',
            }}>
              {job.title}
            </h1>
            <p style={{ margin: '0 0 16px', fontSize: '15px', color: 'var(--color-text-secondary)' }}>
              {job.company}
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {job.location && (
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>📍 {job.location}</span>
              )}
              {job.type && (
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>🕒 {job.type}</span>
              )}
              {job.salary && (
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>💰 {job.salary}</span>
              )}
              {job.deadline && (
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  📅 Deadline: {new Date(job.deadline).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Apply button / status */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
            {applied ? (
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 6px' }}>
                  Your application
                </p>
                <ApplicationStatusBadge status={applicationStatus} size="lg" />
              </div>
            ) : user ? (
              <button
                onClick={() => setShowModal(true)}
                style={{
                  padding: '10px 28px',
                  fontSize: '14px',
                  fontWeight: 600,
                  borderRadius: '10px',
                  border: 'none',
                  background: '#185FA5',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#0C447C'}
                onMouseLeave={e => e.currentTarget.style.background = '#185FA5'}
              >
                Apply Now
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '10px 24px',
                  fontSize: '14px',
                  fontWeight: 500,
                  borderRadius: '10px',
                  border: '0.5px solid var(--color-border-secondary)',
                  background: 'transparent',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                }}
              >
                Log in to apply
              </button>
            )}
          </div>
        </div>

        <div style={{
          borderTop: '0.5px solid var(--color-border-tertiary)',
          paddingTop: '12px',
          marginTop: '16px',
          fontSize: '12px',
          color: 'var(--color-text-secondary)',
        }}>
          {job.applicantsCount ?? 0} applicants · Posted {new Date(job.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Description */}
      <div style={{
        background: 'var(--color-background-primary)',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: '16px',
        padding: '1.75rem',
        marginBottom: '1rem',
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 1rem' }}>
          Job Description
        </h2>
        <div style={{
          fontSize: '14px',
          color: 'var(--color-text-primary)',
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
        }}>
          {job.description}
        </div>
      </div>

      {/* Requirements */}
      {job.requirements && (
        <div style={{
          background: 'var(--color-background-primary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: '16px',
          padding: '1.75rem',
          marginBottom: '1rem',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 1rem' }}>
            Requirements
          </h2>
          <div style={{ fontSize: '14px', color: 'var(--color-text-primary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {job.requirements}
          </div>
        </div>
      )}

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div style={{
          background: 'var(--color-background-primary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: '16px',
          padding: '1.75rem',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 1rem' }}>
            Skills
          </h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {job.skills.map((skill, i) => (
              <span key={i} style={{
                padding: '5px 14px',
                fontSize: '12px',
                fontWeight: 500,
                borderRadius: '20px',
                background: '#EEEDFE',
                color: '#3C3489',
                border: '0.5px solid #534AB7',
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showModal && (
        <ApplyModal
          job={job}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            setApplied(true);
            setApplicationStatus('pending');
            setSuccessMsg('Application submitted successfully! Good luck 🎉');
          }}
        />
      )}
    </div>
  );
}
