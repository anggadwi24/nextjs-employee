import Main from "@/components/Layouts/Main";
import React, { useState } from "react";

type Props = {};

const Index = (props: Props) => {
  const [search,setSearch] = useState('');
  const breadcrumb = [{ name: "User", url: "/users" }];
  return (
    <>
      <Main title={"Users"} breadcrumb={breadcrumb} page={"Users"}>
        <div className="justify-between mb-4">
            <input type="text" onChange={ (e) => setSearch(e.target.value)} value={search} placeholder="Search" className="bg-gray-50 border border-gray-300 block  text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500  p-1" />
        </div>
        <div className="relative overflow-x-auto ">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                    Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                    Role
                </th>
                <th scope="col" className="px-6 py-3">
                 #
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4"
                >
                  Apple MacBook Pro 17"
                </th>
                <td className="px-6 py-4">Silver</td>
                <td className="px-6 py-4">Laptop</td>
                <td className="px-6 py-4">$2999</td>
              </tr>
             
            </tbody>
          </table>
        </div>
      </Main>
    </>
  );
};

export default Index;
