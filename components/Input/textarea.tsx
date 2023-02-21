import React from 'react'

type Props = {
  disabled:boolean,
  onChange: (e: any) => void
  className:string,
 
  placeholder : string,
  value:string,
  
  }
  
  const Textarea = ({disabled,className,placeholder,onChange,value}: Props) => {
  return (
    <textarea
    disabled={disabled}
    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 `+className}
   
    placeholder={placeholder}
   onChange={onChange}
   value={value}
    >

    </textarea>
  )
}

export default Textarea