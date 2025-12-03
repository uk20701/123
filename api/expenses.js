// api/expenses.js

let expenses = [];
let nextId = 1;

/**
 * Vercel Serverless Function handler
 * @param {import('@vercel/node').VercelRequest} req
 * @param {import('@vercel/node').VercelResponse} res
 */
export default function handler(req, res) {
  if (req.method === 'GET') {
    return handleGet(req, res);
  }

  if (req.method === 'POST') {
    return handlePost(req, res);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({
    success: false,
    error: `Method ${req.method} Not Allowed`
  });
}

// GET /api/expenses
function handleGet(_req, res) {
  return res.status(200).json({
    success: true,
    data: expenses
  });
}

// POST /api/expenses
function handlePost(req, res) {
  const { amount, description, category, date } = req.body || {};

  const errors = {};

  if (description == null || String(description).trim() === '') {
    errors.description = 'Description is required.';
  }

  if (amount == null || amount === '') {
    errors.amount = 'Amount is required.';
  } else if (isNaN(Number(amount))) {
    errors.amount = 'Amount must be a valid number.';
  }

  if (category == null || String(category).trim() === '') {
    errors.category = 'Category is required.';
  }

  if (date == null || String(date).trim() === '') {
    errors.date = 'Date is required (e.g. 2024-01-01).';
  } else {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      errors.date = 'Date is not a valid date.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed.',
      details: errors
    });
  }

  const newExpense = {
    id: String(nextId++),
    amount: Number(amount),
    description: String(description).trim(),
    category: String(category).trim(),
    date: date,
    createdAt: new Date().toISOString()
  };

  expenses.push(newExpense);

  return res.status(201).json({
    success: true,
    data: newExpense
  });
}
