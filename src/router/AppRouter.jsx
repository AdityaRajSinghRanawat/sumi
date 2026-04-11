import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import ExplorePage from "../pages/ExplorePage";
import ListPropertyPage from "../pages/ListPropertyPage";
import AdminPage from "../pages/AdminPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/list-property" element={<ListPropertyPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}

export default AppRouter;