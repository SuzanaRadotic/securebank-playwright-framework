export const sendMoneyData = {
  accounts: {
    checking: 'Checking',
    savings: 'Savings',
  },
  payees: {
    defaultPayee: 'Rahul Sharma',
    invalidRoutingPayee: {
      name: 'John Doe',
      bankName: 'Chase Bank',
      routingNumber: '123', // Invalid (< 9 digits)
      accountNumber: '987654321',
    },
    invalidAccountPayee: {
      name: 'Jane Smith',
      bankName: 'Bank of America',
      routingNumber: '123456789',
      accountNumber: '123', // Invalid (< 8 digits)
    },
    validNewPayee: {
      bankName: 'Chase Bank',
      routingNumber: '123456789',
      accountNumber: '987654321',
    },
  },
  amounts: {
    validTransfer: '25.00',
    exceedingBalance: '999999.00',
  },
};