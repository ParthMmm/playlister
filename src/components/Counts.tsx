import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import Counter from "~/components/counter";
import { lengthAtom } from "~/store/app";

type Props = {
  formatted: boolean;
};

const Counts = ({ formatted }: Props) => {
  const length = useAtomValue(lengthAtom);

  if (!formatted) return null;

  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, y: "0%" }}
      animate={{ opacity: 1, y: "0%" }}
      transition={{
        duration: 1.3,
        ease: [0.075, 0.82, 0.165, 1],
      }}
    >
      <div>
        <span className="text-2xl font-semibold text-white">Good Songs</span>
        <Counter value={length.good} />
      </div>
      <div>
        <span className="text-2xl font-semibold text-white">Bad Songs</span>
        <Counter value={length.bad} />
      </div>
    </motion.div>
  );
};

export default Counts;
