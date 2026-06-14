package com.example.crashware.ui.aulas;

import static android.widget.Toast.LENGTH_LONG;
import static android.widget.Toast.LENGTH_SHORT;

import android.os.Bundle;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.example.crashware.R;

import android.animation.ObjectAnimator;
import android.view.animation.DecelerateInterpolator;
import android.animation.ValueAnimator;



public class FragmentExercicios extends Fragment
{
    ConstraintLayout selecionar1, selecionar2, selecionar3, selecionar4;
    Button btnProximaQuestao;
    ProgressBar BarraProgressoAula;
    TextView txtPorcentagem,
    txtPergunta, txtQuestao1, txtQuestao2, txtQuestao3, txtQuestao4;
    ImageView imgVoltarExercicios;

    // Controle de estado
    int Selecionado  = -1; // -1 = nenhuma opção selecionada
    int PerguntaAtual = 1; // começa na primeira pergunta

    // Total de questões
    private static final int TOTAL_QUESTOES = 10;


    // Textos das perguntas — edite aqui para mudar o conteúdo

    String[] perguntas = {
            "Qual é o objetivo principal do curso apresentado no CrashWare?",
            "Pergunta 2?",
            "Pergunta 3?",
            "Pergunta 4?",
            "Pergunta 5?",
            "Pergunta 6?",
            "Pergunta 7?",
            "Pergunta 8?",
            "Pergunta 9?",
            "Pergunta 10?"
    };


    // Alternativas de cada questão
    // Cada linha = {opção1, opção2, opção3, opção4}

    String[][] questoes = {
            {"Ensinar apenas a montar computadores", "Ensinar apenas programação", "Ensinar os fundamentos de forma clara e progressiva", "Ensinar somente manutenção avançada"},
            {"A2", "B2", "C2", "D2"},
            {"A3", "B3", "C3", "D3"},
            {"A4", "B4", "C4", "D4"},
            {"A5", "B5", "C5", "D5"},
            {"A6", "B6", "C6", "D6"},
            {"A7", "B7", "C7", "D7"},
            {"A8", "B8", "C8", "D8"},
            {"A9", "B9", "C9", "D9"},
            {"A10", "B10", "C10", "D10"}
    };

    // Qual opção é a correta em cada questão (1 a 4)
    // Índice 0 = questão 1, índice 1 = questão 2, etc.

    int[] respostasCorretas = {3, 1, 2, 4, 3, 1, 2, 3, 4, 2};

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
        imgVoltarExercicios = view.findViewById(R.id.imgVoltarCampos    );
        txtPergunta         = view.findViewById(R.id.txtPergunta        );
        txtQuestao1         = view.findViewById(R.id.txtQuestao1        );
        txtQuestao2         = view.findViewById(R.id.txtQuestao2        );
        txtQuestao3         = view.findViewById(R.id.txtQuestao3        );
        txtQuestao4         = view.findViewById(R.id.txtQuestao4        );

        Toast RespostaCerta       = Toast.makeText(getContext(), "Resposta Certa!  ", LENGTH_SHORT);
        Toast RespostaErrada      = Toast.makeText(getContext(), "Resposta Errada!  ", LENGTH_SHORT);
        Toast SelecioneResposta   = Toast.makeText(getContext(), "Selecione uma resposta antes de prosseguir!  ", LENGTH_LONG);
        Toast RespostaSelecionada = Toast.makeText(getContext(), "Resposta Selecionada  ", LENGTH_SHORT);

        AtualizarPergunta();

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
                RespostaSelecionada.show();
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
                RespostaSelecionada.show();
            }
        });

        selecionar3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                ResetarSelecao();
                Selecionado = 3;
                selecionar3.setBackgroundResource(R.drawable.bg_botaoreenviar);
                RespostaSelecionada.show();
            }
        });//

        selecionar4.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                ResetarSelecao();
                Selecionado = 4;
                selecionar4.setBackgroundResource(R.drawable.bg_botaoreenviar);
                RespostaSelecionada.show();
            }
        });

        btnProximaQuestao.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
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
                    AtualizarBarra(); // avança a barra de progresso
                }
                else
                {
                    RespostaErrada.show();
                }

                // Reseta a seleção para a próxima questão
                Selecionado = -1;
                ResetarSelecao();

                // Avança para a próxima pergunta
                PerguntaAtual++;

                // Verifica se ainda há questões ou se chegou ao fim
                if (PerguntaAtual > TOTAL_QUESTOES) {
                    // se todas as questões respondidas vai para tela de resultado
                    Fragment fragmentTaxaAcertos = new FragmentTaxaAcertos();
                    ((ContainerSoftware) requireActivity()).irParaFragment(fragmentTaxaAcertos);
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

        // Soma +10
        int novoProgresso = progressoAtual + 10;

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
    }//

    private void AtualizarPergunta()
    {
        int i = PerguntaAtual - 1; // converte para índice do array (começa em 0)

        txtPergunta.setText(perguntas[i]);
        txtQuestao1.setText(questoes[i][0]);
        txtQuestao2.setText(questoes[i][1]);
        txtQuestao3.setText(questoes[i][2]);
        txtQuestao4.setText(questoes[i][3]);
    }




}