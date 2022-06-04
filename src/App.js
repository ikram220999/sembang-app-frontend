import "./App.css";
import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "flowbite-react";

/* This example requires Tailwind CSS v2.0+ */

const socket = io("https://sembang-kari-app.herokuapp.com");
// https://sembang-kari-app.herokuapp.com
// http://localhost:3001

function App() {
  const id = socket.id;

  const [text, setText] = useState("");
  const [room, setRoom] = useState("");
  const [temRoom, setTemRoom] = useState("");
  const [data, setData] = useState([]);
  const [action, setAction] = useState(true);
  const [newUser, setNewUser] = useState("");
  const [showNewUser, setShowNewUser] = useState(false);
  const [modalShow, setModalShow] = useState(true);

  console.log("user ", socket.id);

  console.log("data", data);
  console.log(text);
  console.log(room);
  console.log("new user", newUser);

  const sendMessage = () => {
    socket.emit("send_message", { id, text, room });
    setText("");
    setData([...data, { id: socket.id, message: text }]);
  };

  const joinRoom = () => {
    setTemRoom(room);
    if (room !== "") {
      socket.emit("join_room", { id, room });
    }
  };

  const onClose = () => {
    setModalShow(false);
  }

  const newUserJoin = () => {
    socket.on("new_user_join", (user) => {
      console.log("asdasd", user);
      setNewUser(user);
      setShowNewUser(true);
    });
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

    newUserJoin();
  }, []);

  const vModal = () => {
    return (
      <React.Fragment>
        <Modal show={modalShow} onClose={onClose}>
          <Modal.Header>Instructions</Modal.Header>
          <Modal.Body className="space-y-6">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Firstly dont expect too much.
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              1. Fill in room number then click join. 
              <br />
              2. Start chatting with dudes in the same room
            </p>

            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Thankyou
            </p>

            
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setModalShow(false)}>Okay !</Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  };

  useEffect(() => {
    const timeId = setTimeout(() => {
      // After 3 seconds set the show value to false
      setShowNewUser(false);
    }, 3000);

    return () => {
      clearTimeout(timeId);
    };
  }, [newUser]);

  return (
    <div className="container rounded-lg lg:w-6/12 md:w-8/12 shadow-md m-auto my-6 sm:10/12">
      <div className="container shadow-md w-full mb-3 bg-blue-500 px-6 py-4 rounded-t-lg flex flex-row flex-wrap items-center justify-between">
        <b className="text-white text-xl">Sembang kari App</b>
        <div className="flex flex-row">
          <input
            className="border-2 border-gray-300 rounded-lg text-gray-500 py-1 px-3 outline-blue-400"
            type="number"
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
          {temRoom ? (
            <div className="w-auto py-2 px-4 mx-2 bg-indigo-800 rounded-xl text-white">
              <b>{temRoom}</b>
            </div>
          ) : (
            ""
          )}
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
      <div className="relative">
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
        {showNewUser ? (
          <div class="absolute bottom-3 inset-x-1/4 p-2 bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex">
            <span class="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">
              New
            </span>
            <span class="font-semibold mr-2 text-left flex-auto">
              <i>{newUser.user_id}</i> has joined the room
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="container m-2">
        <input
          className="border-2 border-gray-300 rounded-lg py-2 px-4 m-3 w-9/12 text-gray-500 outline-blue-100"
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
      {vModal()}
    </div>
  );
}

export default App;
