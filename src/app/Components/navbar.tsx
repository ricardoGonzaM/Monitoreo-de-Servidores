"use client";
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import logo from "../Images/Logo1.png";
import Image from "next/image";
import { RotateCcw } from "lucide-react";
export default function Navbar() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-slate-800 bg-[#0a0b10]/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-2">
        <Image
          alt=""
          src={logo}
          className="object-cover"
          height={40}
          width={40}
          style={{
            aspectRatio: "150/150",
            objectFit: "cover",
            borderRadius: "20%",
          }}
        />
        <h1 className="text-xl font-semibold text-cyan-400">Monitoreo en Tiempo Real</h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm md:flex">
          <Clock className="h-5 w-5 text-cyan-400" />
          <span className="font-mono text-cyan-400">{currentTime}</span>
        </div>
        <button onClick={() => window.location.reload()} className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 text-cyan-400 px-3 py-1 text-sm cursor-pointer shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"><RotateCcw /> Actualizar</button>
      </div>
    </header>
  );
}
