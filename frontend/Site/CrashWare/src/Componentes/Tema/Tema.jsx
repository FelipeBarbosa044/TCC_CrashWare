import { useEffect, useState } from 'react';
import FTema from '../../fotos/lua_icon.svg';

const Tema = () =>
{
    const [tema, setTema] = useState(localStorage.getItem('TemaSelcionado') || 'Claro')

    useEffect(() => {document.body.className = tema;
        localStorage.setItem('TemaSelecionado', tema)
    }, [tema])

    const TrocarTema = () =>
    {
        setTema(tema === "Claro" ? "Escuro" : "Claro")
    }

    return (
        <button onClick={TrocarTema} style={{ background: 'none', border: 'none' }}>
            <img src={FTema} alt="" style={{ width: '50px', height: '50px', marginRight: '20px' }} />
        </button>
    );
};

export { Tema };