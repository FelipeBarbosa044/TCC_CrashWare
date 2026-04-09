import { useState, useEffect } from 'react';

import Playicon_claro from '../../fotos/claro/google-play_claro.svg';
import Appleicon_claro from '../../fotos/claro/apple-logo-svgrepo-com.svg';

import Playicon_escuro from '../../fotos/escuro/google-play.svg';
import Appleicon_escuro from '../../fotos/escuro/apple_icon.svg';

import { BotaoInstalar } from './Botao_Instalar';
import Style from './Botoes.module.css';

const Botoes = () =>
{
    const [tema, setTema] = useState(localStorage.getItem('TemaSelecionado') || 'Claro');

    useEffect(() => {
        const checarTema = (e) => setTema(e.detail);
        window.addEventListener('temaAtualizado', checarTema);
        return () => window.removeEventListener('temaAtualizado', checarTema);
    }, []);

    const isClaro = tema === 'Claro';

    const iconsFoto = 
    [
        { id: 1, titulo: "GooglePlay", icon: isClaro ? Playicon_claro  : Playicon_escuro  },
        { id: 2, titulo: "AppleStore", icon: isClaro ? Appleicon_claro : Appleicon_escuro },
    ];

    return (
        <div className={Style.Caixa}>
            {iconsFoto.map((botao) => (
                <BotaoInstalar key={botao.id} titulo={botao.titulo} icon={botao.icon} />
            ))}
        </div>
    );
};

export { Botoes };