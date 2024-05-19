
import { create } from "zustand";
import io from "socket.io-client";
import {ipAddress} from "../env"


// const socket = io(`http://192.168.137.211:8000`);
const socket = io(`http://${ipAddress}:8000`);
const useConversation = create((set) => ({

  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  socket: socket,
  receiver: {
    _id: null,
    name: null,
    avatar: null,
  },
  setReceiver: (receiver) => set({ receiver }),
}));
socket.on("connect", () => {
  console.log("Connected to the Socket server");
});
//export { useConversation, socket };
export { useConversation, socket };
export default useConversation;

// import { create } from "zustand";

// const useConversation = create((set) => ({

//   selectedConversation: null,
//   setSelectedConversation: (selectedConversation) =>
//     set({ selectedConversation }),
//   messages: [],
//   setMessages: (messages) => set({ messages }),
// receiver: {
//   _id: null,
//   name: null,
//   avatar: null,
// },
// setReceiver: (receiver) => set({ receiver }),
// }));

// export default useConversation;
