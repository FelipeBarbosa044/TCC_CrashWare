package com.example.crashware.ui.perfil;

import static android.content.Context.MODE_PRIVATE;

import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import com.example.crashware.R;
import com.example.crashware.ui.Adapters.ConquistaAdapter;
import com.example.crashware.ui.Models.Conquista;
import com.example.crashware.ui.api.User;

import java.util.ArrayList;
import java.util.List;

/**
 * Fragment responsável por exibir as conquistas do usuário
 */
public class Conquistas_Fragment extends Fragment {

    // RecyclerViews
    RecyclerView rvConquistasAdquiridas;
    RecyclerView rvConquistasBloqueadas;

    // Listas que armazenam as conquistas
    List<Conquista> listaConquistas;
    List<Conquista> listaConquistasBloqueadas;

    // Adapters do RecyclerView
    ConquistaAdapter adapter;
    ConquistaAdapter adapterBloqueadas;

    // Botão voltar
    ImageView imgVoltar;

    // Parâmetros do fragment
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    private String mParam1;
    private String mParam2;

    public Conquistas_Fragment() {
        // Construtor vazio obrigatório
    }

    /**
     * Método usado para criar o Fragment
     */
    public static Conquistas_Fragment newInstance(
            String param1,
            String param2
    ) {
        Conquistas_Fragment fragment = new Conquistas_Fragment();

        Bundle args = new Bundle();

        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);

        fragment.setArguments(args);

        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Recupera parâmetros enviados ao Fragment
        if (getArguments() != null) {

            mParam1 = getArguments().getString(ARG_PARAM1);

            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(
            LayoutInflater inflater,
            ViewGroup container,
            Bundle savedInstanceState
    ) {

        // Infla o layout XML do Fragment
        View view = inflater.inflate(
                R.layout.fragment_conquistas,
                container,
                false
        );

        // Liga os componentes XML com o Java
        imgVoltar = view.findViewById(R.id.imgVoltarCampos);

        rvConquistasAdquiridas =
                view.findViewById(R.id.rvConquistasAdquiridas);

        rvConquistasBloqueadas =
                view.findViewById(R.id.rvConquistasBloqueadas);

        // Clique do botão voltar
        imgVoltar.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {

                // Simula botão voltar do celular
                requireActivity()
                        .getOnBackPressedDispatcher()
                        .onBackPressed();
            }
        });

        // Define o layout do RecyclerView
        rvConquistasAdquiridas.setLayoutManager(
                new LinearLayoutManager(getContext())
        );

        rvConquistasBloqueadas.setLayoutManager(
                new LinearLayoutManager(getContext())
        );

        // Inicializa as listas vazias
        listaConquistas = new ArrayList<>();

        listaConquistasBloqueadas = new ArrayList<>();

        // Cria os adapters
        adapter = new ConquistaAdapter(listaConquistas);

        adapterBloqueadas =
                new ConquistaAdapter(listaConquistasBloqueadas);

        // Define os adapters no RecyclerView
        rvConquistasAdquiridas.setAdapter(adapter);

        rvConquistasBloqueadas.setAdapter(adapterBloqueadas);

        // Pega o SharedPreferences
        SharedPreferences prefs =
                requireActivity()
                        .getSharedPreferences(
                                "CrashWare",
                                MODE_PRIVATE
                        );

        // Chama a API para buscar as conquistas
        User.ExibirConquista(
                prefs,

                // Callback da API
                new User.ConquistaCallback() {

                    @Override
                    public void sucesso(
                            List<User.ConquistaResponse> conquistasApi
                    ) {

                        // Limpa as listas antes de atualizar
                        listaConquistas.clear();

                        listaConquistasBloqueadas.clear();

                        // Percorre todas as conquistas recebidas
                        for (User.ConquistaResponse conquista : conquistasApi)
                        {

                            // Nome da conquista
                            String nome =
                                    conquista.nome_conquista;

                            // Descrição da conquista
                            String descricao =
                                    conquista.descricao;

                            //Tipo da conquista
                            String tipo =
                                    conquista.tipo_conquista;

                            /*
                             * Aqui você cria um objeto Conquista
                             * para adicionar ao RecyclerView
                             */
                            Conquista novaConquista =
                                    new Conquista(
                                            nome,
                                            descricao,
                                            R.drawable.banner_icon
                                    );

                            /*
                             * Atualmente sua API só retorna
                             * conquistas desbloqueadas.
                             *
                             * Então estamos adicionando
                             * tudo na lista de adquiridas.
                             */
                            listaConquistas.add(novaConquista);

//                            /*
//                             * FUTURAMENTE:
//                             *
//                             * Se sua API retornar algo como:
//                             *
//                             * conquista.desbloqueada
//                             *
//                             * você poderá fazer:
//                             *
//                             * if(conquista.desbloqueada)
//                             * {
//                             *     listaConquistas.add(novaConquista);
//                             * }
//                             * else
//                             * {
//                             *     listaConquistasBloqueadas.add(novaConquista);
//                             * }
//                             */
                        }

                        // Atualiza os RecyclerViews
                        adapter.notifyDataSetChanged();

//                        adapterBloqueadas.notifyDataSetChanged();
                    }
                }
        );
        User.ExibirConquistaBloqueada(
                prefs,
                // Callback da API
                new User.ConquistaBloqueadaCallback()
                {

                    @Override
                    public void sucesso(
                            List<User.ConquistaResponse> conquistasApi
                    )
                    {


                        listaConquistasBloqueadas.clear();

                        // Percorre todas as conquistas recebidas
                        for (User.ConquistaResponse conquista : conquistasApi)
                        {

                            // Nome da conquista
                            String nome =
                                    conquista.nome_conquista;

                            // Descrição da conquista
                            String descricao =
                                    conquista.descricao;


                            //Tipo da conquista
                            String tipo =
                                    conquista.tipo_conquista;
                            /*


                             * Aqui você cria um objeto Conquista
                             * para adicionar ao RecyclerView
                             */
//                            Conquista novaConquista =
//                                        new Conquista(
//                                                nome,
//                                                descricao,
//                                                R.drawable.hardware_icon
//                                        );
                            if  ("Hardware".equals(tipo))
                            {
                                Conquista novaConquista =
                                        new Conquista(
                                                nome,
                                                descricao,
                                                R.drawable.hardware_icon
                                        );
                                listaConquistasBloqueadas.add(novaConquista);
                            }//
                            if ("Software".equals(tipo))
                            {
                                Conquista novaConquista =
                                        new Conquista(
                                                nome,
                                                descricao,
                                                R.drawable.softwarehome_icon
                                        );
                                listaConquistasBloqueadas.add(novaConquista);
                            }
                            if ("Outro".equals(tipo))
                            {
                                Conquista novaConquista =
                                        new Conquista(
                                                nome,
                                                descricao,
                                                R.drawable.banner_icon
                                        );
                                listaConquistasBloqueadas.add(novaConquista);
                            }
//                            else
//                            {
//                                Conquista novaConquista =
//                                    new Conquista(
//                                            nome,
//                                            descricao,
//                                            R.drawable.ametista_icon
//                                    );
//                                listaConquistasBloqueadas.add(novaConquista);
//
//                            }



                            //Add conquistas bloqueadas na array
                           // listaConquistasBloqueadas.add(novaConquista);


                        }

                        // Atualiza os RecyclerViews
//                        adapter.notifyDataSetChanged();

                        adapterBloqueadas.notifyDataSetChanged();
                    }
                }
        );

        // Retorna a View do Fragment
        return view;
    }
}