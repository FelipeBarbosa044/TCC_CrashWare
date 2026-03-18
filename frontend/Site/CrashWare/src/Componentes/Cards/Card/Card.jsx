    import Style from './Card.module.css'

    const Card = ({ titulo, icon }) =>
    {
        return (
            <>
                <div className={Style.Card}>
                    <img src={icon} alt={titulo}/>
                    <p>{titulo}</p>
                </div>
            </>
        )
    }

    export { Card }