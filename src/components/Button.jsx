import { motion } from "motion/react";

function Button(props) {
  // props.className.join(" ")];
//   const size = 
  const variants = {
    initial: {
      width: 0,
      paddingRight: 0,
      paddingLeft: 0,
      marginLeft: 0,
      marginTop: 0,
    },
    animate: {
      scale: 1,
      width: props.width,
      paddingRight: "0.5rem",
      paddingLeft: "0.5rem",
      marginLeft: props.toRight ? 20 : 0,
		marginTop: props.toBottom ? 20 : 0,
      opacity: 1,
      transition: { duration: 0.5, type: "spring", bounce: 0.25, damping: 10 },
    },
    exit: { width: 0, paddingRight: 0, paddingLeft: 0, marginLeft: 0, marginTop: 0, transition: { duration: 0.3, type: "tween", ease: "linear" } },
  };
  const classNames = `text-primary cursor-pointer block rounded-md overflow-hidden ${props.className}`;
  return (
    <>
      <motion.button
        layout={props.isLayout ? true : false}
        initial={props.isInitial ? "initial" : false}
        variants={variants}
        animate="animate"
        exit="exit"
        whileTap={{ boxShadow: "0px 0px 5px var(--color-primary)", scale: 0.97, transition: { duration: 0.1, type: "tween", ease: "linear" } }}
        type={props.type}
        onClick={props.onClick}
        className={classNames}
        key={props.motionKey}>
        {props.children}
      </motion.button>
    </>
  );
}
export default Button;
