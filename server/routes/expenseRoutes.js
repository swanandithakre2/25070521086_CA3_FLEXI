const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { authMiddleware } = require('../middleware/auth');

// All expense routes require authentication
router.use(authMiddleware);

// GET /api/expenses/summary - Get summary statistics for current user
router.get('/summary', async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });

    const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const totalTransactions = expenses.length;

    // Group by category
    const categoryTotals = {};
    expenses.forEach(item => {
      const cat = item.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(item.amount || 0);
    });

    res.json({
      totalAmount,
      totalTransactions,
      categoryTotals
    });
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ message: 'Server error calculating summary.' });
  }
});

// GET /api/expenses - Get user expenses (supports search, category filter, and sorting)
router.get('/', async (req, res) => {
  try {
    const { category, search, sortBy } = req.query;

    const query = { userId: req.user.id };

    // Filter by category
    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Filter by search keyword (title or notes)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort options
    let sortOptions = { date: -1, createdAt: -1 };
    if (sortBy === 'amount-asc') {
      sortOptions = { amount: 1 };
    } else if (sortBy === 'amount-desc') {
      sortOptions = { amount: -1 };
    } else if (sortBy === 'date-asc') {
      sortOptions = { date: 1 };
    } else {
      sortOptions = { date: -1 };
    }

    const expenses = await Expense.find(query).sort(sortOptions);
    res.json(expenses);
  } catch (error) {
    console.error('Fetch expenses error:', error);
    res.status(500).json({ message: 'Server error fetching expenses.' });
  }
});

// POST /api/expenses - Create new expense
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({ message: 'Title, amount, and category are required.' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number.' });
    }

    const newExpense = await Expense.create({
      userId: req.user.id,
      title: title.trim(),
      amount: parsedAmount,
      category: category.trim(),
      date: date || new Date().toISOString().split('T')[0],
      notes: notes ? notes.trim() : ''
    });

    res.status(201).json({
      message: 'Expense added successfully!',
      expense: newExpense
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ message: 'Server error creating expense.' });
  }
});

// PUT /api/expenses/:id - Update an existing expense
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, date, notes } = req.body;

    const updateFields = {};

    if (amount !== undefined) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number.' });
      }
      updateFields.amount = parsedAmount;
    }

    if (title !== undefined) updateFields.title = title.trim();
    if (category !== undefined) updateFields.category = category.trim();
    if (date !== undefined) updateFields.date = date;
    if (notes !== undefined) updateFields.notes = notes.trim();

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found or unauthorized.' });
    }

    res.json({
      message: 'Expense updated successfully!',
      expense: updatedExpense
    });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ message: 'Server error updating expense.' });
  }
});

// DELETE /api/expenses/:id - Delete an expense
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExpense = await Expense.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });

    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found or unauthorized.' });
    }

    res.json({ message: 'Expense deleted successfully!' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ message: 'Server error deleting expense.' });
  }
});

module.exports = router;
