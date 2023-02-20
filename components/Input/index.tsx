import React from 'react'

type Props = {
  disabled:false,
  className:any,
  type : any,
  placeholder : any,
  props:any

}

const Index = ({disabled,className,type,placeholder,...props}: Props) => {
  return (
    <input
    disabled={disabled}
    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 `+className}
    type={type}
    placeholder={placeholder}
    {...props}
/>
  )
}

export default Index