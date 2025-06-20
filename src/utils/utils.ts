export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatAmount = (amount: number) => {
  const isNegative = amount < 0;
  const formattedAmount = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(Math.abs(amount));
  return isNegative ? `-${formattedAmount}` : formattedAmount;
};

export const getCategoryColor = (category: string) => {
  const colors = {
    'Food & Drink': '#FF5733',
    Shopping: '#33FF57',
    Transport: '#3357FF',
    Entertainment: '#FF33A1',
    Other: '#FF3333',
  };
  return colors[category as keyof typeof colors] || '#FF3333';
};
