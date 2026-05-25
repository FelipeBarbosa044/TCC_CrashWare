import { createContext, useState, useEffect } from "react";
import { Api } from "../../funcoes/functions";
import { useNavigate } from "react-router-dom";

//Cria uma Rota Global
const AuthContext = createContext();




const AuthProvider = ({ children }) => {

    //Navegação --> Permite eu levar o usuario para outras telas
    const Navegacao = useNavigate();

    //Uso useState para o react renderizar as informações
    //const [id_state, setId] = useState(() => localStorage.getItem("id"));
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
        await usuario.Verificar_Token(token,refresh_token,Navegacao,set,null)


    }

    //Sempre que a rota for chamada, eu verifico o token
    useEffect(() => {
            VerificarToken();
        }, []);


    return (
        <AuthContext.Provider value={{token_state, refresh_token_state, setToken, setRefresh,set }}>
            {children}
        </AuthContext.Provider>
    );
};




export { AuthProvider, AuthContext }