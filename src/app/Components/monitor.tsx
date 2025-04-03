"use client";

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const socket = io("http://localhost:4000");

export default function Monitoreo() {
  interface SystemStats {
    time: string;
    cpu: number;
    memory: number;
    network: number;
    disk: number;
  }

  const [data, setData] = useState<SystemStats[]>([]);

  useEffect(() => {
    socket.on("systemStats", (stats) => {
      setData((prev) => [
        ...prev.slice(-20),
        {
          time: new Date().toLocaleTimeString(),
          cpu: parseFloat(stats.cpu),
          memory: parseFloat(stats.memory),
          network:
            parseFloat(stats.network.upload) + parseFloat(stats.network.download), // Sumar subida y bajada
          disk: parseFloat(stats.disk),
        },
      ]);
    });

    return () => {
      socket.off("systemStats");
    };
  }, []);

  return (
    <section className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-1">
        <div className="relative group overflow-hidden rounded-2xl bg-[#0d111d] shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/10 border-2 border-gray-800">
          <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70"></div>
          <div className="absolute -right-16 -bottom-16 h-32 w-32 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/0 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-70"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-semibold text-white">
                    Monitoreo Del Sistema En Tiempo Real
                  </h3>
                  <p className="text-sm text-slate-400">Analizando...</p>
                  <ResponsiveContainer width="101%" height={300}>
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis stroke="#00d3f3" dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="cpu"
                        stroke="#ff7300"
                        name="CPU (%)"
                      />
                      <Line
                        type="monotone"
                        dataKey="memory"
                        stroke="#387908"
                        name="Memoria (%)"
                      />
                      <Line
                        type="monotone"
                        dataKey="network"
                        stroke="#0033cc"
                        name="Red (KB/s)"
                      />
                      <Line
                        type="monotone"
                        dataKey="disk"
                        stroke="#cc0000"
                        name="Disco (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}