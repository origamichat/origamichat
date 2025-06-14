import { useChatContext } from "../components/ChatProvider";

export const useChatSession = () => {
  const { session } = useChatContext();

  return {
    session,
  };
};
