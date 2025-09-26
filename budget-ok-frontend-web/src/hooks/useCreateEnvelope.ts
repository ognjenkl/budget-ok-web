import {useMutation} from "@tanstack/react-query";
import {message} from "antd";
import {AxiosError} from "axios";
import createEnvelope from "../components/CreateEnvelopeForm/createEnvelope";

export default function useCreateEnvelopoe() {

  return useMutation({
    mutationFn: createEnvelope,
    onSuccess: () => {
      message.success("Envelope created successfully!");
    },
    onError: (error: AxiosError) => {
      const {response} = error;
      if (!response) {
        message.error("Network error, please try again later!");
        return;
      }
      const {status} = response;
      if (status === 400) {
        message.error("Envelope with this name already exists!");
        return;
      }
      message.error("Fail to create envelope!")
    }
  });
}