import { useState, useEffect } from 'react';
import FTema_claro from '../../fotos/claro/lua_icon_claro.svg';
import FTema_escuro from '../../fotos/escuro/lua_icon.svg';

const Tema = () =>
{
    const [tema, setTema] = useState(localStorage.getItem('TemaSelecionado') || 'Claro');

    useEffect(() => {
        document.body.className = tema;
        localStorage.setItem('TemaSelecionado', tema);

        // Avisa os outros componentes na mesma aba
        window.dispatchEvent(new CustomEvent('temaAtualizado', { detail: tema }));
    }, [tema]);

    const TrocarTema = () =>
    {
        setTema(tema === "Claro" ? "Escuro" : "Claro");
    }

    const icone = tema === 'Claro' ? FTema_claro : FTema_escuro;

    return (
        <button onClick={TrocarTema} style={{ background: 'none', border: 'none' }}>
            <img src={icone} alt="Trocar tema" style={{ width: '50px', height: '50px', marginRight: '20px' }} />
        </button>
    );
};

export { Tema };