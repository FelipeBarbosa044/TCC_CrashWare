package com.example.crashware.ui.navegacao;

import static android.app.ProgressDialog.show;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import com.example.crashware.R;
import com.example.crashware.ui.api.Auth;
import com.example.crashware.ui.api.Loja;


public class Loja_fragment extends Fragment {

    //Objetos que serão Utilizados
    TextView txtComprarTemaMeiaNoite, txtComprarGelo, txtComprarBooster,
            txtComprarOfensiva, txtComprarLeitura;

    //Váriaveis que serão Utilizadas


    //Memória do app
    SharedPreferences prefs;

    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public Loja_fragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment Loja.
     */
    // TODO: Rename and change types and number of parameters
    public static Loja_fragment newInstance(String param1, String param2) {
        Loja_fragment fragment = new Loja_fragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        //SharedPreferences
        prefs = requireContext().getSharedPreferences("CrashWare", Context.MODE_PRIVATE);

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
        View view = inflater.inflate(R.layout.fragment_loja, container, false);


        //Iniciando os Objetos do Layout
        txtComprarLeitura       = view.findViewById(R.id.txtComprarLeitura  );
        txtComprarBooster       = view.findViewById(R.id.txtComprarBooster  );
        txtComprarOfensiva      = view.findViewById(R.id.txtComprarOfensiva );
        txtComprarGelo          = view.findViewById(R.id.txtComprarGelo     );
        txtComprarTemaMeiaNoite = view.findViewById(R.id.txtComprarMeiaNoite);

        //Criando os Toasts que serão Utilizados
        Toast temaAdquirido     = Toast.makeText(getContext(), "Tema Adquirido    ", Toast.LENGTH_LONG);
        Toast SaldoInsuficiente = Toast.makeText(getContext(), "Saldo Insuficiente", Toast.LENGTH_LONG);
        Toast PowerUpAdquirido  = Toast.makeText(getContext(), "PowerUp Adquirido  ", Toast.LENGTH_LONG);

        //Verifico se o tema já foi comprado
        VerificarTemas();

        txtComprarTemaMeiaNoite.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View view)
            {
                //Pego a gemas do usuário
                Integer Gemas = prefs.getInt("moedas", 0);
                if (Gemas>=50)
                {
                    temaAdquirido.show();
                    txtComprarTemaMeiaNoite.setText("Adquirido");
                    txtComprarGelo.setEnabled(false);
                }//Se o usuário possuir 50 ou mais gemas, prossegue com a compra
                //E torna o Botão Indisponivel para compra novamente, alterando o texto para "Adquirido"

                else
                {
                    SaldoInsuficiente.show();
                }//Senão retorna saldo insuficiente

            }
        });//Interação com o Botão de Comprar o Tema meia Noite

        txtComprarGelo.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View view)
            {
                //Pego a gemas do usuário
                Integer Gemas = prefs.getInt("moedas", 0);
                if (Gemas>=50)
                {
                    Loja.ComprarItem("gelo", 50, "Tema Adquirido", prefs, Loja_fragment.this, new Loja.ComprarCallback() {
                        @Override
                        public void onSuccess() {
                            txtComprarGelo.setText("Adquirido");
                            txtComprarGelo.setEnabled(false);
                        }
                    });

                }//Se o usuário possuir 50 ou mais gemas, prossegue com a compra
                //E torna o Botão Indisponivel para compra novamente, alterando o texto para "Adquirido"

                else
                {
                    SaldoInsuficiente.show();
                }//Senão retorna saldo insuficiente

            }
        });//Interação com o Botão de Comprar o Tema Gelo

        txtComprarLeitura.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                //Pego a gemas do usuário
                Integer Gemas = prefs.getInt("moedas", 0);
                if (Gemas>=50)
                {
                    temaAdquirido.show();
                    txtComprarLeitura.setText("Adquirido");
                    txtComprarLeitura.setEnabled(false);
                }//Se o usuário possuir 50 ou mais gemas, prossegue com a compra
                //E torna o Botão Indisponivel para compra novamente, alterando o texto para "Adquirido"

                else
                {
                    SaldoInsuficiente.show();
                }//Senão retorna saldo insuficiente

            }
        });//Interação com o Botão de Comprar o Tema Leitura

        txtComprarBooster.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                //Pego a gemas do usuário
                Integer Gemas = prefs.getInt("moedas", 0);
                if (Gemas >= 20)
                {
                    //Realizo a compra
                    Loja.ComprarItem("booster",20,"PowerUp Adquirido",prefs,Loja_fragment.this,new Loja.ComprarCallback()
                    {
                        @Override
                        public void onSuccess() {
                            //Ignora
                        }
                    });

                }//Se o Usuário possuir 20 ou mais gemas, prossegue com a compra
                else
                {
                    SaldoInsuficiente.show();
                }//Senão retorna saldo insuficiente

            }
        });//Interação com o Botão de Comprar Booster de XP?

        txtComprarOfensiva.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View view)
            {
                //Pego a gemas do usuário
                Integer Gemas = prefs.getInt("moedas", 0);

                if (Gemas>=30)
                {

                    //Realizo a compra
                    Loja.ComprarItem("congelamento", 30, "PowerUp Adquirido", prefs, Loja_fragment.this, new Loja.ComprarCallback() {
                        @Override
                        public void onSuccess() {
                            //Ignora
                        }
                    });

                }//Se o usuário possuir 20 ou mais gemas, prossegue com a compra

                else
                {
                    SaldoInsuficiente.show();
                }//Senão retorna saldo insuficiente


            }
        });//Interação com o Botão de Comprar Congelamentos


        return view;
    }

    private void VerificarTemas()
    {
        //Verifico se o tema já foi comprado
        //Verifico o token
        Auth.verificarToken(requireActivity(), prefs, true, new Auth.AuthCallback() {

            @Override
            public void onSuccess()
            {
                //Se token for valido
                Loja.VerificarTema(prefs,Loja_fragment.this,new  Loja.TemaCallback(){
                    @Override
                    public void onSuccess(Boolean valor)
                    {
                        if(valor == true)
                        {
                            txtComprarGelo.setText("Adquirido");
                            txtComprarGelo.setEnabled(false);
                        }
                    }

                    @Override
                    public void onError()
                    {
                        //Se der erro a requisição:
//                        txtComprarGelo.setText("Comprar");
//                        txtComprarGelo.setEnabled(true);
                    }

                });
            }
        });

    }
}