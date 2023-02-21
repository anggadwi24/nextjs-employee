import React from 'react'

type Props = {
    errors:[],
}

const Error = ({errors}: Props) => {
if(errors)
  return (
    <>
        {errors && errors.length > 0 &&
            errors.map( (value,index) => {
                return  (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500" key={index}>{value}.</p>
                )
            })
        }
    </>
  )
}

export default Error