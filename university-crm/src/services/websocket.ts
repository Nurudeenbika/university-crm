import { io, Socket } from "socket.io-client";
import { toast } from "react-hot-toast";

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(import.meta.env.VITE_WS_URL || "http://localhost:8000", {
      auth: { token },
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    this.socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    this.socket.on("notification", (data) => {
      toast.success(data.message);
      this.emit("notification", data);
    });

    this.socket.on("grade_updated", (data) => {
      toast(`Grade updated for ${data.assignment}`);
      this.emit("grade_updated", data);
    });

    this.socket.on("enrollment_status", (data) => {
      const status = data.status === "APPROVED" ? "approved" : "rejected";
      toast[data.status === "APPROVED" ? "success" : "error"](
        `Enrollment ${status} for ${data.course}`
      );
      this.emit("enrollment_status", data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  joinRoom(room: string) {
    this.socket?.emit("join_room", room);
  }

  leaveRoom(room: string) {
    this.socket?.emit("leave_room", room);
  }
}

export const wsService = new WebSocketService();
