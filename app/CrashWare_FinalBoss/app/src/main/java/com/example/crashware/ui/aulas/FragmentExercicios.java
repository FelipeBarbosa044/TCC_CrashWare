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
    TextView txtPorcentagem;
    ImageView imgVoltarExercicios;

    int Selecionado = -1;





    public FragmentExercicios() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment Fragment_Exercicios.
     */
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
        btnProximaQuestao   = view.findViewById(R.id.btnProximaQuestao  );
        selecionar1         = view.findViewById(R.id.selecionar1        );
        selecionar2         = view.findViewById(R.id.selecionar2        );
        selecionar3         = view.findViewById(R.id.selecionar3        );
        selecionar4         = view.findViewById(R.id.selecionar4        );
        imgVoltarExercicios = view.findViewById(R.id.imgVoltarCampos);

        Toast RespostaCerta       = Toast.makeText(getContext(), "Resposta Certa!  ", LENGTH_LONG);
        Toast RespostaErrada      = Toast.makeText(getContext(), "Resposta Errada!  ", LENGTH_LONG);
        Toast SelecioneResposta   = Toast.makeText(getContext(), "Selecione uma resposta antes de prosseguir!  ", LENGTH_LONG);
        Toast RespostaSelecionada = Toast.makeText(getContext(), "Resposta Selecionada  ", LENGTH_SHORT);

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
                if (Selecionado == -1)
                {
                    SelecioneResposta.show();
                    ResetarSelecao();
                }// Se "Selecionado" for igual Null, pede para o Usuário escolher uma resposta

                else if (Selecionado == 3)
                {
                 RespostaCerta.show();
                 AtualizarBarra();
                 Selecionado = -1;

                 ResetarSelecao();

                }//Se "Selecionado" for igual a 3,Resposta correta

                else
                {
                    RespostaErrada.show();
                    ResetarSelecao();
                }//Senão, Resposta Errada


            }
        });//Interação com botão de Proxima questão




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
        BarraProgressoAula.setProgress(novoProgresso);

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


}