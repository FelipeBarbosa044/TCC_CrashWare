import { TIPO_BOTAO } from "../constantes";
import style from './BotaoForm.module.css';

const BotoesForm = (props) =>
{
    const { texto, tipo = TIPO_BOTAO, ...outrasProps } = props;
    return (
      <button className={style.Botao} tipo={tipo} {...outrasProps }>
          {texto}
      </button>
    );
};

export { BotoesForm };