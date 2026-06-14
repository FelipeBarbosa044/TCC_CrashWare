package com.example.crashware.ui.anotacoes;

import static android.content.Context.MODE_PRIVATE;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;

import android.text.Annotation;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;
import androidx.recyclerview.widget.LinearLayoutManager;


import com.example.crashware.ui.Adapters.Anotacao_Adapter;
import com.example.crashware.R;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.ItemTouchHelper;

import com.example.crashware.ui.Models.Anotacao;
import com.example.crashware.ui.api.Anotacoes;
import com.example.crashware.ui.api.Auth;
import com.example.crashware.ui.navegacao.Home;
import com.example.crashware.ui.perfil.AlterarDados_Fragment;
import com.google.android.material.snackbar.Snackbar;


public class Anotacoes_fragment extends Fragment {

    //Váriaveis e Funções que serão utilizadas e iniciadas no código
    private ArrayList<Anotacao> listaAnotacoes = new ArrayList<>();
    private ArrayList<Anotacao> listaOriginal = new ArrayList<>();

    RecyclerView rvListaAnotacoes;

    Anotacao_Adapter adapter;
    SharedPreferences prefs;

    EditText txtbarraPesquisa;

    ConstraintLayout cardAnotacao1,cardAnotacao2,cardAnotacao3;

    ImageView imgAddAnotacoes, imgLayoutLogo;

    TextView txtTitulo1, txtConteudo1, txtTitulo2, txtConteudo2;



    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    //
    public Anotacoes_fragment()
    {
        // Required empty public constructor
    }
    //

    // TODO: Rename and change types and number of parameters
    public static Anotacoes_fragment newInstance(String param1, String param2) {
        Anotacoes_fragment fragment = new Anotacoes_fragment();
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
        View view = inflater.inflate(R.layout.fragment_anotacoes, container, false);

        prefs = requireContext().getSharedPreferences("CrashWare", Context.MODE_PRIVATE);

        getParentFragmentManager().setFragmentResultListener(
                "atualizar_anotacoes",
                this,
                (requestKey, bundle) -> {
                    carregarAnotacoes();
                }
        );

        carregarAnotacoes();


        imgAddAnotacoes  = view.findViewById(R.id.imgAddAnotacoes   );
        txtbarraPesquisa = view.findViewById(R.id.txtBarraPesquisa  );
        rvListaAnotacoes = view.findViewById(R.id.recyclerView);

        //LayoutManager para atualizar a cada anotação
        rvListaAnotacoes.setLayoutManager(new LinearLayoutManager(getContext()));
        rvListaAnotacoes.setItemAnimator(new DefaultItemAnimator());

        // 2. Adapter depois
        adapter = new Anotacao_Adapter(listaAnotacoes, new Anotacao_Adapter.OnItemClickListener()
        {
            @Override
            public void onClick(Anotacao anotacao, int position)
            {
                //Leva para o fragment usado para editar anotações
                EditarAnotacao_Fragment fragment = new EditarAnotacao_Fragment();

                //ao ir para o fragment, puxa as informações necessárias para alterar o correto
                Bundle bundle = new Bundle();
                bundle.putInt("idAnotacao", anotacao.getIdAnotacao());
                bundle.putString("titulo", anotacao.getTitulo());
                bundle.putString("conteudo", anotacao.getConteudo());
                bundle.putString("dataCriacao", anotacao.getDataCriacao());
                bundle.putString("dataEdicao", anotacao.getDataEdicao());

                bundle.putInt("position", position); // puxa a posição na arraylist da anotação selecionada

                fragment.setArguments(bundle);


                //Tramite de troca de fragmento
                getParentFragmentManager()
                        .beginTransaction()
                        .replace(R.id.fragment_container, fragment)
                        .addToBackStack(null)
                        .commit();
            }
        });//Interação com A anotação desejada da lista

        //Selecionando o adapter para a ArrayList
        rvListaAnotacoes.setAdapter(adapter);
        configurarSwipe();


        txtbarraPesquisa.addTextChangedListener(new TextWatcher() {
            @Override
            public void afterTextChanged(Editable s)
            {

            }//função após mudar o texto

            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after)
            {

            }//Função antes de mudar o texto

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count)
            {
                filtrarAnotacoes(s.toString());
            }//Quando houver alteração no texto da barra, executa função de pesquisa
        });//Função ao interagir com a barra de pesquisa


        imgAddAnotacoes.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                Fragment NovaAnotacaoFragment = new NovaAnotacao_Fragment();


                ((Home) requireActivity()).irParaTelaExtra(NovaAnotacaoFragment);
            }
        });//Interação com a imagem, levando a tela de adicionar nova anotação



        return view;

    }

    //Método usado para pesquisa de anotações
    private void filtrarAnotacoes(String texto)
    {
        // Limpa a lista exibida
        listaAnotacoes.clear();

        // Se a barra estiver vazia
        if(texto.isEmpty())
        {
            // Mostra tudo novamente
            listaAnotacoes.addAll(listaOriginal);
        }
        else
        {
            // Deixa tudo minúsculo
            texto = texto.toLowerCase().trim();

            // Percorre todas as anotações
            for(Anotacao anotacao : listaOriginal)
            {
                // Verifica título e conteúdo
                String titulo = anotacao.getTitulo();
                String conteudo = anotacao.getConteudo();

                if(titulo != null && conteudo != null)
                {
                    if(titulo.toLowerCase().contains(texto)
                            ||
                            conteudo.toLowerCase().contains(texto))
                    {
                        listaAnotacoes.add(anotacao);
                    }
                }
            }
        }

        // Atualiza o RecyclerView
        adapter.notifyDataSetChanged();
    }

    @Override
    public void onResume()
    {
        super.onResume();

        carregarAnotacoes();

        if (adapter != null)
        {
            adapter.notifyDataSetChanged();
        }
    }

    //Formata a data correta (Horário removido da máscara de saída)
    private String formatarData(String dataApi)
    {
        try
        {
            if (dataApi == null || dataApi.isEmpty())
            {
                return "Sem data";
            }

            // Pega só essa parte: 2026-06-04T14:32:10
            if (dataApi.length() >= 19)
            {
                dataApi = dataApi.substring(0, 19);
            }

            SimpleDateFormat formatoEntrada =
                    new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault());

            // MODIFICADO: Mantido apenas o formato de data (dd/MM/yyyy)
            SimpleDateFormat formatoSaida =
                    new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());

            Date data = formatoEntrada.parse(dataApi);

            return formatoSaida.format(data);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return "Data inválida";
        }
    }

    private void carregarAnotacoes()
    {
        //Verifico o token
        Auth.verificarToken(requireActivity(), prefs, true, new Auth.AuthCallback()
        {
            @Override
            public void onSuccess()
            {

                //Carrego as anotações do usuario
                Anotacoes.Carregar_Anotacoes(prefs, Anotacoes_fragment.this, new Anotacoes.AnotacaoCallback()
                {
                    @Override
                    public void sucesso(List<Anotacoes.AnotacaoResponse> anotacoes) {

                        try
                        {
                            listaAnotacoes.clear();
                            listaOriginal.clear();

                            for (Anotacoes.AnotacaoResponse item : anotacoes)
                            {

                                //Pego os valores da array
                                Integer id = item.id_anotacao;
                                String titulo = item.titulo;
                                String texto = item.texto;
                                String criado_em = formatarData(item.criado_em);
                                String atualizado_em = formatarData(item.atualizado_em);


                                Anotacao anotacao =
                                        new Anotacao(id,titulo, texto, criado_em, atualizado_em);

                                listaAnotacoes.add(anotacao);
                                listaOriginal.add(anotacao);
                            }

                            //Atualiza o adapter
                            adapter.notifyDataSetChanged();
                        }
                        catch (Exception e)
                        {
                            e.printStackTrace();
                        }

                    }
                });

            }//Anotacoes API

        });//Verificar Token

    }//Carregar Anotacoes
    private void salvarAnotacoes()
    {
        try
        {
            JSONArray array = new JSONArray();

            for (Anotacao anotacao : listaOriginal)
            {
                JSONObject obj = new JSONObject();

                obj.put("idAnotacao", anotacao.getIdAnotacao());
                obj.put("titulo", anotacao.getTitulo());
                obj.put("conteudo", anotacao.getConteudo());
                obj.put("dataCriacao", anotacao.getDataCriacao());
                obj.put("dataEdicao", anotacao.getDataEdicao());

                array.put(obj);
            }

        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
    }//

    private void configurarSwipe()
    {
        ItemTouchHelper.SimpleCallback simpleCallback =
                new ItemTouchHelper.SimpleCallback(
                        0,
                        ItemTouchHelper.LEFT | ItemTouchHelper.RIGHT)
                {
                    @Override
                    public boolean onMove(@NonNull RecyclerView recyclerView,
                                          @NonNull RecyclerView.ViewHolder viewHolder,
                                          @NonNull RecyclerView.ViewHolder target)
                    {
                        return false;
                    }

                    @Override
                    public void onSwiped(@NonNull RecyclerView.ViewHolder viewHolder,
                                         int direction)
                    {
                        int position = viewHolder.getAdapterPosition();
                        if(position == RecyclerView.NO_POSITION)
                        {
                            return;
                        }




                        // salva anotação removida
                        Anotacao removida = listaAnotacoes.get(position);

                        // pega o id da anotação
                        int idAnotacao = removida.getIdAnotacao();

                        // remove da lista
                        listaAnotacoes.remove(position);

                        // remove também da lista original
                        listaOriginal.remove(removida);

                        // atualiza recyclerView
                        adapter.notifyItemRemoved(position);
                        adapter.notifyItemChanged(position);

                        // salva alterações
                        salvarAnotacoes();

                        // snackbar desfazer
                        Snackbar.make(
                                        rvListaAnotacoes,
                                        "Anotação removida",
                                        Snackbar.LENGTH_LONG
                                )

                                .setAction("DESFAZER", v ->
                                {
                                    listaAnotacoes.add(position, removida);

                                    listaOriginal.add(position, removida);

                                    adapter.notifyItemInserted(position);
                                    rvListaAnotacoes.scrollToPosition(position);

                                    salvarAnotacoes();
                                })
                                .addCallback(new Snackbar.Callback() {
                                    @Override
                                    public void onDismissed(Snackbar snackbar, int event) {
                                        super.onDismissed(snackbar, event);

                                        // Se o usuário NÃO clicou em "DESFAZER"
                                        if (event != Snackbar.Callback.DISMISS_EVENT_ACTION) {

                                            // Aqui remove do banco
                                            Anotacoes.Deletar_Anotacao(idAnotacao,prefs,Anotacoes_fragment.this);
                                        }
                                    }
                                })

                                .show();
                    }

                    @Override
                    public void onChildDraw(@NonNull Canvas c,
                                            @NonNull RecyclerView recyclerView,
                                            @NonNull RecyclerView.ViewHolder viewHolder,
                                            float dX,
                                            float dY,
                                            int actionState,
                                            boolean isCurrentlyActive)
                    {
                        View itemView = viewHolder.itemView;

                        Paint paint = new Paint();

                        paint.setColor(Color.parseColor("#D32F2F"));

                        if (dX > 0)
                        {
                            c.drawRect(
                                    itemView.getLeft(),
                                    itemView.getTop(),
                                    itemView.getLeft() + dX,
                                    itemView.getBottom(),
                                    paint
                            );
                        }
                        else
                        {
                            c.drawRect(
                                    itemView.getRight() + dX,
                                    itemView.getTop(),
                                    itemView.getRight(),
                                    itemView.getBottom(),
                                    paint
                            );
                        }
                        itemView.setAlpha(1 - (Math.abs(dX) / recyclerView.getWidth()));

                        super.onChildDraw(
                                c,
                                recyclerView,
                                viewHolder,
                                dX,
                                dY,
                                actionState,
                                isCurrentlyActive
                        );
                    }
                };

        new ItemTouchHelper(simpleCallback)
                .attachToRecyclerView(rvListaAnotacoes);

    }//

}