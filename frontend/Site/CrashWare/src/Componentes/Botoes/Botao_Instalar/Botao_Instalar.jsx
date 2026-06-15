import Style from './Botao.module.css';

const BotaoInstalar = ({titulo, icon, disabled}) => {
    return (
        <div className={Style.Botao} style={disabled ? { pointerEvents: 'none', opacity: 0.5 } : {}}>
            <a href="#">
                <img src={icon} alt={titulo} />
                <p>{titulo}</p>
            </a>
        </div>
    );
};

export { BotaoInstalar };