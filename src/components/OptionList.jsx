function OptionList(props) {
  return (
    <>
      <div>
        <label htmlFor={props.optionName} className="block">
          {props.children}
        </label>
        <div className="rounded-sm">
          <select
            id={props.optionName}
            name={props.optionName}
            value={props.value}
            onChange={props.onChange}
            className="bg-secondary-bg rounded-sm focus:outline-2 focus:outline-primary focus:ring-primary focus:border-primary block w-full">
            {props.options.map((optionItem, index) => {
              return (
                <option key={`${props.optionName}-option_${index}`} value={optionItem.id}>
                  {optionItem.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </>
  );
}
export default OptionList;
