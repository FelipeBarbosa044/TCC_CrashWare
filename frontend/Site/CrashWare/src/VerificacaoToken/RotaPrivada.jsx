import { useContext, useEffect, useState } from "react";
//MUITO IMPORTANTE/ ROTA GLOBAL
import { AuthContext } from "./AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { Api } from "../../funcoes/functions";

const RotaPrivada = ({ children }) => {

    //Navegação --> Permite eu levar o usuario para outras telas
    const Navegacao = useNavigate();

    //Uso useState para o react renderizar as informações
    //const [id, setId] = useState(() => localStorage.getItem("id"));
    const [token_state, setToken] = useState(() => localStorage.getItem("token"));
    const [refresh_token_state, setRefresh] = useState(() => localStorage.getItem("refresh_token"));
    const [dados, setDados] = useState(() =>
        JSON.parse(localStorage.getItem("dados")) || null
    );

    //Lista que contém todos os usestate
    const set = [setToken,setRefresh,setDados];


    //Verifico se o usuario tem token
    const VerificarToken = async () => 
    {
        //Pego os tokens dentro do escopo privado.
        const token = localStorage.getItem("token")
        const refresh_token = localStorage.getItem("refresh_token")


        //Verifico o token
        const usuario = new Api();
        await usuario.Verificar_Token(token,refresh_token,Navegacao,set,true)


    }
    
    //Sempre que a rota for chamada, eu verifico o token
    useEffect(() => {
            VerificarToken();
        }, []);
          
    

    return children;
};

export { RotaPrivada }