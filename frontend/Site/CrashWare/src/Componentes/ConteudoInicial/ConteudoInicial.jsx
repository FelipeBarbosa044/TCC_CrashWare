import FMenina from '../../fotos/menina_estudando.png'
import Style from './ConteudoInicial.module.css'

const ConteudoInicial = () =>
{
    return (
        <>
            <div className={Style.Conteudo}>
                <h3>Aprenda Hardware e Software de forma prática e envolvente</h3>
                
                <div className={Style.Conteudo_img}>
                    <img src={FMenina} alt="" />
                </div>
                {/* <hr /> */}
            </div>
        </>
    )
}

export { ConteudoInicial }