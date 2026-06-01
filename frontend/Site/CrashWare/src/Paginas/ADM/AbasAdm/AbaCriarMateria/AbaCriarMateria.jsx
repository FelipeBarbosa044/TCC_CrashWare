import { useState } from 'react';
import { PopUp } from '../../../../Componentes';

import softwareIcon from "../../../../fotos/software.svg";
import hardwareIcon from "../../../../fotos/hardware.svg";
import corretaBrancaIcon from "../../../../fotos/correta.svg";
import corretaPretaIcon from "../../../../fotos/correta_preta.svg";
import erradaBrancaIcon from "../../../../fotos/errada.svg";
import erradaPretaIcon from "../../../../fotos/errada_preta.svg";

import Style from './AbaCriarMateria.module.css';

export const aulasArray = [];

const estadoInicialArtigo = {
    tituloAula: '',
    tipo: '',
    subtitulos: [
        { subtitulo: '', paragrafo: '' },
        { subtitulo: '', paragrafo: '' },
        { subtitulo: '', paragrafo: '' },
        { subtitulo: '', paragrafo: '' },
    ],
};

const estadoInicialQuestao = {
    enunciado: '',
    respostaCorreta: '',
    opcao1: '',
    opcao2: '',
    opcao3: '',
};

const AbaCriarMateria = () => {

    const [popup, setPopup] = useState(null);
    const [etapa, setEtapa] = useState(1);
    const [tema] = useState(localStorage.getItem('TemaSelecionado') || 'Claro');
    const [artigo, setArtigo] = useState(estadoInicialArtigo);
    const [questao, setQuestao] = useState(estadoInicialQuestao);

    const ArtigoChange = (campo, valor) => {
        setArtigo(prev => ({ ...prev, [campo]: valor }));
    };

    const SubtituloChange = (index, campo, valor) => {
        setArtigo(prev => {
            const novasSecoes = [...prev.subtitulos];
            novasSecoes[index] = { ...novasSecoes[index], [campo]: valor };
            return { ...prev, subtitulos: novasSecoes };
        });
    };

    const LimparArtigo = (e) => {
        e.preventDefault();
        setArtigo(estadoInicialArtigo);
    };

    const QuestaoChange = (campo, valor) => {
        setQuestao(prev => ({ ...prev, [campo]: valor }));
    };

    const LimparQuestao = (e) => {
        e.preventDefault();
        setQuestao(estadoInicialQuestao);
    };

    const Proximo = (e) => {
        e.preventDefault();
        if (etapa === 1) {
            if (!artigo.tituloAula.trim() || !artigo.tipo) {
                setPopup({ mensagem: 'Preencha o título e o tipo antes de continuar.' });
                return;
            }
            setEtapa(2);
        } else {
            setEtapa(1);
        }
    };

    const CriarAula = (e) => {
        e.preventDefault();

        if (!questao.enunciado.trim() || !questao.respostaCorreta.trim()) {
            setPopup({ mensagem: 'Preencha o enunciado e a resposta correta.' });
            return;
        }

    const novaAula = {
        tituloAula: artigo.tituloAula,
        tipo: artigo.tipo,

        subtitulo1: artigo.subtitulos[0].subtitulo,
        paragrafo1: artigo.subtitulos[0].paragrafo,
        subtitulo2: artigo.subtitulos[1].subtitulo,
        paragrafo2: artigo.subtitulos[1].paragrafo,
        subtitulo3: artigo.subtitulos[2].subtitulo,
        paragrafo3: artigo.subtitulos[2].paragrafo,
        subtitulo4: artigo.subtitulos[3].subtitulo,
        paragrafo4: artigo.subtitulos[3].paragrafo,

        questao: {
            enunciado: questao.enunciado,
            respostaCorreta: questao.respostaCorreta,
            opcao1: questao.respostaCorreta,
            opcao2: questao.opcao1,
            opcao3: questao.opcao2,
            opcao4: questao.opcao3,
        },
    };

        aulasArray.push(novaAula);
        setArtigo(estadoInicialArtigo);
        setQuestao(estadoInicialQuestao);
        setEtapa(1);
        setPopup({ mensagem: 'Aula criada com sucesso!' });
    };

    const isClaro = tema === 'Claro';
    const corretaIcon = isClaro ? corretaPretaIcon : corretaBrancaIcon;
    const erradaIcon  = isClaro ? erradaPretaIcon  : erradaBrancaIcon;

    return (
        <>
                {popup && (
                    <PopUp
                        mensagem={popup.mensagem}
                        onFechar={() => setPopup(null)}
                />)}

            {etapa === 1 && (
                <div className={Style.conteudoArtigo}>

                    <div className={Style.parteCima}>
                        <h1>Artigo</h1>

                        <div className={Style.inputs}>
                            <label>Titulo da aula</label>
                            <input
                                maxLength={40}
                                type="text"
                                placeholder='Insira o titulo da aula aqui !!!'
                                value={artigo.tituloAula}
                                onChange={e => ArtigoChange('tituloAula', e.target.value)}
                            />
                            <p>max. 40 caracteres</p>
                        </div>

                        <div className={Style.tipo}>
                            <label>Tipo</label>
                            <div className={Style.escolherTipo}>

                                <div className={Style.opcoesTipo}>
                                    <img src={softwareIcon} alt="software" />
                                    <input
                                        type="radio"
                                        name="tipo"
                                        value="software"
                                        checked={artigo.tipo === 'software'}
                                        onChange={e => ArtigoChange('tipo', e.target.value)}
                                    />
                                    <p>Software</p>
                                </div>

                                <div className={Style.opcoesTipo}>
                                    <img src={hardwareIcon} alt="hardware" />
                                    <input
                                        type="radio"
                                        name="tipo"
                                        value="hardware"
                                        checked={artigo.tipo === 'hardware'}
                                        onChange={e => ArtigoChange('tipo', e.target.value)}
                                    />
                                    <p>Hardware</p>
                                </div>

                                <div className={Style.opcoesTipo}>
                                    <input
                                        type="radio"
                                        name='tipo'
                                        value="outros"
                                        checked={artigo.tipo === 'outros'}
                                        onChange={e => ArtigoChange('tipo', e.target.value)}
                                    />
                                    <p>Outros</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={Style.parteMeio}>
                        <h2>Subtitulos e Paragrafos</h2>

                        {artigo.subtitulos.map((secao, i) => (
                            <div key={i}>
                                <div className={Style.inputs}>
                                    <label>{`0${i + 1} - Subtitulo`}</label>
                                    <input
                                        maxLength={50}
                                        type="text"
                                        placeholder={`Insira o ${['primeiro','segundo','terceiro','quarto'][i]} subtitulo`}
                                        value={secao.subtitulo}
                                        onChange={e => SubtituloChange(i, 'subtitulo', e.target.value)}
                                    />
                                    <p>max. 50 caracteres</p>
                                </div>

                                <div className={Style.inputs}>
                                    <label>{`0${i + 1} - Parágrafo`}</label>
                                    <input
                                        maxLength={150}
                                        type="text"
                                        placeholder={`Insira o ${['primeiro','segundo','terceiro','quarto'][i]} Parágrafo`}
                                        value={secao.paragrafo}
                                        onChange={e => SubtituloChange(i, 'paragrafo', e.target.value)}
                                    />
                                    <p>max. 150 caracteres</p>
                                </div>
                            </div>
                        ))}

                        <div className={Style.botoes}>
                            <button onClick={Proximo}>Continuar</button>
                            <button onClick={LimparArtigo}>Limpar campos</button>
                        </div>
                    </div>
                </div>
            )}

            {etapa === 2 && (
                <div className={Style.container}>
                    <div className={Style.parteExercicios}>
                        <h1>Questões</h1>

                        <div className={Style.Enunciado}>
                            <label>Enunciado</label>
                            <input
                                maxLength={100}
                                type="text"
                                placeholder='Insira o enunciado da questão'
                                value={questao.enunciado}
                                onChange={e => QuestaoChange('enunciado', e.target.value)}
                            />
                            <p>max. 100 caracteres</p>
                        </div>

                        <div className={Style.alternativas}>
                            <label>Alternativas</label>

                            <div className={Style.opcoesAlternativa}>
                                <img src={corretaIcon} alt="correta" />
                                <input
                                    type="text"
                                    placeholder='Alternativa correta'
                                    value={questao.respostaCorreta}
                                    onChange={e => QuestaoChange('respostaCorreta', e.target.value)}
                                />
                            </div>

                            <div className={Style.opcoesAlternativa}>
                                <img src={erradaIcon} alt="errada" />
                                <input
                                    type="text"
                                    placeholder='Alternativa errada'
                                    value={questao.opcao1}
                                    onChange={e => QuestaoChange('opcao1', e.target.value)}
                                />
                            </div>

                            <div className={Style.opcoesAlternativa}>
                                <img src={erradaIcon} alt="errada" />
                                <input
                                    type="text"
                                    placeholder='Alternativa errada'
                                    value={questao.opcao2}
                                    onChange={e => QuestaoChange('opcao2', e.target.value)}
                                />
                            </div>

                            <div className={Style.opcoesAlternativa}>
                                <img src={erradaIcon} alt="errada" />
                                <input
                                    type="text"
                                    placeholder='Alternativa errada'
                                    value={questao.opcao3}
                                    onChange={e => QuestaoChange('opcao3', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={Style.botoes}>
                            <button onClick={Proximo}>Voltar</button>
                            <button onClick={CriarAula}>Criar aula</button>
                            <button onClick={LimparQuestao}>Limpar campos</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export { AbaCriarMateria };