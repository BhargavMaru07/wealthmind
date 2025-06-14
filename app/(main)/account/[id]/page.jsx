import { getAccountWithTransaction } from '@/actions/accounts';
import NotFound from '@/app/not-found';
import React, { Suspense } from 'react'
import TransactionPage from '../_components/transactionPage';
import { BarLoader } from 'react-spinners';
import AccountChart from '../_components/AccountChart';

const AccountsPage = async ({params}) => {

  const { id } = await params; 
  let accountData = await getAccountWithTransaction(id);

  if(!accountData){
    NotFound();
  }

  const {transactions,...account} = accountData

  return (
    <div className="space-y-8 px-5">
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold gradiant-title capitalize">
            {account.name}
          </h1>
          <p className="text-muted-foreground">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </div>
        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold">
            ${parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {account._count.transactions}Transactions
          </p>
        </div>
      </div>
      {/* Chart section */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <AccountChart transactions={transactions} />
        <TransactionPage transactions={transactions} />
      </Suspense>

      {/* Transaction Table */}
      {/* <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <TransactionPage transactions={transactions} />
      </Suspense> */}
    </div>
  );
}

export default AccountsPage;  