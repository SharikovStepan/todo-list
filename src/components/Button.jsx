function Button(props) {
  const classNames = ["text-primary", "cursor-pointer", "block", "rounded-md", props.className.join(" ")];
  return (
    <>
      <button type={props.type} onClick={props.onClick} className={classNames.join(" ")}>{props.children}</button>
    </>
  );
}
export default Button;
