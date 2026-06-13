import { useState } from 'react';
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
    opcao1: '',
    opcao2: '',
    opcao3: '',
    opcao4: '',
});

const estadoInicialQuestoes = Array(5).fill(null).map(criarQuestaoVazia);

const AbaCriarMateria = () => {

    const [popup, setPopup] = useState(null);
    const [etapa, setEtapa] = useState(1);
    const [tema] = useState(localStorage.getItem('TemaSelecionado') || 'Claro');
    const [artigo, setArtigo] = useState(estadoInicialArtigo);
    const [questoes, setQuestoes] = useState(estadoInicialQuestoes);
    const [questaoAtiva, setQuestaoAtiva] = useState(0);

    //Objeto da classe Aula
    const aula = new Aula();

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

    const RecompensaChange = (campo, valor) => {
        setArtigo(prev => ({ ...prev, [campo]: valor }));
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
                setPopup({titulo : "Formulário", mensagem: 'Preencha o Título e o Tipo' });
                return;
            }
            if (!artigo.modulo) {
                setPopup({titulo : "Formulário" ,mensagem: 'Selecione o Módulo.' });
                return;
            }
            if(!artigo.subtitulos[0].subtitulo.trim() || !artigo.subtitulos[0].paragrafo.trim())
            {
                setPopup({titulo : "Formulário" ,mensagem: 'Digite o Primeiro Subtítulo e Paragrafo'});
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
            if (!q.enunciado.trim() || !q.respostaCorreta.trim() || !q.opcao1.trim() || !q.opcao2.trim() || !q.opcao3.trim() || !q.opcao4.trim()) {
                setQuestaoAtiva(i);
                setPopup({ mensagem: `Preencha os Campos da Questão ${i + 1}.` });
                return;
            }
        }

        const novaAula  = {
            tituloAula: artigo.tituloAula,
            tipo: artigo.tipo,
            modulo: artigo.modulo,
            gemas : artigo.moedas,
            xp : artigo.xp,

            subtitulo1: artigo.subtitulos[0].subtitulo,
            paragrafo1: artigo.subtitulos[0].paragrafo,
            subtitulo2: artigo.subtitulos[1].subtitulo,
            paragrafo2: artigo.subtitulos[1].paragrafo,
            subtitulo3: artigo.subtitulos[2].subtitulo,
            paragrafo3: artigo.subtitulos[2].paragrafo,
            subtitulo4: artigo.subtitulos[3].subtitulo,
            paragrafo4: artigo.subtitulos[3].paragrafo,

            questao1: {
                enunciado: questoes[0].enunciado,
                respostaCorreta: questoes[0].respostaCorreta,
                opcao1: questoes[0].respostaCorreta,
                opcao2: questoes[0].opcao1,
                opcao3: questoes[0].opcao2,
                opcao4: questoes[0].opcao3,
                opcao5: questoes[0].opcao4
            },
            questao2: {
                enunciado: questoes[1].enunciado,
                respostaCorreta: questoes[1].respostaCorreta,
                opcao1: questoes[1].respostaCorreta,
                opcao2: questoes[1].opcao1,
                opcao3: questoes[1].opcao2,
                opcao4: questoes[1].opcao3,
                opcao5: questoes[1].opcao4
            },
            questao3: {
                enunciado: questoes[2].enunciado,
                respostaCorreta: questoes[2].respostaCorreta,
                opcao1: questoes[2].respostaCorreta,
                opcao2: questoes[2].opcao1,
                opcao3: questoes[2].opcao2,
                opcao4: questoes[2].opcao3,
                opcao5: questoes[2].opcao4
            },
            questao4: {
                enunciado: questoes[3].enunciado,
                respostaCorreta: questoes[3].respostaCorreta,
                opcao1: questoes[3].respostaCorreta,
                opcao2: questoes[3].opcao1,
                opcao3: questoes[3].opcao2,
                opcao4: questoes[3].opcao3,
                opcao5: questoes[3].opcao4
            },
            questao5: {
                enunciado: questoes[4].enunciado,
                respostaCorreta: questoes[4].respostaCorreta,
                opcao1: questoes[4].respostaCorreta,
                opcao2: questoes[4].opcao1,
                opcao3: questoes[4].opcao2,
                opcao4: questoes[4].opcao3,
                opcao5: questoes[4].opcao4
            },
        };

        //Lista da descrição da Aula
        const descricaoAula = [artigo.tituloAula,artigo.tipo,artigo.modulo]

        //Lista do conteúdo da Aula
        const conteudoAula = [novaAula.subtitulo1,novaAula.paragrafo1,novaAula.subtitulo2,novaAula.paragrafo2,novaAula.subtitulo3,novaAula.paragrafo3,novaAula.subtitulo4,novaAula.paragrafo4]

        //Lista das Questões
        const questoesAula = [novaAula.questao1,novaAula.questao2,novaAula.questao3,novaAula.questao4,novaAula.questao5]

         setPopup({
            tipo: 'aviso',
            titulo: 'Aula',
            mensagem: 'Criando Aula... Aguarde um momento.\nIsso pode levar alguns minutos...'
        });
        
        await aula.criar_aula(descricaoAula,conteudoAula,questoesAula,novaAula.gemas,novaAula.xp,setPopup)


        aulasArray.push(novaAula);
        setArtigo(estadoInicialArtigo);
        setQuestoes(estadoInicialQuestoes);
        setQuestaoAtiva(0);
        setEtapa(1);
        // setPopup({ mensagem: 'Aula criada com sucesso!' });
    };

    const isClaro = tema === 'Claro';
    const corretaIcon = isClaro ? corretaPretaIcon : corretaBrancaIcon;
    const erradaIcon  = isClaro ? erradaPretaIcon  : erradaBrancaIcon;

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
                            <input
                                maxLength={50}
                                type="text"
                                placeholder='Título Da Aula'
                                value={artigo.tituloAula}
                                onChange={e => ArtigoChange('tituloAula', e.target.value)}
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

                        <div className={Style.inputs} id={Style.moedasInput}>
                            <label htmlFor="moedasInput">Gemas</label>
                            <input
                                type="number"
                                min={0}
                                id='moedasInput'
                                placeholder='Digite a quantidade de gemas'
                                max={100}
                                value={artigo.moedas}
                                onChange={e => RecompensaChange('moedas', e.target.value)}
                            />
                            <p>Número Maximo 100</p>
                        </div>

                        <div className={Style.inputs} id={Style.xp}>
                            <label htmlFor="xpInput">XP</label>
                            <input
                                type="number"
                                min={0}
                                id='xpInput'
                                placeholder='Digite a quantidade de XP'
                                value={artigo.xp}
                                onChange={e => RecompensaChange('xp', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={Style.parteMeio}>
                        <h2>Subtitulos e Paragrafos</h2>

                        {artigo.subtitulos.map((secao, i) => (
                            <div key={i}>
                                <div className={Style.inputs}>
                                    <label>{`0${i + 1} - Subtitulo`}</label>
                                    <input
                                        maxLength={70}
                                        type="text"
                                        placeholder={`Insira o ${['primeiro','segundo','terceiro','quarto'][i]} subtitulo`}
                                        value={secao.subtitulo}
                                        onChange={e => SubtituloChange(i, 'subtitulo', e.target.value)}
                                    />
                                    <p>max. 70 caracteres</p>
                                </div>

                                <div className={Style.inputs}>
                                    <label>{`0${i + 1} - Parágrafo`}</label>
                                    <input
                                        type="text"
                                        placeholder={`Insira o ${['primeiro','segundo','terceiro','quarto'][i]} Parágrafo`}
                                        value={secao.paragrafo}
                                        onChange={e => SubtituloChange(i, 'paragrafo', e.target.value)}
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
                            <input
                                type="text"
                                placeholder='Insira o Enunciado da Questão'
                                value={questaoAtual.enunciado}
                                onChange={e => QuestaoChange('enunciado', e.target.value)}
                            />
                        </div>

                        <div className={Style.alternativas}>
                            <label>Alternativas</label>

                            <div className={Style.opcoesAlternativa}>
                                <img src={corretaIcon} alt="correta" />
                                <input
                                    type="text"
                                    placeholder='Alternativa correta'
                                    value={questaoAtual.respostaCorreta}
                                    onChange={e => QuestaoChange('respostaCorreta', e.target.value)}
                                />
                            </div>

                            <div className={Style.opcoesAlternativa}>
                                <img src={erradaIcon} alt="errada" />
                                <input
                                    type="text"
                                    placeholder='Alternativa errada'
                                    value={questaoAtual.opcao1}
                                    onChange={e => QuestaoChange('opcao1', e.target.value)}
                                />
                            </div>

                            <div className={Style.opcoesAlternativa}>
                                <img src={erradaIcon} alt="errada" />
                                <input
                                    type="text"
                                    placeholder='Alternativa errada'
                                    value={questaoAtual.opcao2}
                                    onChange={e => QuestaoChange('opcao2', e.target.value)}
                                />
                            </div>

                            <div className={Style.opcoesAlternativa}>
                                <img src={erradaIcon} alt="errada" />
                                <input
                                    type="text"
                                    placeholder='Alternativa errada'
                                    value={questaoAtual.opcao3}
                                    onChange={e => QuestaoChange('opcao3', e.target.value)}
                                />
                            </div>

                            <div className={Style.opcoesAlternativa}>
                                <img src={erradaIcon} alt="errada" />
                                <input
                                    type="text"
                                    placeholder='Alternativa errada'
                                    value={questaoAtual.opcao4}
                                    onChange={e => QuestaoChange('opcao4', e.target.value)}
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