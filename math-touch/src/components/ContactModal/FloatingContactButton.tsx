import { useState } from "react";
import { Button } from "react-bootstrap";
import { BsFillChatDotsFill } from "react-icons/bs";
import ContactModal from "./ContactModal";
import "bootstrap/dist/css/bootstrap.min.css";
import s from "./FloatingContactButton.module.scss";

function FloatingContactButton() {
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    return (
        <>
            <Button
                onClick={handleShow}
                className={s.floatingButton}
            >
                <BsFillChatDotsFill size={24} />
            </Button>

            <ContactModal show={showModal} handleClose={handleClose} />
        </>
    );
}

export default FloatingContactButton;
