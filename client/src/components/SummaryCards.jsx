import React from 'react';

const SummaryCards = ({ summary }) => {
  const totalAmount = summary?.totalAmount || 0;
  const totalTransactions = summary?.totalTransactions || 0;
  const categoryTotals = summary?.categoryTotals || {};

  let topCategory = 'None';
  let topAmount = 0;
  Object.entries(categoryTotals).forEach(([cat, amount]) => {
    if (amount > topAmount) {
      topAmount = amount;
      topCategory = cat;
    }
  });

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon stat-icon-berry" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        </div>
        <div className="stat-content">
          <span className="stat-label">Total Expenses</span>
          <span className="stat-value">
            ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon stat-icon-mauve" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </div>
        <div className="stat-content">
          <span className="stat-label">Total Transactions</span>
          <span className="stat-value">{totalTransactions}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon stat-icon-rose" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
        </div>
        <div className="stat-content">
          <span className="stat-label">Top Category</span>
          <span className="stat-value">
            {topCategory !== 'None' ? `${topCategory} (₹${topAmount})` : 'No data'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
