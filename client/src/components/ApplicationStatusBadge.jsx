const statusConfig = {
  pending: {
    label: 'Pending',
    bg: '#FAEEDA',
    text: '#633806',
    border: '#854F0B',
    dot: '#BA7517',
  },
  reviewing: {
    label: 'Under Review',
    bg: '#E6F1FB',
    text: '#0C447C',
    border: '#185FA5',
    dot: '#378ADD',
  },
  accepted: {
    label: 'Accepted',
    bg: '#EAF3DE',
    text: '#27500A',
    border: '#3B6D11',
    dot: '#639922',
  },
  rejected: {
    label: 'Rejected',
    bg: '#FCEBEB',
    text: '#791F1F',
    border: '#A32D2D',
    dot: '#E24B4A',
  },
  shortlisted: {
    label: 'Shortlisted',
    bg: '#EEEDFE',
    text: '#3C3489',
    border: '#534AB7',
    dot: '#7F77DD',
  },
  withdrawn: {
    label: 'Withdrawn',
    bg: '#F1EFE8',
    text: '#444441',
    border: '#5F5E5A',
    dot: '#888780',
  },
};

export default function ApplicationStatusBadge({ status, size = 'md' }) {
  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
  const fontSize = size === 'sm' ? '11px' : size === 'lg' ? '14px' : '12px';
  const padding = size === 'sm' ? '2px 8px' : size === 'lg' ? '5px 14px' : '3px 10px';
  const dotSize = size === 'sm' ? '5px' : '6px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        fontSize,
        fontWeight: 500,
        padding,
        borderRadius: '20px',
        background: config.bg,
        color: config.text,
        border: `0.5px solid ${config.border}`,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          background: config.dot,
          flexShrink: 0,
        }}
      />
      {config.label}
    </span>
  );
}
