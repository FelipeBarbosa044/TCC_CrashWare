// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { useEffect } from 'react';
import { Adm } from '../../../../../funcoes/adm'
import Style from './AbaRelatorios.module.css'
import { PopUp } from '../../../../Componentes';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const AbaRelatorios = () =>{

    //Objeto da classe ADM
    const adm = new Adm();

    //Popup
    const [popup, setPopup] = useState(null);

    //Total usuarios
    const[total, setTotal] = useState(null);

    //Dados Gráfico
    const [dadosGrafico, setDadosGraficos] = useState([])

    //Loading dos dados
    const [loading, setLoading] = useState(false);

    // const dadosFic = [
    //     { nome: 'Aula 01', acertos: 9, tempo: 10},
    //     { nome: 'Aula 02', acertos: 7, tempo: 12},
    //     { nome: 'Aula 03', acertos: 8, tempo: 11},
    //     { nome: 'Aula 04', acertos: 6, tempo: 15},
    //     { nome: 'Aula 05', acertos: 10, tempo: 9},
    // ]

    
    // carregarInformacoes()

    async function carregarInformacoes() {    

        await adm.carregar_usuarios(setPopup,setTotal, setDadosGraficos)
        // await adm.
    }

 

     useEffect(() => {
            //Quando a pag for carregada
            carregarInformacoes()
    
        }, []);
    
        // if (loading) return <p>Carregando</p>;

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


                        {/* <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dadosGrafico}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mes" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value, name) =>[
                                        value, name === 'total' ? 'total acumlado' : 'Novos'
                                    ]}
                                    />
                                    <Bar dataKey="total" name="Total acumulado" fill="red" />
                            </BarChart>
                        </ResponsiveContainer> */}
                    </div>

                    {/* <div className={Style.Acertos}>
                        <h3>Taxa de Acertos por Aula</h3>
                        <p>Em breve...</p>
                    </div> */}
                </div>
            </div>
        </>
    )
}

export { AbaRelatorios }