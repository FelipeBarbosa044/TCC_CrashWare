import style from "./pglogin.module.css";
// import { sair } from '../../fotos/x_icon.svg';

const pglogin = () => {
    return (
        <main className = {style.pglogin}>
            <header className = {style.header}>
                <div className = {style.imagem_sair}>
                <img src={sair} alt={sair} />
                </div>

                <button className = {style.btnCriarConta}></button>
            </header>
        </main>
    );
};

export { pglogin };