import React from 'react'

const AuthLayout = ({children}) => {
  return (
    <div className='flex h-screen w-screen justify-center items-center'>{children}</div>
  )
}
export default AuthLayout;