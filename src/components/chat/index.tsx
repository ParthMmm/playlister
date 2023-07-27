import { useCompletion } from "ai/react";
import { useAtomValue } from "jotai";
import { Loader2 } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";
import { Button } from "~/components/ui/button";
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

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="input" className="mb-1 block text-sm font-medium ">
        Songs
      </label>

      <Textarea
        name="songsContent"
        value={input}
        onChange={handleInputChange}
        id="input"
      />
      <div className="flex justify-end">
        <Button type="submit" className="mt-2" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="flex h-4 w-8 grow animate-spin" />
          ) : (
            <span>Submit</span>
          )}
        </Button>
      </div>
    </form>
  );
}
