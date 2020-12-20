import { useEffect, useMemo, useState } from "react";
import io from "socket.io-client";

const useSocket = (serverHost) => {
  const socket = useMemo(
    () => io.connect(serverHost, { transports: ["websocket"] }),
    [serverHost]
  );
  const [online, setOnline] = useState(false);

  useEffect(() => {
    setOnline(socket.connected);
  }, [socket]);

  useEffect(() => {
    socket.on("connect", () => {
      setOnline(true);
    });
    return () => {
      socket.off("connect");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("disconnect", () => {
      setOnline(false);
    });
    return () => {
      socket.off("disconnect");
    };
  }, [socket]);

  return {
    socket,
    online,
  };
};

export default useSocket;
