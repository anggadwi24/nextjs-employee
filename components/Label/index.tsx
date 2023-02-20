import React from 'react'

type Props = {
    children:any,
    className:"",
}

const Label = ({children,className}: Props) => {
  return (
    <label className={`block mb-2 text-sm font-medium text-gray-900 dark:text-white` +className}>{children}</label>
  )
}

export default Label