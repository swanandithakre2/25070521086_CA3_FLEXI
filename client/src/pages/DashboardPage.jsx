import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import SummaryCards from '../components/SummaryCards';
import ExpenseModal from '../components/ExpenseModal';

const CATEGORIES = [
  'All',
  'Food',
  'Transport',
  'Rent',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Other'
];

const DashboardPage = ({ isModalOpen, setIsModalOpen }) => {
  const { authFetch } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

  // Edit State
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      if (sortBy) {
        params.append('sortBy', sortBy);
      }

      const [expensesRes, summaryRes] = await Promise.all([
        authFetch(`/api/expenses?${params.toString()}`),
        authFetch('/api/expenses/summary')
      ]);

      if (!expensesRes.ok || !summaryRes.ok) {
        throw new Error('Failed to load expenses data');
      }

      const expensesData = await expensesRes.json();
      const summaryData = await summaryRes.json();

      setExpenses(expensesData);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message || 'Error fetching expenses');
    } finally {
      setLoading(false);
    }
  }, [authFetch, selectedCategory, searchTerm, sortBy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showNotification = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleOpenAddModal = () => {
    setExpenseToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (expense) => {
    setExpenseToEdit(expense);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setExpenseToEdit(null);
  };

  const handleSaveExpense = async (expenseData) => {
    const expenseId = expenseToEdit?._id || expenseToEdit?.id;
    if (expenseToEdit && expenseId) {
      const res = await authFetch(`/api/expenses/${expenseId}`, {
        method: 'PUT',
        body: JSON.stringify(expenseData)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update expense');
      }
      showNotification('Expense updated.');
    } else {
      const res = await authFetch('/api/expenses', {
        method: 'POST',
        body: JSON.stringify(expenseData)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to record expense');
      }
      showNotification('Expense recorded.');
    }
    fetchData();
  };

  const handleDeleteExpense = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) {
      return;
    }

    try {
      const res = await authFetch(`/api/expenses/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        throw new Error('Failed to delete expense');
      }
      showNotification('Expense deleted.');
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to delete expense');
    }
  };

  const getBadgeClass = (category) => {
    const cat = category ? category.toLowerCase() : 'other';
    return `badge badge-${cat}`;
  };

  return (
    <div className="container">
      <div className="dashboard-top">
        <div className="dashboard-title">
          <h1>Expenses</h1>
          <p>Overview and recorded transactions</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          Add Expense
        </button>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <SummaryCards summary={summary} />

      <div className="filter-card">
        <div className="search-box">
          <input
            type="text"
            className="form-input"
            placeholder="Search by title or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="amount-desc">Amount (Highest First)</option>
            <option value="amount-asc">Amount (Lowest First)</option>
          </select>
        </div>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="empty-state">
            <p>Loading expenses...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon" aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="18" rx="2" />
                <line x1="8" y1="8" x2="16" y2="8" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="8" y1="16" x2="12" y2="16" />
              </svg>
            </div>
            <h3>No expenses found</h3>
            <p>
              {searchTerm || selectedCategory !== 'All'
                ? 'No items matched your current filter criteria.'
                : 'No expenses recorded yet. Create an entry to begin.'}
            </p>
            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              Add Expense
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="expenses-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => {
                  const currentId = expense._id || expense.id;
                  return (
                    <tr key={currentId}>
                      <td>
                        <div className="expense-title">{expense.title}</div>
                        {expense.notes && <div className="expense-notes">{expense.notes}</div>}
                      </td>
                      <td>
                        <span className={getBadgeClass(expense.category)}>
                          {expense.category}
                        </span>
                      </td>
                      <td>{expense.date}</td>
                      <td>
                        <span className="expense-amount">
                          ₹{Number(expense.amount).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                          <button
                            className="btn-icon btn-icon-edit"
                            onClick={() => handleOpenEditModal(expense)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-icon btn-icon-delete"
                            onClick={() => handleDeleteExpense(currentId, expense.title)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveExpense}
        expenseToEdit={expenseToEdit}
      />
    </div>
  );
};

export default DashboardPage;
