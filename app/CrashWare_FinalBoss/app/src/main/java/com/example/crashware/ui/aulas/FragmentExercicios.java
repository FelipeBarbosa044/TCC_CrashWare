package com.example.crashware.ui.aulas;

import static android.widget.Toast.LENGTH_LONG;
import static android.widget.Toast.LENGTH_SHORT;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.example.crashware.R;
import com.example.crashware.ui.api.Aula;

import android.animation.ObjectAnimator;
import android.view.animation.DecelerateInterpolator;
import android.animation.ValueAnimator;



import java.util.List;


public class FragmentExercicios extends Fragment
{
    ConstraintLayout selecionar1, selecionar2, selecionar3, selecionar4,selecionar5;
    Button btnProximaQuestao;
    ProgressBar BarraProgressoAula;
    TextView txtPorcentagem,
    txtPergunta, txtQuestao1, txtQuestao2, txtQuestao3, txtQuestao4,txtQuestao5;
    ImageView imgVoltarExercicios;

    SharedPreferences prefs;

    //Loading
    LinearLayout layoutLoading;
    ConstraintLayout cardExercicio;

    int idExercicio = 0; //
    int idConquista = 0;

    // Controle de estado
    int Selecionado  = -1; // -1 = nenhuma opção selecionada
    int PerguntaAtual = 1; // começa na primeira pergunta

    // Total de questões
    private int TOTAL_QUESTOES = 0;


    // Textos das perguntas — edite aqui para mudar o conteúdo

    String[] perguntas = {

    };


    // Alternativas de cada questão
    // Cada linha = {opção1, opção2, opção3, opção4}

    String[][] questoes = {

    };

    // Qual opção é a correta em cada questão (1 a 4)
    // Índice 0 = questão 1, índice 1 = questão 2, etc.

    int[] respostasCorretas = {};

    public FragmentExercicios() {
        // Required empty public constructor
    }

    // TODO: Rename and change types and number of parameters
    public static FragmentExercicios newInstance(String param1, String param2)
    {
        FragmentExercicios fragment = new FragmentExercicios();
        Bundle args = new Bundle();
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        prefs = requireActivity().getSharedPreferences("CrashWare", Context.MODE_PRIVATE);


    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_exercicios, container, false);

        txtPorcentagem      = view.findViewById(R.id.txtPorcentagem     );
        BarraProgressoAula  = view.findViewById(R.id.BarraProgressoAula );
        btnProximaQuestao   = view.findViewById(R.id.btnConcluirAula    );
        selecionar1         = view.findViewById(R.id.selecionar1        );
        selecionar2         = view.findViewById(R.id.selecionar2        );
        selecionar3         = view.findViewById(R.id.selecionar3        );
        selecionar4         = view.findViewById(R.id.selecionar4        );
        selecionar5         = view.findViewById(R.id.selecionar5        );
        imgVoltarExercicios = view.findViewById(R.id.imgVoltarCampos    );
        txtPergunta         = view.findViewById(R.id.txtPergunta        );
        txtQuestao1         = view.findViewById(R.id.txtQuestao1        );
        txtQuestao2         = view.findViewById(R.id.txtQuestao2        );
        txtQuestao3         = view.findViewById(R.id.txtQuestao3        );
        txtQuestao4         = view.findViewById(R.id.txtQuestao4        );
        txtQuestao5         = view.findViewById(R.id.txtQuestao5        );
        layoutLoading       = view.findViewById(R.id.layoutLoading      );
        cardExercicio       = view.findViewById(R.id.cardExercicio      );

        //Deixo oculto enquanto exercicios não aparecem
        btnProximaQuestao.setVisibility(View.GONE);

        Toast RespostaCerta       = Toast.makeText(getContext(), "Resposta Certa!  ", LENGTH_SHORT);
        Toast RespostaErrada      = Toast.makeText(getContext(), "Resposta Errada!  ", LENGTH_SHORT);
        Toast SelecioneResposta   = Toast.makeText(getContext(), "Selecione uma resposta antes de prosseguir!  ", LENGTH_LONG);
        Toast RespostaSelecionada = Toast.makeText(getContext(), "Resposta Selecionada  ", LENGTH_SHORT);


        if (getArguments() != null) {
            idExercicio = getArguments().getInt("id_exercicio");
            idConquista = getArguments().getInt("id_conquista");
        }

        BuscarPerguntas();


        imgVoltarExercicios.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                //Seleciona a fragment atual
                requireActivity()
                        //Simula o Clique do botão voltar do celular
                        .getOnBackPressedDispatcher()
                        .onBackPressed();
            }
        });

        selecionar1.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                ResetarSelecao();
                Selecionado = 1;
                selecionar1.setBackgroundResource(R.drawable.bg_botaoreenviar);
//                RespostaSelecionada.show();
            }
        });//

        selecionar2.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                ResetarSelecao();
                Selecionado = 2;
                selecionar2.setBackgroundResource(R.drawable.bg_botaoreenviar);
//                RespostaSelecionada.show();
            }
        });

        selecionar3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                ResetarSelecao();
                Selecionado = 3;
                selecionar3.setBackgroundResource(R.drawable.bg_botaoreenviar);
//                RespostaSelecionada.show();
            }
        });//

        selecionar4.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                ResetarSelecao();
                Selecionado = 4;
                selecionar4.setBackgroundResource(R.drawable.bg_botaoreenviar);
//                RespostaSelecionada.show();
            }
        });

        selecionar5.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                ResetarSelecao();
                Selecionado = 5;
                selecionar5.setBackgroundResource(R.drawable.bg_botaoreenviar);
//                RespostaSelecionada.show();
            }
        });

        btnProximaQuestao.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                //Pego o email
                String email = prefs.getString("email", "");

                // Nenhuma resposta selecionada
                if (Selecionado == -1) {
                    SelecioneResposta.show();
                    return;
                }

                // Conta mais uma questão respondida
                ContadorQuestoes.totalQuestoes++;

                // Verifica se a resposta está correta usando o array de respostas
                // PerguntaAtual começa em 1, então subtrai 1 para acessar o índice do array
                if (Selecionado == respostasCorretas[PerguntaAtual - 1]) {
                    ContadorQuestoes.totalAcertos++;
                    RespostaCerta.show();

                    Aula.ProgredirExercicio(idExercicio,true,email);
                }
                else
                {
                    RespostaErrada.show();
                    //Atualiza o BD
                    Aula.ProgredirExercicio(idExercicio,false,email);

                }

                // Avança a barra independente de acertar ou errar
                AtualizarBarra();

                // Reseta a seleção para a próxima questão
                Selecionado = -1;
                ResetarSelecao();

                // Avança para a próxima pergunta
                PerguntaAtual++;

                // Verifica se ainda há questões ou se chegou ao fim
                if (PerguntaAtual > TOTAL_QUESTOES) {
                    // se todas as questões respondidas vai para tela de resultado

                    FragmentTaxaAcertos fragmentTaxaAcertos = new FragmentTaxaAcertos();

                    //Envia id_exericio e id_conquista para outra tela
                    Bundle bundle = new Bundle();
                    bundle.putInt("id_exercicio", idExercicio);
                    bundle.putInt("id_conquista", idConquista);

                    fragmentTaxaAcertos.setArguments(bundle);

                    if (requireActivity() instanceof ContainerSoftware) {
                        ((ContainerSoftware) requireActivity()).irParaFragment(fragmentTaxaAcertos);
                    } else if (requireActivity() instanceof ContainerHardware) {
                        ((ContainerHardware) requireActivity()).irParaFragment(fragmentTaxaAcertos);
                    }
                }
                else
                {
                    // Ainda há questões → atualiza o texto na tela
                    AtualizarPergunta();
                }
            }
        });


        return view;
    }

    private void AtualizarBarra()
    {
        // Pega o progresso atual
        int progressoAtual = BarraProgressoAula.getProgress();

        // Calcula o progresso com base na quantidade total de questões
        int novoProgresso = (ContadorQuestoes.totalQuestoes * 100) / TOTAL_QUESTOES;

        // Limite máximo
        if (novoProgresso >= 100)
        {
            novoProgresso = 100;

            Toast.makeText(getContext(),
                    "Aula concluída!",
                    Toast.LENGTH_LONG).show();
        }

        // Animação da barra
        ObjectAnimator animacaoBarra = ObjectAnimator.ofInt
                (
                        BarraProgressoAula,
                        "progress",
                        progressoAtual,
                        novoProgresso
                );

        animacaoBarra.setDuration(700);

        animacaoBarra.setInterpolator(new DecelerateInterpolator());

        animacaoBarra.start();
        // BarraProgressoAula.setProgress(novoProgresso);

        // Texto animado
        ValueAnimator animacaoTexto = ValueAnimator.ofInt(
                progressoAtual,
                novoProgresso
        );

        animacaoTexto.setDuration(700);

        animacaoTexto.addUpdateListener(animation -> {

            int valor = (int) animation.getAnimatedValue();

            txtPorcentagem.setText(valor + "%");
        });

        animacaoTexto.start();
    }//


    private void ResetarSelecao()
    {
        selecionar1.setBackgroundResource(R.drawable.btn_alternativa);
        selecionar2.setBackgroundResource(R.drawable.btn_alternativa);
        selecionar3.setBackgroundResource(R.drawable.btn_alternativa);
        selecionar4.setBackgroundResource(R.drawable.btn_alternativa);
        selecionar5.setBackgroundResource(R.drawable.btn_alternativa);
    }//

    private void AtualizarPergunta()
    {
        int i = PerguntaAtual - 1; // converte para índice do array (começa em 0)

        txtPergunta.setText(perguntas[i]);
        txtQuestao1.setText(questoes[i][0]);
        txtQuestao2.setText(questoes[i][1]);
        txtQuestao3.setText(questoes[i][2]);
        txtQuestao4.setText(questoes[i][3]);
        txtQuestao5.setText(questoes[i][4]);
    }

    private void BuscarPerguntas()
    {
        MostrarLoading(true);  //Ativa o loading

        String email = prefs.getString("email", "");

        Aula.BuscarExercicio(idExercicio,email, prefs, new Aula.ExercicioCallback() {
            @Override
            public void onSuccess(List<Aula.QuestaoResponse> listaQuestoes,Integer questao_atual) {

                MostrarLoading(false);//Desativa o loading

                //Quatidade de questões
                TOTAL_QUESTOES = listaQuestoes.size();

                //Se não vier nenhuma questao
                if (TOTAL_QUESTOES == 0) {
                    return;
                }

                perguntas = new String[TOTAL_QUESTOES];
                questoes = new String[TOTAL_QUESTOES][5];
                respostasCorretas = new int[TOTAL_QUESTOES];

                for (int i = 0; i < listaQuestoes.size(); i++) {

                    Aula.QuestaoResponse questao = listaQuestoes.get(i);

                    perguntas[i] = questao.pergunta;

                    for (int j = 0; j < questao.alternativas.size(); j++) {

                        Aula.AlternativaResponse alternativa = questao.alternativas.get(j);

                        questoes[i][j] = alternativa.texto;

                        if (alternativa.correta) {
                            respostasCorretas[i] = j + 1;
                        }
                    }
                }

                // Se a questão atual vier nula, começa da primeira questão
                if (questao_atual == null) {
                    questao_atual = 1;
                }

                // Se a questão atual vier menor que 1, força começar na primeira
                if (questao_atual < 1) {
                    questao_atual = 1;
                }

                // Se a questão atual passar do total, mantém no final
                if (questao_atual > TOTAL_QUESTOES) {

                    //Levo para a tela de acertos
                    Fragment fragmentTaxaAcertos = new FragmentTaxaAcertos();
                    ((ContainerSoftware) requireActivity()).irParaFragment(fragmentTaxaAcertos);

                    return;
                }

                // Define a pergunta atual com base no banco
                PerguntaAtual = questao_atual;

                // Se estou na questão 3, significa que já respondi 2 questões
                ContadorQuestoes.totalQuestoes = PerguntaAtual - 1;

                // Atualiza a barra de progresso com base no progresso salvo
                int progressoSalvo = (ContadorQuestoes.totalQuestoes * 100) / TOTAL_QUESTOES;

                BarraProgressoAula.setProgress(progressoSalvo);
                txtPorcentagem.setText(progressoSalvo + "%");

                // Mostra a pergunta onde o usuário parou
                AtualizarPergunta();


            }
        });
    }

    private void MostrarLoading(boolean mostrar) {
        layoutLoading.setVisibility(mostrar ? View.VISIBLE : View.GONE);
        cardExercicio.setVisibility(mostrar ? View.GONE : View.VISIBLE);
        btnProximaQuestao.setVisibility(mostrar ? View.GONE : View.VISIBLE);
    }




}