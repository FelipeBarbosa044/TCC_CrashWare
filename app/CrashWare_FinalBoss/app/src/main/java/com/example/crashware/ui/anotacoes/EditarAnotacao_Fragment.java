package com.example.crashware.ui.anotacoes;

import static android.content.Context.MODE_PRIVATE;
import static android.widget.Toast.LENGTH_LONG;

import android.content.Context;
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
import android.widget.Toast;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import com.example.crashware.R;
import com.example.crashware.ui.api.Anotacoes;
import com.example.crashware.ui.api.Auth;

import org.json.JSONArray;
import org.json.JSONObject;


public class EditarAnotacao_Fragment extends Fragment {

    //Objetos Utilizados
    SharedPreferences prefs;
    Button btnEditarAnotacao;
    EditText txtAnotacao, txtTituloAnotacao;
    ImageView imgVoltarAnotacoes;

    TextView txtDataEdicao, txtDataCriacao;

    //Váriaveis utilizadas
    boolean EstadoAnotacao = false;

    String tituloAntigo = "";
    String textoAntigo = "";

    int position = -1;
    int idAnotacao = -1;

    public EditarAnotacao_Fragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState)
    {

        View view = inflater.inflate(R.layout.fragment_editar_anotacao, container, false);

        //Inicia o Layout no Código
        txtAnotacao        = view.findViewById(R.id.txtAnotacao          );
        txtTituloAnotacao  = view.findViewById(R.id.txtTituloAnotacao    );
        btnEditarAnotacao  = view.findViewById(R.id.btnEditarAnotacao    );
        imgVoltarAnotacoes = view.findViewById(R.id.imgVoltarCampos);
        txtDataCriacao     = view.findViewById(R.id.txtDataCriacao       );
        txtDataEdicao      = view.findViewById(R.id.txtDataEdicao        );

        //Inicia o Shared Preferences
        prefs = requireContext().getSharedPreferences("CrashWare", Context.MODE_PRIVATE);

        // pega posição do item clicado
        if (getArguments() != null) {
            position = getArguments().getInt("position", -1);
            idAnotacao = getArguments().getInt("idAnotacao", -1);

            tituloAntigo = getArguments().getString("titulo");
            textoAntigo = getArguments().getString("conteudo");

            String dataCriacao = getArguments().getString("dataCriacao");
            String dataEdicao = getArguments().getString("dataEdicao");


            txtTituloAnotacao.setText(tituloAntigo);
            txtAnotacao.setText(textoAntigo);

            txtDataCriacao.setText(dataCriacao);
            txtDataEdicao.setText(dataEdicao);
        }

        // travado inicialmente
        txtAnotacao.setEnabled(false);
        txtTituloAnotacao.setEnabled(false);

        // voltar
        imgVoltarAnotacoes.setOnClickListener(v ->
                requireActivity()
                        .getSupportFragmentManager()
                        .popBackStack()
        );

        // editar / salvar
        btnEditarAnotacao.setOnClickListener(v -> {

            if (!EstadoAnotacao) {

                txtAnotacao.setEnabled(true);
                txtTituloAnotacao.setEnabled(true);
                txtAnotacao.requestFocus();

                btnEditarAnotacao.setText("Concluir");
                EstadoAnotacao = true;

                Toast.makeText(getContext(),
                        "Edite sua anotação",
                        Toast.LENGTH_SHORT).show();

            } else {

                try {
                    //Pega os Valores
                    String novoTitulo = txtTituloAnotacao.getText().toString();
                    String novoConteudo = txtAnotacao.getText().toString();
                    String novaDataEdicao = pegarDataAtual();

                    if(novoTitulo.isEmpty())
                    {
                        Toast.makeText(getContext(),"O Título Deve ser Preenchido",LENGTH_LONG).show();
                        return;
                    }

                    Toast.makeText(getContext(),"Editando Anotação...",LENGTH_LONG).show();
                    //Pega a lista no SharedPreferences
//                    String json = prefs.getString("lista_anotacoes", "[]");
//                    JSONArray array = new JSONArray(json);

                    if (position != -1) {


                        //Verifico o token
                        Auth.verificarToken(requireActivity(), prefs, true, new Auth.AuthCallback()
                        {

                            @Override
                            public void onSuccess()
                            {

                                //Salva no Banco
                                Anotacoes.Editar_Anotacao(novoTitulo,novoConteudo,idAnotacao,prefs,EditarAnotacao_Fragment.this);

                                //Exibo na tela a nova data de edição
                                txtDataEdicao.setText(novaDataEdicao);


                            }
                        });


                    }

                    //Sai do modo Edição
                    txtAnotacao.setEnabled(false);
                    txtTituloAnotacao.setEnabled(false);
                    btnEditarAnotacao.setText("Editar");
                    EstadoAnotacao = false;

                    Toast.makeText(requireActivity(), "Edição salva!", Toast.LENGTH_SHORT).show();

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

        return view;
    }

    private String pegarDataAtual()
    {
        SimpleDateFormat formato =
                new SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault());

        return formato.format(new Date());
    }
}
