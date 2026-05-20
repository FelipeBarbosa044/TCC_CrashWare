package com.example.crashware.ui.navegacao;

import static android.app.ProgressDialog.show;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.example.crashware.R;
import com.example.crashware.ui.sistemas.Ofensiva_Manager;


public class Loja_fragment extends Fragment {

    //Objetos que serão Utilizados
    TextView txtComprarTemaMeiaNoite, txtComprarGelo, txtComprarBooster,
            txtComprarOfensiva, txtComprarLeitura;

    //Váriaveis que serão Utilizadas

    int Gemas;

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


        //A serem substituidas pelas gemas do usuário logado
        Gemas = prefs.getInt("moedas", 0);


        txtComprarTemaMeiaNoite.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View view)
            {
                if (Gemas>=1500)
                {
                    Gemas= Gemas - 1500;
                    temaAdquirido.show();
                    txtComprarTemaMeiaNoite.setText("Adquirido");
                    txtComprarGelo.setEnabled(false);
                }//Se o usuário possuir 1500 ou mais gemas, prossegue com a compra
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
                if (Gemas>=1500)
                {
                    Gemas= Gemas - 1500;
                    temaAdquirido.show();
                    txtComprarGelo.setText("Adquirido");
                    txtComprarGelo.setEnabled(false);
                }//Se o usuário possuir 1500 ou mais gemas, prossegue com a compra
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
                if (Gemas>=1500)
                {
                    Gemas= Gemas - 1500;
                    temaAdquirido.show();
                    txtComprarLeitura.setText("Adquirido");
                    txtComprarLeitura.setEnabled(false);
                }//Se o usuário possuir 1500 ou mais gemas, prossegue com a compra
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
                if (Gemas>=600)
                {
                    Gemas= Gemas - 600;
                    PowerUpAdquirido.show();
                    //mostra o Toast de PowerUp Adquirido
                }//Se o Usuário possuir 600 ou mais gemas, prossegue com a compra


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
                if (Gemas>=600)
                {
                    Gemas= Gemas - 600;
                    PowerUpAdquirido.show();
                    //Mostra o Toast de Power Up Adquirido

                    //importa a classe da ofensiva com suas funções
                    Ofensiva_Manager ofensivaManager =
                            new Ofensiva_Manager(requireContext());

                    //aciona a função de comprar um congelamento
                    ofensivaManager.adicionarCongelamento();
                    //

                    //Para mostrar a quantidade de congelamentos
                    //int congelamentos = ofensivaManager.getCongelamentos();

                }//Se o usuário possuir 600 ou mais gemas, prossegue com a compra

                else
                {
                    SaldoInsuficiente.show();
                }//Senão retorna saldo insuficiente


            }
        });//Interação com o Botão de Comprar Congelamentos


        return view;
    }
}