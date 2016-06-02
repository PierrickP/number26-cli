module.exports = {
  currencyT: function currencyT(c) {
    const currencies = {
      EUR: '€',
      GBP: '£',
      SEK: 'kr',
      PLN: 'zł',
      CHF: 'CHF',
      DKK: 'kr',
      NOK: 'kr',
      USD: '$',
      CZK: 'Kč',
      INR: 'Rs',
      CAD: '$',
      AUD: '$',
      HUF: 'Ft',
      BGN: 'лв',
      GEL: 'gel', // ლ
      RON: 'lei'
    };

    return currencies[c];
  },

  categoryT: function categoryT(c) {
    const categories = {
      'macro-bbu': 'CASH26 Deposit',
      'micro-insurance': 'Insurance',
      'micro-leisure': 'Leisure',
      'micro-transport': 'Transport',
      'micro-education': 'Education',
      'micro-atm': 'ATM',
      'micro-miscellaneous': 'Miscellaneous',
      'micro-healthcare-drugstores': 'Healthcare & Drug Stores',
      'macro-bub': 'CASH26 Withdraw',
      'micro-finance': 'Finance',
      'micro-housing-energy': 'Housing & Energy',
      'micro-groceries': 'Groceries',
      'macro-ct': 'Income',
      'micro-shopping': 'Shopping',
      'macro-dd': 'Direct debits',
      'macro-tub': 'Foreign Currency Transfer',
      'macro-wu': 'N26 Referrals',
      'micro-salary': 'Salary',
      'micro-car': 'Car',
      'micro-business': 'Business expenses' ,
      'micro-bars-restaurants': 'Bars & Restaurants',
      'micro-multimedia': 'Multimedia & Telecom',
      'macro-dr': 'Direct debit reversals',
      'macro-ft': 'MoneyBeam',
      'macro-dt': 'Outgoing transfers',
      'micro-children': 'Children',
      'micro-tax-fines': 'Tax & Fines'
    }

    return categories[c];
  }
};
