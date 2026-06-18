package com.example.crashware.ui.aulas;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;

import com.example.crashware.R;
import com.example.crashware.databinding.FragmentTaxaAcertosBinding;
import com.example.crashware.ui.api.Aula;
import com.example.crashware.ui.api.Auth;
import com.example.crashware.ui.api.User;
import com.example.crashware.ui.navegacao.Home;

import android.widget.ProgressBar;
import android.widget.TextView;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link FragmentTaxaAcertos#newInstance} factory method to
 * create an instance of this fragment.
 */
public class FragmentTaxaAcertos extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    ImageView imgVoltar;
    Button btnConcluirAula;
    SharedPreferences prefs;


    TextView txtPorcentagemAcertos, TituloAula;
    TextView txtQuantAcertos;
    ProgressBar progressBarGrafico;

    ProgressBar barraProgressoAula;
    TextView txtPorcentagem;

    int idExercicio = 0; //
    int idConquista = 0;

    String titulo;


    public FragmentTaxaAcertos() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment FragmentTaxaAcertos.
     */
    // TODO: Rename and change types and number of parameters
    public static FragmentTaxaAcertos newInstance(String param1, String param2) {
        FragmentTaxaAcertos fragment = new FragmentTaxaAcertos();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_taxa_acertos, container, false);

        prefs = requireContext().getSharedPreferences("CrashWare", Context.MODE_PRIVATE);

        TituloAula  = view.findViewById(R.id.txtTituloAulaExercicios );

        //Pego os id conquista e exercicio , e o titulo da aula
        if (getArguments() != null) {
            idExercicio = getArguments().getInt("id_exercicio");
            idConquista = getArguments().getInt("id_conquista");
            titulo = getArguments().getString("titulo");
        }

        //Edito o titulo da aula
        TituloAula.setText(titulo);

        imgVoltar = view.findViewById(R.id.imgVoltarCampos);
        btnConcluirAula = view.findViewById(R.id.btnConcluirAula);

        txtPorcentagemAcertos = view.findViewById(R.id.txtPorcentagemAcertos);
        txtQuantAcertos = view.findViewById(R.id.txtQuantAcertos);
        progressBarGrafico = view.findViewById(R.id.progressBarGrafico);


        barraProgressoAula = view.findViewById(R.id.BarraProgressoAula);
        txtPorcentagem = view.findViewById(R.id.txtPorcentagem);


        barraProgressoAula.setProgress(100);
        txtPorcentagem.setText("100%");

        // Começa bloqueado enquanto ganha a conquista
        btnConcluirAula.setText("Carregando...");
        btnConcluirAula.setEnabled(false);


        // Deixa o botão cinza
        btnConcluirAula.setBackgroundTintList(
                android.content.res.ColorStateList.valueOf(
                        android.graphics.Color.GRAY
                )
        );


        // Valor inicial enquanto busca da API
        txtPorcentagemAcertos.setText("0%");
        progressBarGrafico.setProgress(0);
        txtQuantAcertos.setText("0/5 ACERTOS");

        // Chama a conquista e retornar os acertos automaticamente ao abrir a tela
        RetornarAcertos();
        GanharConquista();

//        float porcentagem = 0;
//
//        if (ContadorQuestoes.totalQuestoes > 0)
//        {
//            porcentagem =
//                    (ContadorQuestoes.totalAcertos * 100f)
//                            / ContadorQuestoes.totalQuestoes;
//        }
//
//        txtPorcentagemAcertos.setText(
//                String.format("%.0f%%", porcentagem)
//        );
//
//        progressBarGrafico.setProgress(
//                Math.round(porcentagem)
//        );
//
//        txtQuantAcertos.setText(
//                ContadorQuestoes.totalAcertos
//                        + "/"
//                        + ContadorQuestoes.totalQuestoes
//                        + " ACERTOS"
//        );


        imgVoltar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                //Pego o email e aulas
                String email = prefs.getString("email", "");
                Integer aulas = prefs.getInt("aulas_concluidas", 0);

                //+1 Aula concluida
                aulas += 1;

                //Salvo no Shared Preferences
                prefs.edit().putInt("aulas_concluidas",aulas).apply();

                //Aviso para o bd que usuario acabou a aula:
                Aula.AcabarAula(idExercicio,email);


                //Adiciono Moeda e xp para o usuario, por completar a aula.
                User.adicionar_moeda(20,prefs);
                User.adicionar_xp(1000F,prefs);

                //Vou para a HOME
                Intent intent = new Intent(requireContext(), Home.class);
                startActivity(intent);

                // Fecha a tela/container atual de aula
                requireActivity().finish();


            }
        });//

        btnConcluirAula.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                //Pego o email
                String email = prefs.getString("email", "");
                Integer aulas = prefs.getInt("aulas_concluidas", 0);

                //+1 Aula concluida
                aulas += 1;

                //Salvo no Shared Preferences
                prefs.edit().putInt("aulas_concluidas",aulas).apply();

                //Aviso para o bd que usuario acabou a aula:
                Aula.AcabarAula(idExercicio,email);

                //Adiciono Moeda e xp para o usuario, por completar a aula.
                User.adicionar_moeda(20,prefs);
                User.adicionar_xp(1000F,prefs);

                //Vou para a HOME
                Intent intent = new Intent(requireContext(), Home.class);
                startActivity(intent);

                // Fecha a tela/container atual de aula
                requireActivity().finish();
            }
        });



        return view;

    }

    private  void RetornarAcertos()
    {
        //Verifico o token
        Auth.verificarToken(requireActivity(), prefs, true, new Auth.AuthCallback() {

            @Override
            public void onSuccess()
            {
                //Se token tiver valido, pego os acertos
                Aula.RetornarAcertos(idExercicio, prefs, FragmentTaxaAcertos.this, new Aula.AcertosCallback() {
                    @Override
                    public void onSuccess(Integer acertos) {
                        //Quando retornar os acertos:

                        AtualizarGrafico(acertos); //Atualizo o Grafico

                    }
                });

            }

        });

    }
    private  void GanharConquista()
    {
        User.Conquista(idConquista,prefs, getActivity(), new User.ConquistasCallback()
        {
            @Override
            public void onSuccess()
            {
                // Libera os botões quando a conquista terminar
                btnConcluirAula.setEnabled(true);
                imgVoltar.setEnabled(true);
                btnConcluirAula.setText("Terminar Aula");

                // Volta a cor normal do botão
                btnConcluirAula.setBackgroundTintList(null);
            }
        });//Ganha a conquista e libera o botão de terminar a aula
    }

    //Atualiza o Grafico
    private void AtualizarGrafico(Integer acertos)
    {

        if (acertos == null) {
            acertos = 0;
        }

        int totalQuestoes = 5;

        float porcentagem = 0;

        if (totalQuestoes > 0) {
            porcentagem = (acertos * 100f) / totalQuestoes;
        }

        txtPorcentagemAcertos.setText(
                String.format("%.0f%%", porcentagem)
        );

        progressBarGrafico.setProgress(
                Math.round(porcentagem)
        );

        txtQuantAcertos.setText(
                acertos + "/" + totalQuestoes + " ACERTOS"
        );
    }

}