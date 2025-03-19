import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "../pages/Auth/Auth";
import MainLayout from "../pages/MainLayout";
import Contact from "@src/components/Contact/Contact";
import Home from "@src/components/Home/Home";
import AlgebraData from "@src/components/AlgebraData/AlgebraData";
import GeometryData from "@src/components/GeometryData/GeometryData";

export const useRoutes = (isAuthorized: boolean) => {
    if(!isAuthorized){
        return (
            <Routes>
                <Route path="*" element={<Navigate to="/auth" replace />} />
                <Route path="/auth" element={<Auth />} />
            </Routes>
        )
    }
    return (
        <Routes>
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/" element={<MainLayout />}>
                <Route path="" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/algebra/:id" element={<AlgebraData/>} />  {/* Динамічний маршрут для algebra */}
                <Route path="/geometry/:id" element={<GeometryData/>} />  {/* Динамічний маршрут для geometry */}
            </Route>
        </Routes>
    );
}
