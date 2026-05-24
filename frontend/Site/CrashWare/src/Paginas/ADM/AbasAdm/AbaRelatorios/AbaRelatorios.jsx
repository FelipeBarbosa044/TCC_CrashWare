// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import Style from './AbaRelatorios.module.css'

const AbaRelatorios = () =>{

    const dadosFic = [
        { nome: 'Aula 01', acertos: 9, tempo: 10},
        { nome: 'Aula 02', acertos: 7, tempo: 12},
        { nome: 'Aula 03', acertos: 8, tempo: 11},
        { nome: 'Aula 04', acertos: 6, tempo: 15},
        { nome: 'Aula 05', acertos: 10, tempo: 9},
    ]

    return(
        <>
            <div className={Style.separarConteudos}>
                <div className={Style.Conteudos}>
                    <h1>Relatórios</h1>
                    <div className={Style.UsuariosCadastrados}>
                        <h3>Usuarios Cadastrados</h3>
                        <p>Em breve<span>...</span></p>
                    </div>

                    <div>
                        <h3>Taxa de Acertos por Aula</h3>
                        <p>Em breve...</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export { AbaRelatorios }