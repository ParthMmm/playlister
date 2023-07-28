import { useCompletion } from "ai/react";
import { useSetAtom } from "jotai";
import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { formattedAtom, promptAtom } from "~/store/app";

type Props = {
  userId: string;
};

export default function Chat({ userId }: Props) {
  const setFormatted = useSetAtom(formattedAtom);
  const setPrompt = useSetAtom(promptAtom);

  const { input, isLoading, handleInputChange, handleSubmit } = useCompletion({
    api: "/api/chat",
    body: {
      userId,
    },
    onFinish: (prompt, completion) => {
      console.log({ completion });
      setFormatted(true);
      setPrompt(prompt);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <label
        htmlFor="input"
        className="sr-only mb-1 block text-sm font-medium "
      >
        Songs
      </label>

      <Textarea
        name="songsContent"
        value={input}
        onChange={handleInputChange}
        id="input"
      />
      <div className="flex justify-end">
        <Button type="submit" className="mt-4" disabled={isLoading || !userId}>
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
