import style from "./PopUpConquista.module.css";
import { useEffect } from "react";

import hardwareIcon from "../../fotos/hardware.svg";
import softwareIcon from "../../fotos/software.svg";

const CONFIG = {
  hardware: { icone: hardwareIcon, tag: "HARDWARE", alt: "Hardware" },
  software: { icone: softwareIcon, tag: "SOFTWARE", alt: "Software" },
  outros:   { icone: null,         tag: "CONQUISTA", alt: "Conquista" },
};

const PopUpConquista = ({ tipo = "outros", titulo, mensagem, onFechar, duracao = 15000 }) => {

  useEffect(() => {
    if (!duracao) return;
    const t = setTimeout(onFechar, duracao);
    return () => clearTimeout(t);
  }, [duracao, onFechar]);

  const config = CONFIG[tipo] ?? CONFIG.outros;

  return (
    <div className={style.Caixa}>
      <div className={`${style.Card} ${style[`Card_${tipo}`]}`}>

        <div className={style.Icone}>
          {config.icone
            ? <img src={config.icone} alt={config.alt} className={style.IconeImagem} />
            : <span>★</span>
          }
        </div>

        <div className={style.Conteudo}>
          <span className={`${style.Etiqueta} ${style[`Etiqueta_${tipo}`]}`}>
            {config.tag}
          </span>
          <p className={style.Titulo}>{titulo}</p>
          {mensagem && <p className={style.Mensagem}>{mensagem}</p>}
        </div>

        <button className={style.BotaoFechar} onClick={onFechar}>×</button>
      </div>
    </div>
  );
};

export { PopUpConquista };