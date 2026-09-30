export const commonErrors = {
  frozenAccount: 'Account Frozen:Money movement actions are disabled while your account is frozen. Please contact support.',
  requiredAmount: 'Please enter a valid amount.',
  insufficientFunds: /Insufficient funds\. Available balance: \$[0-9,]+\.\d{2}\./,
} as const;

export const loginErrors = {
  requiredUsername: 'Please enter your username.',
  requiredPassword: 'Please enter your password.',
  invalidCredentials: 'The username or password you entered is incorrect.',
  lockedAccount: 'Your account has been suspended. Please contact support.',
} as const;

export const accountsErrors = {
  requiredAccountName: 'Please enter an account name.',
  requiredAccountType: 'Please select an account type.',
  requiredStartingBalance: 'Please enter a valid starting balance.',
  requiredTermsAndConditions: 'Please accept the terms and conditions to continue.',
  noMatchingResults: 'No accounts found.'
} as const;

export const transferErrors = {
  requiredFromAccount: 'Please select a From account.',
  requiredToAccount: 'Please select a To account.',
} as const;

export const sendMoneyErrors = {
  requiredAccount: 'Please select an account.',
  requiredPayee: 'Please select a payee.',
  invalidRoutingNumber: 'Routing number must be exactly 9 digits.',
  invalidAccountNumber: 'Account number must be 8–17 digits.',
  sendingDisabled: 'Sending money is disabled while your account is frozen.'
} as const;

export const transactionsErrors = {
  noMatchingResults: 'No transactions match your filters.',
} as const;