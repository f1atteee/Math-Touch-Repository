import Footer from '@src/components/Footer/Footer';
import NavBar from '@src/components/NavBar/NavBar';
import { Outlet } from 'react-router-dom';
import FloatingContactButton from "../components/ContactModal/FloatingContactButton";

const MainLayout = () => {
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh'}}>
                <NavBar/>
                <div style={{ flexGrow: 1 }}>
                    <Outlet></Outlet>
                </div>
                <Footer/>
                <FloatingContactButton/>
            </div>
        </>
    );
};

export default MainLayout;