import { useContext, useEffect, useState } from "react";
//MUITO IMPORTANTE/ ROTA GLOBAL
import { AuthContext } from "./AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { Api } from "../../funcoes/functions";
import { Usuario } from "../../funcoes/user";

const RotaAdm = ({ children }) => {

    //Pego as informações do usuário
    const usuario = JSON.parse(localStorage.getItem("dados"));

    //Navegação --> Permite eu levar o usuario para outras telas
    const Navegacao = useNavigate();

    function VerificarAdm()
    {
        if (usuario == null)
        {
            //Levo para a pagina Inicial
            Navegacao('/')
        }else
        {
            //Pego o valor de adm do usuário
            const adm = usuario.adm;
            const ativo = usuario.ativo;

            //Verifico se usuário é adm ou se esta banido/desativado
            if(adm == false || ativo == false )
            {
                //Levo para a HOME
                Navegacao('/home')
            }
        }
    }
    

    
    //Sempre que a rota for chamada, eu verifico se a pessoa é ADM
    useEffect(() => {
            VerificarAdm();
        }, []);
          
    

    return children;
};

export { RotaAdm }