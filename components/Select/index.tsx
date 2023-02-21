import React from 'react'

type Props = {
    className:any,
    options:any[],
    disabled:boolean,
    value:any,
    onChange: (e: any) => void

}

const Select = ({className,options,disabled=false,value,onChange}: Props) => {
  
  return (
    <select disabled={disabled}
             className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 `+className}
             value={value}
             onChange={onChange}
    >
      <option value="" disabled={true}>Select</option>
        {options && options.length > 0 && options.map((val,index) => {
          return (
            <option key={index} value={val.value}>{val.text}</option>
          )
        })}
    </select>
  )
}

export default Select