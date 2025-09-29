import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "../pages/Auth/Auth";
import MainLayout from "../pages/MainLayout";
import Contact from "@src/components/Contact/Contact";
import Home from "@src/components/Home/Home";
<<<<<<< Updated upstream
import UniversalMathComponent from "@src/components/UniversalMathComponent/UniversalMathComponent";
=======
import OwnTests from "@src/pages/OwnTests/OwnTests";
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/" element={<MainLayout />}>
                <Route path="" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Універсальний компонент для Algebra */}
                <Route
                    path="/algebra/:id"
                    element={
                        <UniversalMathComponent
                            typeMath={1}
                            fetchUrl="http://localhost:8082/api/Algebra/GetAlgebraDataById"
                        />
                    }
                />

                {/* Універсальний компонент для Geometry */}
                <Route
                    path="/geometry/:id"
                    element={
                        <UniversalMathComponent
                            typeMath={2}
                            fetchUrl="http://localhost:8082/api/Geometry/GetGeometryDataById"
                            fetchImagesUrl="http://localhost:8082/api/Image/GetImagesForThem"
                        />
                    }
                />
            </Route>
        </Routes>
=======
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/" element={<MainLayout />}>
            <Route path="" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/owntest" element={<OwnTests />} />
        </Route>
    </Routes>
>>>>>>> Stashed changes
    );
};
