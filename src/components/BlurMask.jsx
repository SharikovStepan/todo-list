import { motion } from "motion/react";

function BlurMask() {
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-blur fixed inset-0 w-screen h-screen z-10"></motion.div>
    </>
  );
}
export default BlurMask;
