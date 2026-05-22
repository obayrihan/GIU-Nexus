import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import JobCard from '../components/JobCard';

const CATEGORIES = [
  'All', 'Technology', 'Engineering', 'Marketing',
  'Finance', 'Healthcare', 'Design', 'Education',
];

const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Internship', 'Remote', 'Hybrid'];

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
      <div style={{
        width: '36px', height: '36px',
        border: '3px solid var(--color-border-tertiary)',
        borderTopColor: '#185FA5',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--color-background-primary)',
      border: '0.5px solid var(--color-border-tertiary)',
      borderRadius: '12px',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      {[80, 140, 100, 60].map((w, i) => (
        <div key={i} style={{
          height: i === 1 ? '18px' : '13px',
          width: `${w}%`,
          background: 'var(--color-background-secondary)',
          borderRadius: '6px',
          animation: 'pulse 1.4s ease-in-out infinite',
        }} />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}

export default function JobListPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [jobType, setJobType] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 12 };
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (jobType !== 'All') params.type = jobType;

      const res = await api.get('/jobs', { params });
      setJobs(res.data.jobs || res.data);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, category, jobType, page]);

  useEffect(() => {
    const timer = setTimeout(fetchJobs, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchJobs, search]);

  useEffect(() => {
    setPage(1);
  }, [search, category, jobType]);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          margin: '0 0 6px',
        }}>
          Browse Jobs
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '15px' }}>
          Find your next opportunity
        </p>
      </div>

      {/* Search + Filters */}
      <div style={{
        background: 'var(--color-background-primary)',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}>
        {/* Search bar */}
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '16px', color: 'var(--color-text-secondary)',
            pointerEvents: 'none',
          }}>🔍</span>
          <input
            type="text"
            placeholder="Search jobs, companies, keywords…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              fontSize: '14px',
              border: '0.5px solid var(--color-border-secondary)',
              borderRadius: '8px',
              background: 'var(--color-background-secondary)',
              color: 'var(--color-text-primary)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Category filter */}
        <div>
          <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
            Category
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '5px 14px',
                  fontSize: '12px',
                  fontWeight: 500,
                  borderRadius: '20px',
                  border: category === cat ? '1.5px solid #185FA5' : '0.5px solid var(--color-border-secondary)',
                  background: category === cat ? '#E6F1FB' : 'transparent',
                  color: category === cat ? '#0C447C' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Job type filter */}
        <div>
          <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
            Job type
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {JOB_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setJobType(type)}
                style={{
                  padding: '5px 14px',
                  fontSize: '12px',
                  fontWeight: 500,
                  borderRadius: '20px',
                  border: jobType === type ? '1.5px solid #3B6D11' : '0.5px solid var(--color-border-secondary)',
                  background: jobType === type ? '#EAF3DE' : 'transparent',
                  color: jobType === type ? '#27500A' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div style={{
          background: '#FCEBEB',
          border: '0.5px solid #A32D2D',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          color: '#791F1F',
          marginBottom: '1.5rem',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span>⚠️</span>
          <span>{error}</span>
          <button
            onClick={fetchJobs}
            style={{
              marginLeft: 'auto',
              fontSize: '12px',
              padding: '4px 12px',
              borderRadius: '6px',
              border: '0.5px solid #A32D2D',
              background: 'transparent',
              color: '#791F1F',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Results count */}
      {!loading && !error && (
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
          {jobs.length === 0
            ? 'No jobs found'
            : `Showing ${jobs.length} job${jobs.length !== 1 ? 's' : ''}`}
          {category !== 'All' ? ` in ${category}` : ''}
          {jobType !== 'All' ? ` · ${jobType}` : ''}
        </p>
      )}

      {/* Jobs grid */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem',
        }}>
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : jobs.length === 0 ? (
        /* Empty state */
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: 'var(--color-text-secondary)',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 8px' }}>
            No jobs found
          </h3>
          <p style={{ fontSize: '14px', margin: '0 0 1.5rem' }}>
            Try adjusting your filters or search terms
          </p>
          <button
            onClick={() => { setSearch(''); setCategory('All'); setJobType('All'); }}
            style={{
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '8px',
              border: '0.5px solid var(--color-border-secondary)',
              background: 'transparent',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem',
        }}>
          {jobs.map(job => <JobCard key={job._id} job={job} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginTop: '2rem',
        }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '7px 16px',
              fontSize: '13px',
              borderRadius: '8px',
              border: '0.5px solid var(--color-border-secondary)',
              background: 'transparent',
              color: page === 1 ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              opacity: page === 1 ? 0.5 : 1,
            }}
          >
            ← Previous
          </button>
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', padding: '0 8px' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: '7px 16px',
              fontSize: '13px',
              borderRadius: '8px',
              border: '0.5px solid var(--color-border-secondary)',
              background: 'transparent',
              color: page === totalPages ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              opacity: page === totalPages ? 0.5 : 1,
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
