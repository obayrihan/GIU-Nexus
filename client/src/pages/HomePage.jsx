import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import JobCard from '../components/JobCard';
import { useAuth } from "../context/AuthContext";
function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
      <div style={{
        width: '32px', height: '32px',
        border: '3px solid var(--color-border-tertiary)',
        borderTopColor: '#185FA5',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Section({ title, subtitle, children, action }) {
  return (
    <section style={{ marginBottom: '3rem' }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end',
        justifyContent: 'space-between', marginBottom: '1.25rem',
        flexWrap: 'wrap', gap: '8px',
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 4px' }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
const { user, isAuthenticated } = useAuth();
  const [recentJobs, setRecentJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(false);
  const [errorRecent, setErrorRecent] = useState('');
  const [errorRecommended, setErrorRecommended] = useState('');
  const [stats, setStats] = useState({ totalJobs: 0, companies: 0, students: 0 });

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await api.get('/jobs', { params: { limit: 6, sort: 'createdAt' } });
        setRecentJobs(res.data.jobs || res.data || []);
        if (res.data.total) {
          setStats(s => ({ ...s, totalJobs: res.data.total }));
        }
      } catch {
        setErrorRecent('Could not load recent jobs.');
      } finally {
        setLoadingRecent(false);
      }
    };
    fetchRecent();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchRecommended = async () => {
      setLoadingRecommended(true);
      try {
        const res = await api.get('/jobs/recommended');
        setRecommendedJobs(res.data.jobs || res.data || []);
      } catch {
        setErrorRecommended('Could not load AI recommendations.');
      } finally {
        setLoadingRecommended(false);
      }
    };
    fetchRecommended();
  }, [user]);

  const ViewAllButton = ({ path }) => (
    <button
      onClick={() => navigate(path)}
      style={{
        padding: '7px 16px', fontSize: '13px', fontWeight: 500,
        borderRadius: '8px', border: '0.5px solid var(--color-border-secondary)',
        background: 'transparent', color: 'var(--color-text-primary)', cursor: 'pointer',
      }}
    >
      View all →
    </button>
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Hero */}
      <div style={{
        background: 'var(--color-background-primary)',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: '20px',
        padding: '3rem 2.5rem',
        marginBottom: '3rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 60% 0%, #E6F1FB 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <h1 style={{
          fontSize: '36px', fontWeight: 800,
          color: 'var(--color-text-primary)', margin: '0 0 12px',
          lineHeight: 1.2, position: 'relative',
        }}>
          Find Your Next Opportunity
        </h1>
        <p style={{
          fontSize: '16px', color: 'var(--color-text-secondary)',
          maxWidth: '480px', margin: '0 auto 2rem',
          lineHeight: 1.6, position: 'relative',
        }}>
          GIU Nexus connects students with top employers.{' '}
          {user ? 'Your AI-powered matches are ready.' : 'Sign in to see personalized recommendations.'}
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
          <button
            onClick={() => navigate('/jobs')}
            style={{
              padding: '11px 28px', fontSize: '15px', fontWeight: 600,
              borderRadius: '10px', border: 'none',
              background: '#185FA5', color: '#fff', cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#0C447C'}
            onMouseLeave={e => e.currentTarget.style.background = '#185FA5'}
          >
            Browse Jobs
          </button>
          {!user && (
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '11px 28px', fontSize: '15px', fontWeight: 600,
                borderRadius: '10px',
                border: '0.5px solid var(--color-border-secondary)',
                background: 'transparent',
                color: 'var(--color-text-primary)', cursor: 'pointer',
              }}
            >
              Create Account
            </button>
          )}
        </div>

        {/* Stats */}
        {stats.totalJobs > 0 && (
          <div style={{
            display: 'flex', justifyContent: 'center',
            gap: '2rem', marginTop: '2rem',
            flexWrap: 'wrap', position: 'relative',
          }}>
            {[
              { label: 'Open Positions', value: stats.totalJobs },
              { label: 'Companies', value: stats.companies || '50+' },
              { label: 'Students Placed', value: stats.students || '200+' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#185FA5' }}>
                  {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Recommended Jobs (only for logged-in users) */}
      {user && (
        <Section
          title="Recommended for You"
          subtitle="✨ AI-matched based on your profile and skills"
          action={<ViewAllButton path="/jobs/recommended" />}
        >
          {loadingRecommended ? (
            <Spinner />
          ) : errorRecommended ? (
            <div style={{
              background: '#FCEBEB', border: '0.5px solid #A32D2D',
              borderRadius: '10px', padding: '1rem 1.25rem',
              color: '#791F1F', fontSize: '14px',
            }}>
              {errorRecommended}
            </div>
          ) : recommendedJobs.length === 0 ? (
            <div style={{
              background: '#E6F1FB', border: '0.5px solid #185FA5',
              borderRadius: '12px', padding: '1.5rem', textAlign: 'center',
            }}>
              <p style={{ fontSize: '14px', color: '#0C447C', margin: 0 }}>
                Complete your profile to unlock AI job recommendations 🎯
              </p>
              <button
                onClick={() => navigate('/profile/edit')}
                style={{
                  marginTop: '12px', padding: '7px 18px', fontSize: '13px',
                  fontWeight: 500, borderRadius: '8px',
                  border: '0.5px solid #185FA5',
                  background: 'transparent', color: '#0C447C', cursor: 'pointer',
                }}
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem',
            }}>
              {recommendedJobs.slice(0, 3).map(job => (
                <div key={job._id} style={{ position: 'relative' }}>
                  {job.similarityScore && (
                    <div style={{
                      position: 'absolute', top: '-8px', right: '12px', zIndex: 1,
                      background: '#185FA5', color: '#fff',
                      fontSize: '11px', fontWeight: 600,
                      padding: '2px 10px', borderRadius: '20px',
                    }}>
                      {Math.round(job.similarityScore * 100)}% match
                    </div>
                  )}
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Recent Jobs */}
      <Section
        title="Latest Jobs"
        subtitle="Freshest listings from top employers"
        action={<ViewAllButton path="/jobs" />}
      >
        {loadingRecent ? (
          <Spinner />
        ) : errorRecent ? (
          <div style={{
            background: '#FCEBEB', border: '0.5px solid #A32D2D',
            borderRadius: '10px', padding: '1rem 1.25rem',
            color: '#791F1F', fontSize: '14px',
          }}>
            {errorRecent}
          </div>
        ) : recentJobs.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '3rem',
            color: 'var(--color-text-secondary)', fontSize: '15px',
          }}>
            No jobs posted yet. Check back soon!
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem',
          }}>
            {recentJobs.map(job => <JobCard key={job._id} job={job} />)}
          </div>
        )}
      </Section>
    </div>
  );
}
