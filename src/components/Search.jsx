import { useState } from "react";

function Search(props) {
  const changeHandler = (e) => {
    const searchString = e.target.value;

    props.onChangeSearchInput(searchString);
  };

  return (
    <>
      <div className="absolute w-3xs shadow-[0px_0px_10px_#5c3a9880] bg-primary-bg opacity-95 box-sha sm:w-40 md:w-50 top-1/2 right-0 transform -translate-y-1/2 translate-x-[calc(100%+4px)] border border-primary rounded-md ">
        <input className="w-full rounded-md focus:outline-2 focus:outline-primary" onChange={changeHandler} type="text" />
        <button onClick={props.onClick} className="cursor-pointer rounded-sm absolute right-0 top-1/2 w-6 transform -translate-y-1/2 text-secondary hover:text-primary">{"X"}</button>
      </div>
    </>
  );
}
export default Search;
