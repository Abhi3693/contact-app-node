module.exports = (err, req, res, next) => {
  if (err.name == 'ValidationError')
    return (err = handleValidationError(err, res));
  if (err.name == 'CastError')
    return res.status(400).json({ error: 'Bad request' });
  if (err.name == 'TypeError')
    return res.status(400).json({ error: 'Contact not found' });
  if (err.code && err.code === 11000)
    return (err = handleDuplicateKeyError(err, res));

  res.status(500).json({ error: 'An unknown error occurred.' });
};

// handle duplicate phone
const handleDuplicateKeyError = (err, res) => {
  const field = Object.keys(err.keyValue);
  res.status(409).json({ error: `Contact with this ${field} already exists.` });
};

// handle field formats
const handleValidationError = (err, res) => {
  let errors = Object.values(err.errors).map((el) => el.message);
  if (errors.length > 1) {
    const allErrors = errors.join(' ');
    res.status(400).json({ error: allErrors });
  } else {
    res.status(400).json({ error: errors });
  }
};
