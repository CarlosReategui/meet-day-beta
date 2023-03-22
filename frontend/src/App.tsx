import { Route, Routes } from "react-router-dom";
import { LoginPage, MeetPage, MyMeetsPage } from "./pages";
import { ProtectedRoute } from "./utils";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/my-meets">
        <Route index element={<ProtectedRoute children={<MyMeetsPage />} />} />
        <Route
          path=":id"
          element={<ProtectedRoute children={<MeetPage />} />}
        />
      </Route>
    </Routes>
  );
}

export default App;
