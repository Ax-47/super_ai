"use client";
import { useState } from "react";
import { api } from "./libs/eden";
import Image from "next/image";

export default function ChatPage() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpenSideBar, setIsOpenSideBar] = useState(false);

  const handleSidebar = async (e: React.FormEvent) => {
    setIsOpenSideBar(!isOpenSideBar);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOutput("");
    setLoading(true);
    const { data, error } = await api.chat.post({ prompt });

    if (!data || error) {
      setOutput("❌ Error connecting to chat stream");
      setLoading(false);
      return;
    }

    for await (const chunk of data) {
      const line = chunk.trim();
      if (line.startsWith("data:")) {
        const json = line.replace("data:", "").trim();
        try {
          const parsed = JSON.parse(json);
          setOutput(
            (prev) =>
              prev +
              (typeof parsed === "string" ? parsed : parsed.msg ?? "") +
              "\n"
          );
        } catch (err) {
          console.error("Failed to parse SSE chunk:", err);
        }
      }
    }
    setLoading(false);
  };

  return (
    <main className="p-8 font-sans">
      {/* Sidebar */}
      <div className="relative ">
        <div
          className="absolute flex items-center space-x-2"
          onClick={handleSidebar}
        >
          <Image src="/menu.svg" alt="Menu" width={60} height={60} />
        </div>
        {isOpenSideBar && (
          <div className="absolute flex flex-col space-y-4 mb-8">
            <div
              className=" flex items-center space-x-2"
              onClick={handleSidebar}
            >
              <Image src="/menu.svg" alt="Menu" width={60} height={60} />
            </div>
            <h1 className="flex items-center space-x-2 text-xl font-semibold">
              <Image src="/message.svg" alt="Message" width={30} height={30} />
              <span>New chat</span>
            </h1>
            <h1 className="flex items-center space-x-2 text-xl">
              <Image src="/clock.svg" alt="History" width={30} height={30} />
              <span>History</span>
            </h1>
            <h1 className="flex items-center space-x-2 text-xl">
              <Image src="/setting.svg" alt="Setting" width={30} height={30} />
              <span>Setting</span>
            </h1>
            <h1 className="flex items-center space-x-2 text-xl">
              <Image src="/alert.svg" alt="Alert" width={30} height={30} />
              <span>About</span>
            </h1>
            <Image src="/person.svg" alt="Person" width={30} height={30} />
          </div>
        )}
      </div>

      {/* Logo and Header */}
      <div className="flex items-center space-x-4 mb-4">
        <Image src="/KKU.png" alt="KKU Logo" width={60} height={60} />
        <h1 className="text-3xl font-bold">KKU Chatbot</h1>
      </div>

      <h2 className="text-xl mb-4">
        Welcome!{" "}
        <span className="text-blue-600 font-semibold">Do you need help?</span>
      </h2>

      {/* Categories */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 border rounded-lg flex items-center justify-center">
          <Image src="/document.svg" alt="Document" width={40} height={40} />
        </div>
        <div className="p-4 border rounded-lg flex items-center justify-center">
          <Image src="/map.svg" alt="Map" width={40} height={40} />
        </div>
        <div className="p-4 border rounded-lg flex items-center justify-center">
          <Image src="/box.svg" alt="Box" width={40} height={40} />
        </div>
        <div className="p-4 border rounded-lg flex items-center justify-center"></div>
        <div className="p-4 border rounded-lg flex items-center justify-center"></div>
      </div>

      {/* Chat Box */}
      <div className="bg-black-300 p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-2 mb-4">
          <Image src="/plus.svg" alt="Plus" width={30} height={30} />
          <span className="text-lg font-medium">Chat Output</span>
        </div>

        <pre className="whitespace-pre-wrap bg-gray p-4 rounded-md min-h-[200px] mb-4">
          {output || "No output yet."}
        </pre>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-4"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt"
            required
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-[300px]"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? "Streaming..." : "Send"}
          </button>
        </form>
        <div className="flex items-center">
          <Image
            src="/microphone.svg"
            alt="Microphone"
            width={30}
            height={30}
          />
        </div>
      </div>
    </main>
  );
}
