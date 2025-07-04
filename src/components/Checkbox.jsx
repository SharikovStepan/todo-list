function Checkbox(props) {
  return (
    <>
      <label className="flex items-center border border-transparent rounded-sm hover:border-secondary cursor-pointer">
        <input checked={props.checked} id={props.id} type="checkbox" onChange={props.onChange} className="sr-only peer" />
        <div className="w-5 h-5 border border-zinc-700 rounded-sm peer-checked:bg-secondary"></div>
        <svg className="absolute w-4 h-4 ml-0.5 text-slate-200 opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M5 13l4 4L19 7" strokeWidth="2" />
        </svg>
      </label>
    </>
  );
}
export default Checkbox;
