import { SocketProvider } from "./context/SocketContext";
import MapView from "./views/MapView";

const App = () => {
  return (
    <SocketProvider>
      <MapView />
    </SocketProvider>
  );
};

export default App;
