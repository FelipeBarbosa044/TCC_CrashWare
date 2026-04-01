import style from './CampoTexto.module.css';

const CampoTexto = (props) =>
{
    return (
        <div className={style.CampoTexto}>
            <input {...props}/>
        </div>
    );
};

export { CampoTexto };