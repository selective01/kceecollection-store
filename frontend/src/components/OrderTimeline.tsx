import React from 'react';

type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered';

interface Props {
  status: OrderStatus;
  dates?: Partial<Record<OrderStatus, string>>;
}

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'pending',   label: 'Order placed' },
  { key: 'paid',      label: 'Payment confirmed' },
  { key: 'shipped',   label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

const ORDER: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered'];

function getStepState(stepKey: OrderStatus, currentStatus: OrderStatus) {
  const si = ORDER.indexOf(stepKey);
  const ci = ORDER.indexOf(currentStatus);
  if (si < ci) return 'done';
  if (si === ci) return 'active';
  return 'idle';
}

export const OrderTimeline: React.FC<Props> = ({ status, dates = {} }) => {
  // Normalise status to lowercase so "Pending" and "pending" both work
  const normalisedStatus = status?.toLowerCase() as OrderStatus;
  const validStatus = ORDER.includes(normalisedStatus) ? normalisedStatus : 'pending';

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%', margin: '8px 0 16px' }}>
      {STEPS.map((step, idx) => {
        const state = getStepState(step.key, validStatus);
        const isLast = idx === STEPS.length - 1;
        const showDate = ORDER.indexOf(step.key) <= ORDER.indexOf(validStatus);

        const dotStyle: React.CSSProperties = {
          width: 28,
          height: 28,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: state === 'done'
            ? '2px solid #4ade80'
            : state === 'active'
            ? '2px solid #60a5fa'
            : '2px solid #d1d5db',
          background: state === 'done'
            ? '#dcfce7'
            : state === 'active'
            ? '#dbeafe'
            : '#ffffff',
          position: 'relative',
          zIndex: 1,
          flexShrink: 0,
          transition: 'all 0.3s',
        };

        const labelStyle: React.CSSProperties = {
          marginTop: 6,
          fontSize: 10,
          fontWeight: 500,
          textAlign: 'center',
          lineHeight: 1.3,
          color: state === 'done'
            ? '#16a34a'
            : state === 'active'
            ? '#2563eb'
            : '#9ca3af',
        };

        const dateStyle: React.CSSProperties = {
          fontSize: 9,
          color: '#9ca3af',
          textAlign: 'center',
          marginTop: 2,
        };

        return (
          <div
            key={step.key}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
          >
            {/* Connector line */}
            {!isLast && (
              <div style={{
                position: 'absolute',
                top: 13,
                left: 'calc(50% + 14px)',
                width: 'calc(100% - 28px)',
                height: 2,
                background: state === 'done' ? '#4ade80' : '#e5e7eb',
                zIndex: 0,
              }} />
            )}

            {/* Dot */}
            <div style={dotStyle}>
              {state === 'done' && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
              {state === 'active' && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} />
              )}
              {state === 'idle' && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#d1d5db' }} />
              )}
            </div>

            {/* Label */}
            <p style={labelStyle}>{step.label}</p>

            {/* Date */}
            {showDate && dates[step.key] && (
              <p style={dateStyle}>{dates[step.key]}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};
