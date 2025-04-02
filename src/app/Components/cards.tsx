"use client";
import React, { useEffect, useState } from "react";
import { Cpu, Database, HardDrive, ArrowDownUp } from "lucide-react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export const Cards = () => {
  const [stats, setStats] = useState({
    cpu: "0",
    memory: "0",
    disk: "0",
    network: { upload: "0 KB/s", download: "0 KB/s" },
  });

  const [cpuModel, setCpuModel] = useState("Cargando...");
  const [memoryTotal, setMemoryTotal] = useState("Cargando...");
  const [diskTotal, setDiskTotal] = useState("Cargando...");
  const [networkTotal, setNetworkTotal] = useState("Cargando...");

  useEffect(() => {
    socket.on("systemStats", (data) => {
      setStats({
        cpu: data.cpu,
        memory: data.memory,
        disk: data.disk,
        network: {
          upload: data.network.upload,
          download: data.network.download,
        },
      });
    });

    socket.on("cpuInfo", (data) => setCpuModel(data.model));
    socket.on("memoryInfo", (data) => setMemoryTotal(data.total));
    socket.on("diskInfo", (data) => setDiskTotal(data.total));
    socket.on("networkInfo", (data) =>
      setNetworkTotal(`⬆ ${data.upload}, ⬇ ${data.download}`)
    );

    return () => {
      socket.off("systemStats");
      socket.off("cpuInfo");
      socket.off("memoryInfo");
      socket.off("diskInfo");
      socket.off("networkInfo");
    };
  }, []);

  const caracteristicas = [
    {
      title: "CPU",
      iconComponent: Cpu,
      value: cpuModel,
      porcent: stats.cpu + "%",
    },
    {
      title: "Memoria",
      iconComponent: Database,
      value: memoryTotal,
      porcent: stats.memory + "%",
    },
    {
      title: "Disco",
      iconComponent: HardDrive,
      value: diskTotal,
      porcent: stats.disk + "%",
    },
    {
      title: "Red",
      iconComponent: ArrowDownUp,
      value: networkTotal,
      porcent: "-",
    },
  ];

  return (
    <section className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-3 mt-3">
        {caracteristicas.map((item, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-2xl bg-[#0d111d] shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/10 border-2 border-gray-800"
          >
            <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70"></div>
            <div className="absolute -right-16 -bottom-16 h-32 w-32 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70"></div>

            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-600 opacity-30 blur-sm transition-opacity duration-300 group-hover:opacity-40"></div>
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900">
                      {React.createElement(item.iconComponent, {
                        className: "h-6 w-6 text-cyan-600",
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-slate-400">{item.value}</p>
                  </div>
                </div>

                {item.porcent !== "-" && (
                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-cyan-500">
                      <span className="h-1 w-1 rounded-full bg-cyan-500"></span>
                      {item.porcent}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Cards;
