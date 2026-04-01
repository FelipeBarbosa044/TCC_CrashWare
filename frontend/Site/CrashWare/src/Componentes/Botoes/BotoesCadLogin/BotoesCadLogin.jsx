import { TIPO_BOTAO } from "../constantes";
import style from './BotoesCadLogin.module.css';

const BotoesCadLogin = (props) =>
{
    const { texto, tipo = TIPO_BOTAO, ...outrasProps } = props;
    return (
        <button className={style.Botao} tipo={tipo} {...outrasProps }>
            {texto}
        </button>
    );
};

export { BotoesCadLogin };