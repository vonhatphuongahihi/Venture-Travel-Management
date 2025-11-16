import { useMutation } from "@tanstack/react-query";
import ContactAPI from "./contactAPI";

export const useSendContactMessage = () => {
  return useMutation({
    mutationFn: ContactAPI.sendMessage,
  });
};
