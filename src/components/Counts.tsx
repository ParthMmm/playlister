import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import Counter from "~/components/counter";
import { formattedAtom, lengthAtom } from "~/store/app";

const Counts = ({}) => {
  const length = useAtomValue(lengthAtom);
  const formatted = useAtomValue(formattedAtom);

  if (!formatted) return null;

  return (
    <motion.div
      className="flex flex-col text-left text-zinc-900 dark:text-white "
      initial={{ opacity: 0, y: "0%" }}
      animate={{ opacity: 1, y: "0%" }}
      transition={{
        duration: 1.0,
        // delay: 1,
        ease: [0.075, 0.82, 0.165, 1],
      }}
    >
      <div>
        <span className="text-sm font-semibold ">Found</span>
        <div className="flex flex-row items-center align-middle">
          <Counter
            value={length.good}
            className="text-green-500 dark:text-green-500"
          />
          /
          <Counter value={length.good + length.good} />
          songs
        </div>
      </div>
    </motion.div>
  );
};

export default Counts;
