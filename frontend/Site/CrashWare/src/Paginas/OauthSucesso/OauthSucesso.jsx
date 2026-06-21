import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSucesso = () => {

    const navigate = useNavigate();

    useEffect(() => {

        const params = new URLSearchParams(window.location.search);

        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken) {
            localStorage.setItem("token", accessToken);
        }

        if (refreshToken) {
            localStorage.setItem("refresh_token", refreshToken);
        }

        navigate("/home");

    }, []);

    return <h1>Entrando...</h1>;
};

export { OAuthSucesso };