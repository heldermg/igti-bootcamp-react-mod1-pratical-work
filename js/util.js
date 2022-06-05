function priceConverter(value) {
  if (value) {
    return "R$ " + applyFactor(value, 5.5);
  }
  return "R$ 0.00";
}

function applyFactor(value, factor) {
  if (value && factor) {
    return (value * factor).toFixed(2);
  }
  return 0;
}

function filterWithDelay(fn, delay) {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  };
}
