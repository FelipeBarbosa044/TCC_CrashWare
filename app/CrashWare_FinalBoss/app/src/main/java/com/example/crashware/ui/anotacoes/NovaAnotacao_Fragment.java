package com.example.crashware.ui.anotacoes;

import static android.content.Context.MODE_PRIVATE;
import static android.widget.Toast.LENGTH_LONG;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import com.example.crashware.R;
import com.example.crashware.ui.Models.Anotacao;
import com.example.crashware.ui.api.Anotacoes;
import com.example.crashware.ui.api.Auth;

import java.util.ArrayList;


public class NovaAnotacao_Fragment extends Fragment {

    private ArrayList<Anotacao> listaAnotacoes = new ArrayList<>();



    SharedPreferences prefs;

    ImageView imgVoltarNovaAnotacao;

    EditText txtNovaAnotacao, txtTituloNovaAnotacao;

    TextView txtDataCriacao;
    Button btnSalvarNovaAnotacao;

    ConstraintLayout cardAnotacao;


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
        imgVoltarNovaAnotacao = view.findViewById(R.id.imgVoltarCampos      );
        btnSalvarNovaAnotacao = view.findViewById(R.id.btnSalvarNovaAnotacao);
        txtNovaAnotacao       = view.findViewById(R.id.txtNovaAnotacao      );
        txtTituloNovaAnotacao = view.findViewById(R.id.txtTituloNovaAnotacao);
        txtDataCriacao        = view.findViewById(R.id.txtDataCriacao       );
        cardAnotacao          = view.findViewById(R.id.cardAnotacao         );

        String novaDataCriacao = pegarDataAtual();
        txtDataCriacao.setText(novaDataCriacao);

        prefs = requireContext().getSharedPreferences("CrashWare", Context.MODE_PRIVATE);

        cardAnotacao.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View view)
            {
                txtNovaAnotacao.requestFocus();
                InputMethodManager imm = (InputMethodManager)
                        requireContext().getSystemService(Context.INPUT_METHOD_SERVICE);

                imm.showSoftInput(txtNovaAnotacao, InputMethodManager.SHOW_IMPLICIT);
            }
        });

        btnSalvarNovaAnotacao.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {

                    String titulo = txtTituloNovaAnotacao.getText().toString();
                    String texto = txtNovaAnotacao.getText().toString();

                    if(titulo.isEmpty())
                    {
                        Toast.makeText(getContext(),"O Título Deve ser Preenchido",LENGTH_LONG).show();
                        return;
                    }

                    Toast.makeText(getContext(),"Criando Anotação...",LENGTH_LONG).show();

                    //Verifico o token
                    Auth.verificarToken(requireActivity(), prefs, true, new Auth.AuthCallback()
                    {

                        @Override
                        public void onSuccess()
                        {
                            try {
                                //Salva no Banco
                                Anotacoes.Adicionar_Anotacao(titulo, texto, prefs, NovaAnotacao_Fragment.this);

                            } catch (Exception e)
                            {
                                e.printStackTrace();
                            }
                        }
                    });


//                requireActivity()
//                        .getSupportFragmentManager()
//                        .popBackStack();
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
                new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());

        return formato.format(new Date());
    }
}