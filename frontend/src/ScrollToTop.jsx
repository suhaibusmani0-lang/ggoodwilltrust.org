import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Har baar jab URL (pathname) change hoga, page top par scroll ho jayega
        window.scrollTo(0, 0);
    }, [pathname]);

    return null; // Ye component kuch render nahi karega, bas piche kaam karega
};

export default ScrollToTop;