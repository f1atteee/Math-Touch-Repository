import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "../pages/Auth/Auth";
import MainLayout from "../pages/MainLayout";
import Contact from "@src/components/Contact/Contact";
import Home from "@src/components/Home/Home";
import Notes from "@src/components/Notes/Notes";
import UniversalMathComponent from "@src/components/UniversalMathComponent/UniversalMathComponent";
import { OwnTests } from "@src/pages/OwnTests/OwnTests"; 
import { ALGEBRA_GET_BY_ID_URL, GEOMETRY_GET_BY_ID_URL, IMAGES_GET_FOR_THEM_URL } from "@src/config/api";

export const useRoutes = (isAuthorized: boolean) => {
    if (!isAuthorized) {
        return (
            <Routes>
                <Route path="*" element={<Navigate to="/auth" replace />} />
                <Route path="/auth" element={<Auth />} />
            </Routes>
        );
    }
    return (
        <Routes>
            <Route path="*" element={<Navigate to="/" replace />} /> 
            
            <Route path="/" element={<MainLayout />}>
                <Route path="" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/owntest/*" element={<OwnTests />} /> 
                <Route path="/notate" element={<Notes />} /> 

                {/* Універсальний компонент для Algebra */}
                <Route
                    path="/algebra/:id"
                    element={
                        <UniversalMathComponent
                            typeMath={1}
                            fetchUrl={ALGEBRA_GET_BY_ID_URL}
                        />
                    }
                />

                {/* Універсальний компонент для Geometry */}
                <Route
                    path="/geometry/:id"
                    element={
                        <UniversalMathComponent
                            typeMath={2}
                            fetchUrl={GEOMETRY_GET_BY_ID_URL}
                            fetchImagesUrl={IMAGES_GET_FOR_THEM_URL}
                        />
                    }
                />
            </Route>
        </Routes>
    );
};