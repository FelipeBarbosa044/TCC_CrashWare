import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSucesso = () => {

    const navigate = useNavigate();

    useEffect(() => {

        alert("CHEGUEI NO OAUTH");

        const params = new URLSearchParams(window.location.search);

        alert("OPAAA");

        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken) {
            localStorage.setItem("token", accessToken);
        }

        if (refreshToken) {
            localStorage.setItem("refresh_token", refreshToken);
        }

        localStorage.removeItem("dados");
        localStorage.setItem("info", "false");

        console.log("TOKEN SALVO");
        console.log("INFO:", localStorage.getItem("info"));
        console.log("TOKEN",)

        console.log("TOKEN SALVO:", localStorage.getItem("token"));

        alert("POR ULTIMO");

        // window.location.href="/home";

    }, []);

     return (
        <div
            style={{
                background: "red",
                color: "white",
                height: "100vh",
                fontSize: "60px"
            }}
        >
            OAUTH FUNCIONOU
        </div>
    );
};


export { OAuthSucesso };