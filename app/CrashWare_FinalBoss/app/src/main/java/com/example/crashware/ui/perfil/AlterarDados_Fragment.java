package com.example.crashware.ui.perfil;

import android.content.Context;
import android.content.Intent;
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

import com.example.crashware.R;
import com.example.crashware.ui.aulas.ModuloSoftware;
import com.example.crashware.ui.senha.RedefinirSenha;


public class AlterarDados_Fragment extends Fragment {

    EditText txtNovoNome, txtNovoEmail, txtTelefone, txtConfirmarTelefone, txtSenhaAtual;
    TextView txtNomeVinculado, txtEmailVinculado;
    Button btnAlterarNome, btnAlterarEmail, btnAdicionarTelefone, btnMudarSenha;
    ImageView imgVoltar, imgGoogle, imgGithub;

    SharedPreferences prefs;

    String nome, email;

    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public AlterarDados_Fragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment alterar_dados.
     */
    // TODO: Rename and change types and number of parameters
    public static AlterarDados_Fragment newInstance(String param1, String param2) {
        AlterarDados_Fragment fragment = new AlterarDados_Fragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
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
        View view = inflater.inflate(R.layout.fragment_alterar_dados, container, false);

        btnAdicionarTelefone = view.findViewById(R.id.btnAdicionarTelefone       );
        btnAlterarEmail      = view.findViewById(R.id.btnAlterarEmail            );
        btnAlterarNome       = view.findViewById(R.id.btnAlterarNome             );
        btnMudarSenha        = view.findViewById(R.id.btnConfirmarSenhaAtual     );
        txtTelefone          = view.findViewById(R.id.campoNumeroTelefone        );
        txtConfirmarTelefone = view.findViewById(R.id.campoConfirmeNumeroTelefone);
        txtEmailVinculado    = view.findViewById(R.id.campoEmailVinculado        );
        txtNomeVinculado     = view.findViewById(R.id.campoNomeAtual             );
        txtNovoEmail         = view.findViewById(R.id.campoNovoEmail             );
        txtNovoNome          = view.findViewById(R.id.campoNovoNome              );
        txtSenhaAtual        = view.findViewById(R.id.campoSenhaAtual            );
        imgVoltar            = view.findViewById(R.id.imgVoltarCampos            );
        imgGithub            = view.findViewById(R.id.imgGitHub                  );
        imgGoogle            = view.findViewById(R.id.imgGoogle                  );

        nome  = prefs.getString("nome", null );
        email = prefs.getString("email", null);

        Toast Preencha = Toast.makeText(getContext(), "Preencha o campo Requisitado!", Toast.LENGTH_LONG);
        Toast DiferenteEmail = Toast.makeText(getContext(), "O Novo Email deve ser diferente do anterior!", Toast.LENGTH_LONG);
        Toast DiferenteNome = Toast.makeText(getContext(), "O Novo Nome deve ser diferente do anterior!", Toast.LENGTH_LONG);
        Toast Sucesso = Toast.makeText(getContext(), "Campo Alterado com sucesso!", Toast.LENGTH_LONG);
        Toast Telefone = Toast.makeText(getContext(), "Telefone adicionado", Toast.LENGTH_LONG);
        Toast FalhaTelefone = Toast.makeText(getContext(), "Campo de confirmação deve ser igual ao telefone!", Toast.LENGTH_LONG);
        Toast Falha = Toast.makeText(getContext(), "Falha ao alterar o Campo", Toast.LENGTH_LONG);


        txtNomeVinculado.setText(nome);
        txtEmailVinculado.setText(email);

        btnAlterarNome.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                String novoNome = txtNovoNome.getText().toString().trim();
                String nomeAtual = txtNomeVinculado.getText().toString().trim();

                if (novoNome.isEmpty())
                {
                    Preencha.show();
                }
                else if (novoNome.equals(nomeAtual))
                {
                    DiferenteNome.show();
                }
                else
                {
                    nome = novoNome;

                    txtNomeVinculado.setText(nome);
                    txtNovoNome.setText("");

                    // salva no SharedPreferences
                    prefs.edit().putString("nome", nome).apply();

                    Sucesso.show();
                }
            }
        });//

        btnAlterarEmail.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                String novoEmail = txtNovoEmail.getText().toString().trim();
                String emailAtual = txtEmailVinculado.getText().toString().trim();

                if (novoEmail.isEmpty())
                {
                    Preencha.show();
                }//se Campo de nome for vazio mostra a mensagem para preencher
                else if (novoEmail.equals(emailAtual))
                {
                    DiferenteEmail.show();
                }//se for igual o email vinculado, mostra mensagem que precisa ser diferente
                else
                {
                    email = novoEmail;

                    txtEmailVinculado.setText(email);
                    txtNovoEmail.setText("");

                    // salva no SharedPreferences
                    prefs.edit().putString("email", email).apply();

                    Sucesso.show();
                }
            }
        });//

        btnAdicionarTelefone.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                String telefone = txtTelefone.getText().toString().trim();
                String confirmarTelefone = txtConfirmarTelefone.getText().toString().trim();

                if (telefone.isEmpty() || confirmarTelefone.isEmpty())
                {
                    Preencha.show();
                }//se os Campos forem vazio mostra a mensagem para preencher
                else if (!telefone.equals(confirmarTelefone))
                {
                    FalhaTelefone.show();
                }//se o telefone for diferente da confirmação, mostra mensagem de erro
                else
                {
                    Telefone.show();
                }

            }
        });//

        btnMudarSenha.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                Intent alterarSenha = new Intent(getActivity(), RedefinirSenha.class);
                startActivity(alterarSenha);
                //verifica a tela atual e redireciona para a Activity desejada

//                if (txtSenhaAtual.getText().toString().equals(senha))
//                {
//                    Intent alterarSenha = new Intent(getActivity(), RedefinirSenha.class);
//                    startActivity(alterarSenha);
//                    //verifica a tela atual e redireciona para a Activity desejada
//                }


            }
        });//Interação com botão de alterar senha



        imgVoltar.setOnClickListener(new View.OnClickListener()
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
        });//interação com a imagem de voltar





        return view;
    }
}