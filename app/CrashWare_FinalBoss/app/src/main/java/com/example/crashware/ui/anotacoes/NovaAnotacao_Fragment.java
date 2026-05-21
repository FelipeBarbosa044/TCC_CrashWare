package com.example.crashware.ui.anotacoes;

import static android.content.Context.MODE_PRIVATE;

import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import com.example.crashware.R;
import com.example.crashware.ui.Models.Anotacao;

import java.util.ArrayList;


public class NovaAnotacao_Fragment extends Fragment {

    private ArrayList<Anotacao> listaAnotacoes = new ArrayList<>();



    SharedPreferences prefs;

    ImageView imgVoltarNovaAnotacao;

    EditText txtNovaAnotacao, txtTituloNovaAnotacao;

    TextView txtDataCriacao;
    Button btnSalvarNovaAnotacao;


    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public NovaAnotacao_Fragment() {
        // Required empty public constructor
    }

    public static NovaAnotacao_Fragment newInstance(String param1, String param2) {
        NovaAnotacao_Fragment fragment = new NovaAnotacao_Fragment();
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
        View view = inflater.inflate(R.layout.fragment_nova_anotacao, container, false);

        //Iniciando o Layout no Código
        imgVoltarNovaAnotacao = view.findViewById(R.id.imgVoltarCampos);
        btnSalvarNovaAnotacao = view.findViewById(R.id.btnSalvarNovaAnotacao);
        txtNovaAnotacao       = view.findViewById(R.id.txtNovaAnotacao      );
        txtTituloNovaAnotacao = view.findViewById(R.id.txtTituloNovaAnotacao);
        txtDataCriacao        = view.findViewById(R.id.txtDataCriacao       );


        prefs = requireActivity().getSharedPreferences("dados", MODE_PRIVATE);

        String dataAtual = pegarDataAtual();
        txtDataCriacao.setText(String.valueOf(dataAtual));




        btnSalvarNovaAnotacao.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                try
                {
                    String titulo = txtTituloNovaAnotacao.getText().toString();
                    String conteudo = txtNovaAnotacao.getText().toString();

                    String json =
                            prefs.getString("lista_anotacoes", "[]");

                    JSONArray array = new JSONArray(json);

                    JSONObject objeto = new JSONObject();

                    objeto.put("titulo", titulo);
                    objeto.put("conteudo", conteudo);
                    objeto.put("dataCriacao", pegarDataAtual());
                    objeto.put("dataEdicao", "Nunca editado");

                    array.put(objeto);

                    prefs.edit()
                            .putString("lista_anotacoes", array.toString())
                            .apply();

                }
                catch (Exception e)
                {
                    e.printStackTrace();
                }

                requireActivity()
                        .getSupportFragmentManager()
                        .popBackStack();
            }
        });//Interação com botão de salvar nova anotação, levando para a tela geral de anotações e transcrevendo os textos dos EditText para strings a serem salvas no banco

        imgVoltarNovaAnotacao.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                requireActivity()//puxa o fragment atual
                        .getSupportFragmentManager()//acessa o gerenciador das fragments
                        .popBackStack();//simula o botão "voltar" do celular

            }
        });//interação de clique com a imagem de voltar retornando para a tela de anotações

        return view;
    }

    private String pegarDataAtual()
    {
        SimpleDateFormat formato =
                new SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault());

        return formato.format(new Date());
    }

}