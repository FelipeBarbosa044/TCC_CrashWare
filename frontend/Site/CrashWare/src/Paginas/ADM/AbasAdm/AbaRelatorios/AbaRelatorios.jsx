// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { useEffect } from 'react';
import { Adm } from '../../../../../funcoes/adm'
import Style from './AbaRelatorios.module.css'
import { PopUp } from '../../../../Componentes';
import { useState } from 'react';

const AbaRelatorios = () =>{

    //Objeto da classe ADM
    const adm = new Adm();

    //Popup
    const [popup, setPopup] = useState(null);

    const[total, setTotal] = useState(null)

    const dadosFic = [
        { nome: 'Aula 01', acertos: 9, tempo: 10},
        { nome: 'Aula 02', acertos: 7, tempo: 12},
        { nome: 'Aula 03', acertos: 8, tempo: 11},
        { nome: 'Aula 04', acertos: 6, tempo: 15},
        { nome: 'Aula 05', acertos: 10, tempo: 9},
    ]

    
    carregarInformacoes()

    async function carregarInformacoes() {    

        await adm.contar_usuarios(setPopup,setTotal)

    }

 

     useEffect(() => {
            //Quando a pag for carregada
            carregarInformacoes()
    
        }, []);
    

    return(
        <>

            {popup && (
                <PopUp
                    tipo={popup.tipo}
                    titulo={popup.titulo}
                    mensagem={popup.mensagem}
                    onFechar={() => setPopup(null)}
                />
            )}

            <div className={Style.separarConteudos}>
                <div className={Style.Conteudos}>
                    <h1>Relatórios</h1>
                    <div className={Style.UsuariosCadastrados}>
                        <h3>Usuarios Cadastrados</h3>
                        <p>{total}</p>
                    </div>

                    <div className={Style.Acertos}>
                        <h3>Taxa de Acertos por Aula</h3>
                        <p>Em breve...</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export { AbaRelatorios }