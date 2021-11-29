const ToCurrency = function(number) {
  return Intl.NumberFormat('en-IN', { style: 'currency', currency: 'CAD' }).format(number, 2);
};
exports.ToCurrency = ToCurrency;
