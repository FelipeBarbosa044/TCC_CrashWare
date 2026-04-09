import FConfig_claro from '../../fotos/claro/configuracoes_icon_claro.svg';
import FConfig_escuro from '../../fotos/escuro/configuracoes_icon.svg';

import Style from './Configuracoes.module.css';

const Configuracoes = () =>
{
    const { tema } = useTema();
    const iconeConfig = tema === 'Claro' ? FConfig_claro : FConfig_escuro;

    return (
        <>
            <div className={Style.Config}>
                <img src={iconeConfig} alt="Configuracoes" />
            </div>
        </>
    );
};

export { Configuracoes };