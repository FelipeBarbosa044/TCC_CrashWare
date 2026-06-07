import { useState } from 'react'
import { CampoTexto } from '../../../../Componentes'
import { BotoesForm } from '../../../../Componentes'
import Defaut from '../../../../fotos/FotoPerfilPadrao.jpeg'
import { PopUp } from '../../../../Componentes'
import { useEffect } from 'react';

import Style from './AbaUsuarios.module.css'
import { Adm } from '../../../../../funcoes/adm'

const AbaUsuarios = () => {


    let USUARIOS_MOCK = []
    // { id: 1, foto: Defaut, nome: 'UserName', nivel: "XX", criado: "00/00/0000", editar: 'Editar' }
       
    let [usuariosInterface, setUsuarios] = useState([]);

    let [usuariosExibidos, setUsuariosExibidos] = useState([]);

    //Buscas
    const [buscar, setBuscar] = useState("");

    //
    const [fechado, setFechado] = useState(null);

    //Popup
    const [popup, setPopup] = useState(null);

    //Objeto da classe Adm
    const adm = new Adm;


    
    useEffect(() => {
        //Quando a pag for carregada
         setPopup({
                    tipo: 'aviso',
                    titulo: 'Usuários',
                    mensagem: 'Listando Usuários...'
                });
        carregarUsuarios();

    }, []);

    //Trata a Data
    const formatarData = (data) => {
        if (!data) return "";

        return new Date(data).toLocaleDateString("pt-BR");
    };

    const verificarStatus= (status) =>{
        if (status == false)
        {
            return  ["Desativado","Desbanir"]
        }else
        {
            return  ["Ativo","Banir"]
        }
    }

    async function carregarUsuarios() {
        //Listo as conquistas no banco de dados
        await adm.carregar_usuarios(setPopup);

        //Pego os usuarios uma array
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        //Pego a quantidade de usuarios
        let quantidade_usuarios = usuarios.length

        //Reinicio as conquistas para não duplicar
        USUARIOS_MOCK = [];

        for (let n = 0; n < quantidade_usuarios; n++)
        {
            USUARIOS_MOCK.push({ id: usuarios[n].id_usuario, nome: usuarios[n].nome_usuario, criado: formatarData(usuarios[n].created_at), editado: formatarData(usuarios[n].updated_at),status : verificarStatus(usuarios[n].ativo)[0] , banir :verificarStatus(usuarios[n].ativo)[1] })

        }


        //Conquistas no total
        setUsuarios(USUARIOS_MOCK)

        //Conquistas exibidas
        setUsuariosExibidos(USUARIOS_MOCK);

    }

     function Buscar(texto) {

        texto = texto.toLowerCase().trim();

        if (texto === "") {
            setUsuariosExibidos(usuariosInterface);
            return;
        }

        const resultado = usuariosInterface.filter((c) =>
            `${c.nome}${c.criado} ${c.status} ${c.editado}`
                .toLowerCase()
                .includes(texto)
        );

        setUsuariosExibidos(resultado);
    }

    async function Usuario(id_usuario,status) {
                try
                {
                    if(status == "Ativo")
                    {
                    //Desativo o usuario no banco de dados
                    const resultado = await adm.desativar_usuario(id_usuario,setPopup)


                    if (resultado == 403){
                        return;
                    }
                    
                    //Atualizo o status do usuário
                    
                    // Atualizo o status na lista principal
                    setUsuarios((antigas) =>
                        antigas.map((c) =>
                            c.id === id_usuario
                                ? { ...c, status: "Desativado",banir: "Desbanir" }
                                : c
                        )
                    )

                    // Atualizo o status na lista exibida
                    setUsuariosExibidos((antigas) =>
                        antigas.map((c) =>
                            c.id === id_usuario
                                ? { ...c, status: "Desativado",banir: "Desbanir" }
                                : c
                        )
                    )

                    }else
                    {
                        //Desativo o usuario no banco de dados
                        await adm.ativar_usuario(id_usuario,setPopup)


                        //Atualizo o status do usuário
                        
                        // Atualizo o status na lista principal
                        setUsuarios((antigas) =>
                            antigas.map((c) =>
                                c.id === id_usuario
                                    ? { ...c, status: "Ativo",banir: "Banir" }
                                    : c
                            )
                        )

                        // Atualizo o status na lista exibida
                        setUsuariosExibidos((antigas) =>
                            antigas.map((c) =>
                                c.id === id_usuario
                                    ? { ...c, status: "Ativo",banir: "Banir" }
                                    : c
                            )
                        )
                    }
                    
                                            
                }catch(error){
                    setPopup({
                        tipo: 'erro',
                        titulo: 'Erro ao Banir ou Desbanir Usuário',
                        mensagem: 'Tente Novamente mais tarde...'
                    });

                    console.log(error)

                }
                
            }

    async function RedefinirNome(id_usuario) {

        await adm.redefinir_nome(id_usuario,setPopup)

        // Atualizo o status na lista principal
        setUsuarios((antigas) =>
            antigas.map((c) =>
                c.id === id_usuario
                    ? { ...c, nome: "Usuário"}
                    : c
            )
        )

        // Atualizo o status na lista exibida
        setUsuariosExibidos((antigas) =>
            antigas.map((c) =>
                c.id === id_usuario
                    ? { ...c, nome: "Usuário"}
                    : c
            )
        )

    }

    return (
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
                    <h1>Usuários</h1>

                    <div className={Style.Buscar}>
                        <CampoTexto
                            placeholder="Buscar Usuários..."
                            onChange={(e) => setBuscar(e.target.value)}
                        />
                        <BotoesForm
                            className={Style.botaoBuscar}
                            texto="Buscar"
                            onClick={() => Buscar(buscar)}
                        />
                    </div>

                    <div className={Style.Lista}>

                        {usuariosExibidos.map((c) => (
                            <div
                                className={Style.ListaConquistas}
                                key={c.id}
                            >

                                <div className={Style.ItensLista}>
                                    <div className={Style.Dados}>
                                        <h6>{c.nome}</h6>
                                        <p>Cadastrado em: {c.criado}</p>
                                        <p>Editado em: {c.editado}</p>
                                    </div>

                                    <p>Status: {c.status}</p>

                                    <div className={Style.Botoes}>
                                        <BotoesForm
                                            texto="Ver Perfil"
                                        />
                                        <BotoesForm
                                            onClick={() => setFechado(fechado === c.id ? null : c.id)}
                                            texto="Editar"
                                        />
                                    </div>
                                </div>
                                {fechado === c.id && (
                                    <div className={Style.sanfona}>
                                        <BotoesForm
                                            className={Style.btnSanfona}
                                            texto="Remover Foto"
                                            onClick={()  =>  adm.removerFoto_usuario(c.id,setPopup) } 
                                        />

                                        <BotoesForm
                                            className={Style.btnSanfona}

                                            texto="Remover Banner"
                                            onClick={()  =>  adm.removerBanner_usuario(c.id,setPopup) } 
                                        />

                                        <BotoesForm
                                            className={Style.btnSanfona}

                                            texto="Redefinir Nome"
                                            onClick={()  =>  RedefinirNome(c.id) }
                                        />
                                        <BotoesForm
                                            className={Style.Banir}
                                            texto={c.banir}
                                            onClick={()  =>  Usuario(c.id,c.status) } 
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