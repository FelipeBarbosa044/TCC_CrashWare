import Style from "./PopUpBanido.module.css";

const PopUpBanido = ({ onFechar }) => {
    return (
        <>
            <div className={Style.fundoEscurecido} />

            <div className={Style.popUp}>
                <div className={Style.icone}>
                    {/* tenque colocar a imagem eu vejo amanha */}
                </div>
                <h1>Conta Banida</h1>
                <p>
                    Sua conta foi banida por violar os termos de serviço da plataforma.
                    Caso acredite que isso foi um erro, entre em contato com o suporte.
                </p>
                    <div className={Style.botoes}>
                        <button className={Style.primeiroBotao} onClick={onFechar}>
                            Entendi
                        </button>
                    </div>
            </div>
        </>
    );
};

export { PopUpBanido };