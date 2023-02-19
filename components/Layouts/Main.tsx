import Head from "next/head";
import React from "react";
import Sidebar from "./Sidebar";
import Link from "next/link";

type Props = {
  children: any;
  title: any;
  breadcrumb: any;
  page: any;
};

const Main = ({ children, title, breadcrumb, page }: Props) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {/* <Sidebar/> */}

      
        <div className="flex content-start w-full">
          <Sidebar />

          <div className="justify-start p-3 w-full">
            <h1 className="text-2xl">{page}</h1>
            <ol className="mt-3 inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  href="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  Home
                </Link>
              </li>
              {breadcrumb &&
                breadcrumb.length > 0 &&
                breadcrumb.map((value: any, index: any) => {
                  return (
                    <li key={index}>
                      <div className="flex items-center">
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <Link
                          href={value.url}
                          className="ml-1 text-sm font-medium text-gray-700 hover:text-gray-900 md:ml-2 dark:text-gray-400 dark:hover:text-white"
                        >
                          {value.name}
                        </Link>
                      </div>
                    </li>
                  );
                })}
            </ol>
            <div className="w-full my-4 mx-3">
            {children}
            </div>
            
          </div>
        </div>
      
    </>
  );
};

export default Main;
