import { useState } from 'react'
import { CampoTexto } from '../../../../Componentes'
import { BotoesForm } from '../../../../Componentes'
import Defaut from '../../../../fotos/FotoPerfilPadrao.jpeg'

import Style from './AbaUsuarios.module.css'

const AbaUsuarios = () => {

    const usuario = JSON.parse(localStorage.getItem('dados'));

    // const Nome = usuario?.nome;

    const CONQUISTAS_MOCK = [
        { id: 1, foto: Defaut, nome: 'UserName', nivel: "XX", criado: "00/00/0000", editar: 'Editar' },
        { id: 2, foto: Defaut, nome: 'UserName', nivel: "XX", criado: "00/00/0000", editar: 'Editar' },
        { id: 3, foto: Defaut, nome: 'UserName', nivel: "XX", criado: "00/00/0000", editar: 'Editar' },
        { id: 4, foto: Defaut, nome: 'UserName', nivel: "XX", criado: "00/00/0000", editar: 'Editar' },
        { id: 5, foto: Defaut, nome: 'UserName', nivel: "XX", criado: "00/00/0000", editar: 'Editar' },
        
    ]

    const [conquistas, setConquistas] = useState(CONQUISTAS_MOCK);
    const [fechado, setFechado] = useState(null);

    return (
        <>
            <div className={Style.separarConteudos}>
                <div className={Style.Conteudos}>
                    <h1>Usuários</h1>

                    <div className={Style.Buscar}>
                        <CampoTexto
                            placeholder="Buscar Usuários..."
                            onChange={(e) => setBuscar(e.target.value)}
                        />
                        <BotoesForm
                            className={Style.botaoBuscar}
                            texto="Buscar"
                        />
                    </div>

                    <div className={Style.Lista}>

                        {conquistas.map((c) => (
                            <div
                                className={Style.ListaConquistas}
                                key={c.id}
                            >

                                <div className={Style.ItensLista}>
                                    <img src={c.foto} alt="Foto de Perfil" />
                                    <div className={Style.Dados}>
                                        <h6>{c.nome}</h6>
                                        <p>Cadastrado em: {c.criado}</p>
                                    </div>

                                    <p>Nível: {c.nivel}</p>

                                    <div className={Style.Botoes}>
                                        <BotoesForm
                                            texto="Ver Perfil"
                                        />
                                        <BotoesForm
                                            onClick={() => setFechado(fechado === c.id ? null : c.id)}
                                            texto={c.editar}
                                        />
                                    </div>
                                </div>
                                {fechado === c.id && (
                                    <div className={Style.sanfona}>
                                        <BotoesForm
                                            className={Style.btnSanfona}
                                            texto="Remover Foto"
                                        />

                                        <BotoesForm
                                            className={Style.btnSanfona}

                                            texto="Remover Banner"
                                        />

                                        <BotoesForm
                                            className={Style.btnSanfona}

                                            texto="Redefinir Nome"
                                        />
                                        <BotoesForm
                                            className={Style.Banir}
                                            texto="Banir"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}

                    </div> {/* Lista */}
                </div> {/* Conteudos */}
            </div> {/* Separar Conteudos */}
        </>
    )
}

export { AbaUsuarios }