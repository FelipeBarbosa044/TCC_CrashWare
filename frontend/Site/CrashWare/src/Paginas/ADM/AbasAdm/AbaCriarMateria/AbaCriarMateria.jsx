import { useState, useEffect } from 'react';
import { PopUp } from '../../../../Componentes';

import softwareIcon from "../../../../fotos/software.svg";
import hardwareIcon from "../../../../fotos/hardware.svg";
import corretaBrancaIcon from "../../../../fotos/correta.svg";
import corretaPretaIcon from "../../../../fotos/correta_preta.svg";
import erradaBrancaIcon from "../../../../fotos/errada.svg";
import erradaPretaIcon from "../../../../fotos/errada_preta.svg";

import Style from './AbaCriarMateria.module.css';
import { Aula } from '../../../../../funcoes/aula';

export const aulasArray = [];

const estadoInicialArtigo = {
    tituloAula: '',
    tipo: '',
    modulo: '',
    moedas: '',
    xp: '',
    subtitulos: [
        { subtitulo: '', paragrafo: '' },
        { subtitulo: '', paragrafo: '' },
        { subtitulo: '', paragrafo: '' },
        { subtitulo: '', paragrafo: '' },
    ],
};

const criarQuestaoVazia = () => ({
    enunciado: '',
    respostaCorreta: '',
    alternativas: ['', '', '', ''],
});

const estadoInicialQuestoes = Array(5).fill(null).map(criarQuestaoVazia);

const nomesOrdem = ['primeiro', 'segundo', 'terceiro', 'quarto'];

const autoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
};

const carregarStorage = (chave, fallback) => {
    try {
        const salvo = localStorage.getItem(chave);
        return salvo ? JSON.parse(salvo) : fallback;
    } catch {
        return fallback;
    }
};

const AbaCriarMateria = () => {

    const [popup, setPopup] = useState(null);
    const [etapa, setEtapa] = useState(() => carregarStorage('criarAula_etapa', 1));
    const [tema] = useState(localStorage.getItem('TemaSelecionado') || 'Claro');
    const [artigo, setArtigo] = useState(() => carregarStorage('criarAula_artigo', estadoInicialArtigo));
    const [questoes, setQuestoes] = useState(() => carregarStorage('criarAula_questoes', estadoInicialQuestoes));
    const [questaoAtiva, setQuestaoAtiva] = useState(() => carregarStorage('criarAula_questaoAtiva', 0));

    const aula = new Aula();

    useEffect(() => {
        localStorage.setItem('criarAula_artigo', JSON.stringify(artigo));
    }, [artigo]);

    useEffect(() => {
        localStorage.setItem('criarAula_questoes', JSON.stringify(questoes));
    }, [questoes]);

    useEffect(() => {
        localStorage.setItem('criarAula_etapa', JSON.stringify(etapa));
    }, [etapa]);

    useEffect(() => {
        localStorage.setItem('criarAula_questaoAtiva', JSON.stringify(questaoAtiva));
    }, [questaoAtiva]);

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

    const limparStorage = () => {
        localStorage.removeItem('criarAula_artigo');
        localStorage.removeItem('criarAula_questoes');
        localStorage.removeItem('criarAula_etapa');
        localStorage.removeItem('criarAula_questaoAtiva');
    };

    const LimparArtigo = (e) => {
        e.preventDefault();
        setArtigo(estadoInicialArtigo);
    };

    const QuestaoChange = (campo, valor) => {
        setQuestoes(prev => {
            const novas = [...prev];
            novas[questaoAtiva] = { ...novas[questaoAtiva], [campo]: valor };
            return novas;
        });
    };

    const AlternativaChange = (indice, valor) => {
        setQuestoes(prev => {
            const novas = [...prev];
            const alternativas = [...novas[questaoAtiva].alternativas];
            alternativas[indice] = valor;
            novas[questaoAtiva] = { ...novas[questaoAtiva], alternativas };
            return novas;
        });
    };

    const LimparQuestao = (e) => {
        e.preventDefault();
        setQuestoes(prev => {
            const novas = [...prev];
            novas[questaoAtiva] = criarQuestaoVazia();
            return novas;
        });
    };

    const Proximo = (e) => {
        e.preventDefault();
        if (etapa === 1) {
            if (!artigo.tituloAula.trim() || !artigo.tipo) {
                setPopup({ titulo: 'Formulário', mensagem: 'Preencha o Título e o Tipo' });
                return;
            }
            if (!artigo.modulo) {
                setPopup({ titulo: 'Formulário', mensagem: 'Selecione o Módulo.' });
                return;
            }
            if (!artigo.subtitulos[0].subtitulo.trim() || !artigo.subtitulos[0].paragrafo.trim()) {
                setPopup({ titulo: 'Formulário', mensagem: 'Digite o Primeiro Subtítulo e Parágrafo' });
                return;
            }
            setEtapa(2);
        } else {
            setEtapa(1);
        }
    };

    const CriarAula = async (e) => {
        e.preventDefault();

        for (let i = 0; i < questoes.length; i++) {
            const q = questoes[i];
            const alternativasPreenchidas = q.alternativas.every(a => a.trim());
            if (!q.enunciado.trim() || !q.respostaCorreta.trim() || !alternativasPreenchidas) {
                setQuestaoAtiva(i);
                setPopup({ titulo: 'Questões', mensagem: `Preencha os Campos da Questão ${i + 1}.` });
                return;
            }
        }

        const descricaoAula = [artigo.tituloAula, artigo.tipo, artigo.modulo];

        const conteudoAula = artigo.subtitulos.flatMap(secao => [secao.subtitulo, secao.paragrafo]);

        const questoesAula = questoes.map(q => ({
            enunciado: q.enunciado,
            respostaCorreta: q.respostaCorreta,
            opcao1: q.respostaCorreta,
            opcao2: q.alternativas[0],
            opcao3: q.alternativas[1],
            opcao4: q.alternativas[2],
            opcao5: q.alternativas[3],
        }));

        setPopup({
            tipo: 'aviso',
            titulo: 'Aula',
            mensagem: 'Criando Aula... Aguarde um momento.\nIsso pode levar alguns minutos...'
        });

        await aula.criar_aula(descricaoAula, conteudoAula, questoesAula, artigo.moedas, artigo.xp, setPopup);

        aulasArray.push({ ...artigo, questoes: questoesAula });
        limparStorage();
        setArtigo(estadoInicialArtigo);
        setQuestoes(estadoInicialQuestoes);
        setQuestaoAtiva(0);
        setEtapa(1);
    };

    const isClaro = tema === 'Claro';
    const corretaIcon = isClaro ? corretaPretaIcon : corretaBrancaIcon;
    const erradaIcon = isClaro ? erradaPretaIcon : erradaBrancaIcon;

    const questaoAtual = questoes[questaoAtiva];

    return (
        <>
            {popup && (
                <PopUp
                    tipo={popup.tipo}
                    titulo={popup.titulo}
                    mensagem={popup.mensagem}
                    onFechar={() => setPopup(null)}
                />
            )}

            {etapa === 1 && (
                <div className={Style.conteudoArtigo}>

                    <div className={Style.parteCima}>
                        <h1>Artigo</h1>

                        <div className={Style.inputs}>
                            <label>Título da aula</label>
                            <textarea
                                className={Style.textareaExpandivel}
                                maxLength={50}
                                placeholder="Título Da Aula"
                                value={artigo.tituloAula}
                                rows={1}
                                onChange={e => {
                                    ArtigoChange('tituloAula', e.target.value);
                                    autoResize(e);
                                }}
                            />
                            <p>max. 50 caracteres</p>
                        </div>

                        <div className={Style.tipoModuloLinha}>
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
                                </div>
                            </div>

                            <div className={Style.modulo}>
                                <label>Módulo</label>
                                <select
                                    value={artigo.modulo}
                                    onChange={e => ArtigoChange('modulo', e.target.value)}
                                >
                                    <option value="">Escolha o modulo</option>
                                    <option value="1">Módulo 1</option>
                                    <option value="2">Módulo 2</option>
                                    <option value="3">Módulo 3</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={Style.parteCima} id={Style.recompensas}>
                        <h1>Recompensas</h1>

                        <div className={Style.inputs}>
                            <label htmlFor="moedasInput">Gemas</label>
                            <input
                                type="number"
                                min={0}
                                max={100}
                                id="moedasInput"
                                placeholder="Digite a quantidade de gemas"
                                value={artigo.moedas}
                                onChange={e => ArtigoChange('moedas', e.target.value)}
                            />
                            <p>Número Máximo 100</p>
                        </div>

                        <div className={Style.inputs}>
                            <label htmlFor="xpInput">XP</label>
                            <input
                                type="number"
                                min={0}
                                id="xpInput"
                                placeholder="Digite a quantidade de XP"
                                value={artigo.xp}
                                onChange={e => ArtigoChange('xp', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={Style.parteMeio}>
                        <h2>Subtítulos e Parágrafos</h2>

                        {artigo.subtitulos.map((secao, i) => (
                            <div key={i}>
                                <div className={Style.inputs}>
                                    <label>{`0${i + 1} - Subtítulo`}</label>
                                    <textarea
                                        className={Style.textareaExpandivel}
                                        maxLength={70}
                                        placeholder={`Insira o ${nomesOrdem[i]} subtítulo`}
                                        value={secao.subtitulo}
                                        rows={1}
                                        onChange={e => {
                                            SubtituloChange(i, 'subtitulo', e.target.value);
                                            autoResize(e);
                                        }}
                                    />
                                    <p>max. 70 caracteres</p>
                                </div>

                                <div className={Style.inputs}>
                                    <label>{`0${i + 1} - Parágrafo`}</label>
                                    <textarea
                                        className={Style.textareaExpandivel}
                                        placeholder={`Insira o ${nomesOrdem[i]} parágrafo`}
                                        value={secao.paragrafo}
                                        rows={1}
                                        onChange={e => {
                                            SubtituloChange(i, 'paragrafo', e.target.value);
                                            autoResize(e);
                                        }}
                                    />
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

                        <div className={Style.abasQuestoes}>
                            {questoes.map((_, i) => (
                                <button
                                    key={i}
                                    className={`${Style.abaQuestao} ${questaoAtiva === i ? Style.abaAtiva : ''}`}
                                    onClick={() => setQuestaoAtiva(i)}
                                >
                                    {`QUESTÃO 0${i + 1}`}
                                </button>
                            ))}
                        </div>

                        <div className={Style.Enunciado}>
                            <label>Enunciado</label>
                            <textarea
                                className={Style.textareaExpandivel}
                                placeholder="Insira o Enunciado da Questão"
                                value={questaoAtual.enunciado}
                                rows={1}
                                onChange={e => {
                                    QuestaoChange('enunciado', e.target.value);
                                    autoResize(e);
                                }}
                            />
                        </div>

                        <div className={Style.alternativas}>
                            <label>Alternativas</label>

                            <div className={Style.opcoesAlternativa}>
                                <img src={corretaIcon} alt="correta" />
                                <textarea
                                    className={Style.textareaExpandivel}
                                    placeholder="Alternativa correta"
                                    value={questaoAtual.respostaCorreta}
                                    rows={1}
                                    onChange={e => {
                                        QuestaoChange('respostaCorreta', e.target.value);
                                        autoResize(e);
                                    }}
                                />
                            </div>

                            {questaoAtual.alternativas.map((alternativa, index) => (
                                <div key={index} className={Style.opcoesAlternativa}>
                                    <img src={erradaIcon} alt="errada" />
                                    <textarea
                                        className={Style.textareaExpandivel}
                                        placeholder="Alternativa errada"
                                        value={alternativa}
                                        rows={1}
                                        onChange={e => {
                                            AlternativaChange(index, e.target.value);
                                            autoResize(e);
                                        }}
                                    />
                                </div>
                            ))}
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