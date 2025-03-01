import React from 'react'
import AddTransactionForm from '../_components/AddTransactionForm';
import { getUserAccounts } from '@/actions/dashboard';
import { defaultCategories } from '@/data/categories';

const AddTransactionPage = async () => {
  let accounts = await getUserAccounts();
  return (
    <div className="max-w-3xl mx-auto px-5">
      <h1 className="gradiant-title mb-2 text-5xl">Add Transaction</h1>
      <AddTransactionForm accounts={accounts} categories={defaultCategories} />
    </div>
  );
}

export default AddTransactionPage;;