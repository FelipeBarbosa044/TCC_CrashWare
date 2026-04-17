import { useEffect } from 'react'
import style from "./PopUp.module.css"

const PopUp = ({ tipo = 'erro', titulo, mensagem, onFechar, duracao = 4000 }) => {

  useEffect(() => {
    if (!duracao) return
    const t = setTimeout(onFechar, duracao)
    return () => clearTimeout(t)
  }, [duracao, onFechar])

  return (
    <div className={style["popup-overlay"]}>
      <div className={`${style.popup} ${style[`popup-${tipo}`]}`}>
        
        <div className={style["popup-icone"]}>!</div>

        <div className={style["popup-body"]}>
          <p className={style["popup-titulo"]}>{titulo}</p>
          {mensagem && <p className={style["popup-mensagem"]}>{mensagem}</p>}
        </div>

        <button className={style["popup-fechar"]} onClick={onFechar}>
          ×
        </button>

      </div>
    </div>
  )
}

export { PopUp }