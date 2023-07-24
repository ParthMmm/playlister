import { useCompletion } from "ai/react";
import { useAtomValue } from "jotai";
import { type Dispatch, type SetStateAction } from "react";
import { Textarea } from "~/components/ui/textarea";
import { tokenAtom } from "~/store/app";
import { api } from "~/utils/api";

type Props = {
  userId: string;
  setFormatted: Dispatch<SetStateAction<boolean>>;
};

export default function Chat({ userId, setFormatted }: Props) {
  const token = useAtomValue(tokenAtom);

  const {
    completion,
    input,
    stop,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    api: "/api/chat",
    body: {
      userId,
    },
    onFinish: (prompt, completion) => {
      console.log({ completion });
      setFormatted(true);
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="input">Songs</label>

      <Textarea
        name="songsContent"
        value={input}
        onChange={handleInputChange}
        id="input"
      />

      <button type="submit">Submit</button>
      <div>{completion}</div>
    </form>
  );
}
