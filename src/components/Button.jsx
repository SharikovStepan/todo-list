import { motion } from "motion/react";

function Button(props) {
  //   transition: { duration: 0.5, type: "spring", bounce: 0.25, damping: 10, stiffness: 100 }
  
  const classNames = `text-primary cursor-pointer block rounded-md overflow-hidden h-8 will-change-transform ${props.className}`;
  return (
    <>
      <motion.button
        animate={{ scale: 1 }}
        whileTap={{ boxShadow: "0px 0px 5px var(--color-primary)", scale: 0.95, transition: { duration: 0.1, type: "tween", ease: "linear" } }}
        whileHover={{ backgroundColor: 'var(--color-secondary)'}}
        type={props.type}
        onClick={props.onClick}
        className={classNames}>
        {props.children}
      </motion.button>
    </>
  );
}
export default Button;
