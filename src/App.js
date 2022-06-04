import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

/* This example requires Tailwind CSS v2.0+ */

const socket = io("https://sembang-kari-app.herokuapp.com");

function App() {
  const [text, setText] = useState("");
  const [room, setRoom] = useState("");
  const [data, setData] = useState([]);
  const [action, setAction] = useState(true);

  console.log("user ", socket.id);

  const id = socket.id;

  console.log("data", data);
  console.log(text);
  console.log(room);

  const sendMessage = () => {
    socket.emit("send_message", { id, text, room });
    setText("");
    setData([...data, { id: socket.id, message: text }]);
  };

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      console.log("rcv", msg);
      setData((prev) => [
        ...prev,
        {
          id: msg.user_id,
          message: msg.msg,
        },
      ]);
    });
  }, [action]);

  return (
    <div className="container rounded-lg lg:w-6/12 md:w-8/12 shadow-md m-auto my-6 sm:10/12">
      <div className="container shadow-md w-full mb-3 bg-blue-500 px-6 py-4 rounded-t-lg flex flex-row items-center justify-between">
        <b className="text-white text-xl">Sembang kari App</b>
        <div>
          <input
            className="border-2 border-gray rounded-lg text-gray-500 py-1 px-3 outline-blue-400"
            type="text"
            placeholder="room no"
            onChange={(e) => {
              setRoom(e.target.value);
            }}
          ></input>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 ml-2 rounded-lg"
            onClick={joinRoom}
          >
            Join
          </button>
        </div>
      </div>
      {/* <div className="container flex flex-row gap-x-1.5 justify-center items-center">
        <div className="bg-blue-300 py-2 px-4 rounded-full text-blue-600">
          Room 1
        </div>
        <div className="bg-blue-300 py-2 px-4 rounded-full text-blue-600">
          Room 2
        </div>
        <div className="bg-blue-300 py-2 px-4 rounded-full text-blue-600">
          Room 3
        </div>
        <div className="bg-blue-300 py-2 px-4 rounded-full text-blue-600">
          Room 4
        </div>
      </div> */}

      <div className="container shadow-md h-96 mt-2 py-3 px-3 overflow-y-scroll">
        {/* {data.map((da) => (
        <p>{da.message}</p>
      ))} */}
        <div className="container mt-2 py-3 ">
          {data.map((da) =>
            da.id === socket.id ? (
              <div className="w-fit py-3 px-4 pr-10 bg-blue-300 max-w-sm shadow-sm rounded-2xl mb-2">
                <p>{da.message}</p>
              </div>
            ) : (
              <div className="w-fit py-3 px-4 pr-10 bg-blue-100 max-w-sm shadow-sm rounded-2xl mb-2">
                <p>{da.message}</p>
              </div>
            )
          )}
        </div>
      </div>

      <div className="container m-2">
        <input
          className="border-2 border-gray rounded-lg py-2 px-4 m-3 w-9/12 text-gray-500 outline-blue-400"
          type="text"
          placeholder="Message ..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        ></input>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 w-2/12 rounded-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
    
  );
}

export default App;
