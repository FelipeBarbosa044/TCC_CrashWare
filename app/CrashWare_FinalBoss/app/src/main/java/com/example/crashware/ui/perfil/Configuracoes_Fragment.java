package com.example.crashware.ui.perfil;

import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import com.example.crashware.R;
import com.example.crashware.ui.login.Login;

//
import com.example.crashware.ui.config.ThemeConfig;
//

import android.content.SharedPreferences;
import android.widget.Toast;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link Configuracoes_Fragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class Configuracoes_Fragment extends Fragment {

    ImageView imgVoltarConfig, imgTemaSistema, imgtemaModoEscuro,
            imgTemaModoClaro, imgGelo,imgMeiaNoite,imgLeitura;

    ConstraintLayout AlterarDadosUsuario, SairDaConta, ExcluirConta, TermosDeServiço, Sobre;

    //Memória do app
    SharedPreferences prefs;



    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";



    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;


    public Configuracoes_Fragment() {
        // Required empty public constructor
    }


    // TODO: Rename and change types and number of parameters
    public static Configuracoes_Fragment newInstance(String param1, String param2) {
        Configuracoes_Fragment fragment = new Configuracoes_Fragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        //Pegando arquivo na memoria do app "CrashWare"
        prefs = requireContext().getSharedPreferences("CrashWare", Context.MODE_PRIVATE);


        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {



        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_configuracoes, container, false);

        imgVoltarConfig     = view.findViewById(R.id.imgVoltarCampos);
        imgGelo             = view.findViewById(R.id.imgGelo);
        imgLeitura          = view.findViewById(R.id.imgLeitura);
        imgMeiaNoite        = view.findViewById(R.id.imgMeiaNoite);
        imgTemaSistema      = view.findViewById(R.id.imgTemaSistema);
        imgTemaModoClaro    = view.findViewById(R.id.imgModoClaro);
        imgtemaModoEscuro   = view.findViewById(R.id.imgModoEscuro);
        Sobre               = view.findViewById(R.id.cardPrivacidadeSegurancaSobre);
        SairDaConta         = view.findViewById(R.id.cardConfigUsuarioSairConta);
        TermosDeServiço     = view.findViewById(R.id.cardPrivacidadeSegurancaTermosServico);
        AlterarDadosUsuario = view.findViewById(R.id.cardConfigUsuarioAlterarDados);
        ExcluirConta        = view.findViewById(R.id.cardConfigUsuarioExluirConta);


        imgGelo.setEnabled(false);
        imgLeitura.setEnabled(false);
        imgMeiaNoite.setEnabled(false);




        imgTemaSistema.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                salvarTema("sistema");

            }
        });

        imgTemaModoClaro.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                salvarTema("claro");

            }
        });//

        imgtemaModoEscuro.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                salvarTema("escuro");
            }
        });//

        imgGelo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                salvarTema("gelo");

            }
        });//

        imgLeitura.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                salvarTema("leitura");
            }
        });//

        imgMeiaNoite.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                salvarTema("meia_noite");

            }
        });



        imgVoltarConfig.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View view)
            {
                requireActivity()//puxa o fragment atual
                        .getSupportFragmentManager()//acessa o gerenciador das fragments
                        .popBackStack();//simula o botão "voltar" do celular
            }
        });

        SairDaConta.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View view)
            {
                AlertDialog.Builder builder = new AlertDialog.Builder(requireContext());

                builder.setTitle("Sair da conta");

                builder.setMessage("Deseja realmente sair da sua conta?");

                // Botão SIM
                builder.setPositiveButton("Sim", (dialog, which) -> {

                    // Aqui você faz logout

                    Toast.makeText(requireContext(),
                            "Conta desconectada",
                            Toast.LENGTH_SHORT).show();

                    //Deleto o token e o refresh_token
                    prefs.edit()
                            .remove("token")
                            .remove("refresh_token")
                            .remove("foto")
                            .apply();

                    //Vou para o login(futuramente para a tela de carregamento)
                    Intent i = new Intent(requireContext(), Login.class);
                    startActivity(i);

                    requireActivity().finish();

                });

                // Botão NÃO
                builder.setNegativeButton("Cancelar", (dialog, which) -> {

                    dialog.dismiss();

                });

                builder.show();


            }
        });//Interação com botão sair da conta

        AlterarDadosUsuario.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                Fragment AlterarDadosFragment = new AlterarDados_Fragment();

                getParentFragmentManager()
                        .beginTransaction()
                        .replace(R.id.fragment_container, AlterarDadosFragment)
                        .addToBackStack(null)
                        .commit();

            }
        });// Interação com Botão de alterar dados





        return view;

    }

    private void salvarTema(String tema)
    {
        prefs.edit()
                .putString(ThemeConfig.KEY_THEME, tema)
                .apply();

        Intent intent = requireActivity().getIntent();
        requireActivity().finish();
        startActivity(intent);
//        requireActivity().recreate(); // aplica tema imediatamente
    }

}