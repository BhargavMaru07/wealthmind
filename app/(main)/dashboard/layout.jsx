import React, { Suspense } from 'react'
import DashboardPage from './page';
import { BarLoader } from 'react-spinners';
import DashboardLoading from './loading';

const DashboardLayout = () => {
  return (
    <div className="px-5">
      <h1 className="text-6xl font-bold gradiant-title mb-5">Dashboard</h1>
      {/* Dashboard Page */}
      <Suspense fallback={<DashboardLoading />}>
        <DashboardPage />
      </Suspense>
    </div>
  );
}

export default DashboardLayout;
{/* <BarLoader className='mt-4' width={"100%"} color='#9333ea'/> */}