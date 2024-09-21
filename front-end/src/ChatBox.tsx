import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useState } from "react";
import React from "react";

interface Message {
  message: string;
  isUser: boolean;
  sources?: string[];
}

const ChatBox = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const setPartialMessage = (chunk: string, sources: string[] = []): void => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      if (prevMessages.length === 0 || !lastMessage.isUser) {
        return [
          ...prevMessages.slice(0, -1),
          {
            message: lastMessage.message + chunk,
            isUser: false,
            sources: lastMessage.sources
              ? [...lastMessage.sources, ...sources]
              : sources,
          },
        ];
      }

      return [...prevMessages, { message: chunk, isUser: false, sources }];
    });
  };
  function formatSource(source: string) {
    return source.split("/").pop() || "";
  }
  const handleReceiveMessage = (data: string) => {
    const parsedData = JSON.parse(data);

    if (parsedData.answer) {
      setPartialMessage(parsedData.answer.content);
    }

    if (parsedData.docs) {
      setPartialMessage(
        "",
        parsedData.docs.map((doc: any) => doc.metadata.source)
      );
    }
  };
  const handleSendMessage = async (message: string) => {
    setInputValue("");

    setMessages((prevMessage) => [...prevMessage, { message, isUser: true }]);

    await fetchEventSource(`${"http://localhost:8000"}/rag/stream`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        input: {
          question: message,
        },
      }),
      onmessage(event) {
        if (event.event === "data") {
          handleReceiveMessage(event.data);
        }
      },
    });
  };
  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSendMessage(inputValue.trim());
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 text-white text-center p-4">
        Contract Q&A Chat Bot Assistance
      </header>
      <main className="flex-grow container mx-auto p-4 flex-col">
        <div className="flex-grow bg-gray-700 shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-600 p-4">
            {/* message */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 my-3 rounded-lg text-white ml-auto ${
                  msg.isUser ? "bg-gray-800" : "bg-gray-900"
                }`}
              >
                {msg.message}
                {/*  Source */}
                {!msg.isUser && (
                  <div className={"text-xs"}>
                    <hr className="border-b mt-5 mb-5"></hr>
                    {msg.sources?.map((source, index) => (
                      <div key={index}>
                        <a
                          target="_blank"
                          download
                          href={`${"http://localhost:8000"}/rag/static/${encodeURI(
                            formatSource(source)
                          )}`}
                          rel="noreferrer"
                        >
                          {formatSource(source)}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-800">
            <textarea
              className="form-textarea w-full p-2 border rounded text-white
             bg-gray-900 border-gray-600 resize-none h-auto"
              placeholder="Enter your question here..."
              onKeyUp={handleKeyPress}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            ></textarea>
            <button
              className="mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleSendMessage(inputValue.trim())}
            >
              Send
            </button>
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 text-white text-center p-4 text-xs">
        10 Academy
      </footer>
    </div>
  );
};

export default ChatBox;
