import { useChat } from "ai/react";
import { Textarea } from "~/components/ui/textarea";

export default function Chat() {
  const { messages, handleSubmit, input, handleInputChange } = useChat();

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
      {messages.map((message, i) => (
        <div key={i}>{message.content}</div>
      ))}
    </form>
  );
}
