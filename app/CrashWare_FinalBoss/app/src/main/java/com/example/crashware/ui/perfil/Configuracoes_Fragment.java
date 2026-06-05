package com.example.crashware.ui.perfil;

import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatDelegate;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import com.example.crashware.R;
import com.example.crashware.ui.api.Auth;
import com.example.crashware.ui.api.Configuracoes;
import com.example.crashware.ui.login.Login;

//
import com.example.crashware.ui.config.ThemeConfig;
import com.example.crashware.ui.navegacao.Home;
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

    ConstraintLayout AlterarDadosUsuario, SairDaConta, DesativarConta, ExcluirConta, TermosDeServiço, Sobre;

    //Memória do app
    SharedPreferences prefs;

    public static final int TEMA_Sistema=0;
    public static final int TEMA_Escuro=1;
    public static final int TEMA_Claro=2;
    public static final int TEMA_Gelo=3;


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
        DesativarConta = view.findViewById(R.id.cardConfigUsuarioDesativarConta);

        imgGelo.setEnabled(false);
        imgLeitura.setEnabled(false);
        imgMeiaNoite.setEnabled(false);




        imgTemaSistema.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                salvarTema(ThemeConfig.SYSTEM);

            }
        });

        imgTemaModoClaro.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                salvarTema(ThemeConfig.LIGHT);

            }
        });//

        imgtemaModoEscuro.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                salvarTema(ThemeConfig.DARK);
            }
        });//

        imgGelo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
//                salvarTema(ThemeConfig.GELO);

            }
        });//

        imgLeitura.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {

            }
        });//

        imgMeiaNoite.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {


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


        DesativarConta.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View view)
            {
                AlertDialog.Builder builder = new AlertDialog.Builder(requireContext());

                builder.setTitle("Desativar Conta");

                builder.setMessage("Deseja realmente desativar da sua conta?");

                // Botão SIM
                builder.setPositiveButton("Sim", (dialog, which) -> {

                    Toast.makeText(getContext(), "Desativando conta...", Toast.LENGTH_LONG).show();

                    //Verifico o token
                    Auth.verificarToken(requireActivity(), prefs, true, new Auth.AuthCallback() {

                        @Override
                        public void onSuccess() {

                            //Aqui chamo o metodo de desativar conta
                            Configuracoes.Desativar_Conta(prefs,Configuracoes_Fragment.this);

                        }

                    });


                });

                // Botão NÃO
                builder.setNegativeButton("Cancelar", (dialog, which) -> {

                    dialog.dismiss();

                });

                builder.show();
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

                    Auth.Logout(prefs, requireContext());

                });

                // Botão NÃO
                builder.setNegativeButton("Cancelar", (dialog, which) -> {

                    dialog.dismiss();

                });

                builder.show();


            }
        });//Interação com botão sair da conta

        ExcluirConta.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View view)
            {
                AlertDialog.Builder builder = new AlertDialog.Builder(requireContext());

                builder.setTitle("Excluir Conta");

                builder.setMessage("Deseja realmente excluir sua conta?");

                // Botão SIM
                builder.setPositiveButton("Sim", (dialog, which) -> {

                    Toast.makeText(getContext(), "Excluindo conta...", Toast.LENGTH_LONG).show();

                    //Verifico o token
                    Auth.verificarToken(requireActivity(), prefs, true, new Auth.AuthCallback() {

                        @Override
                        public void onSuccess() {

                            //Chamo o metodo de DELETAR CONTA
                            Configuracoes.Deletar_Conta(prefs,Configuracoes_Fragment.this);

                        }

                    });

                });

                // Botão NÃO
                builder.setNegativeButton("Cancelar", (dialog, which) -> {

                    dialog.dismiss();

                });

                builder.show();


            }
        });//Interação com botão exlcuir conta

        AlterarDadosUsuario.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                Fragment AlterarDadosFragmento = new AlterarDados_Fragment();

                ((Home) requireActivity()).irParaTelaExtra(AlterarDadosFragmento);
            }
        });// Interação com Botão de alterar dados


        TermosDeServiço.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                Fragment TermosFragmento = new Termos_Fragment();

                ((Home) requireActivity()).irParaTelaExtra(TermosFragmento);
            }
        });//interação com o botão que leva para a tela de termos e serviço

        Sobre.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                Fragment SobreFragmento = new Sobre_Fragment();

                ((Home) requireActivity()).irParaTelaExtra(SobreFragmento);
            }
        });//interação com o botão que leva para a tela de 'Sobre'



        return view;

    }

    private void salvarTema(String tema)
    {
        prefs.edit()
                .putString(ThemeConfig.KEY_THEME, tema)
                .apply();

        ThemeConfig.aplicarTema(requireContext());

    }//Método que salva a escolha do usuário para alterar o tema

}