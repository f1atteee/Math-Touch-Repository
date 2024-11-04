import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "../pages/Auth/Auth"
import MainLayout from "../pages/MainLayout";
import Contact from "@src/components/Contact/Contact";
import Home from "@src/components/Home/Home";

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
        </Route>
    </Routes>
    );
}