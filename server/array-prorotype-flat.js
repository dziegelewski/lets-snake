Array.prototype.flat = function() {
  return this.reduce((total, item) => {
    if (Array.isArray(item)) {
      total.push(...item)
    } else {
      total.push(item)
    }
    return total;
  }, [])
}
