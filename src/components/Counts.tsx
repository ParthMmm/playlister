import { useAtomValue } from "jotai";
import Counter from "~/components/counter";
import { formattedAtom, lengthAtom } from "~/store/app";

const Counts = ({}) => {
  const length = useAtomValue(lengthAtom);
  const formatted = useAtomValue(formattedAtom);

  if (!formatted) return null;

  return (
    <div className="flex flex-col  text-left text-zinc-900 dark:text-white ">
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
  );
};

export default Counts;
