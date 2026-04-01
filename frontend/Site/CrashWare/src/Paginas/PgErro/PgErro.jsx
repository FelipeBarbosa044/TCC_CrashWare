import style from './PgErro.module.css';

const PgErro = () =>
{
    return (
        <div className={style.PgErro}>
            <h1>Erro 404</h1>
            <h3>Página não encontrada</h3>
        </div>
    );
};

export { PgErro };