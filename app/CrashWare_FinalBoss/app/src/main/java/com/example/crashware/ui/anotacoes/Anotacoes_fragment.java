package com.example.crashware.ui.anotacoes;

import static android.content.Context.MODE_PRIVATE;

import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;

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

import java.util.ArrayList;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.ItemTouchHelper;

import com.example.crashware.ui.Models.Anotacao;
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
                Fragment novoFragmento = new NovaAnotacao_Fragment();

                getParentFragmentManager()
                        .beginTransaction()
                        .replace(R.id.fragment_container, novoFragmento)
                        .addToBackStack(null)
                        .commit();
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

    private void carregarAnotacoes()
    {


        try
        {
            SharedPreferences prefs =
                    requireActivity().getSharedPreferences("dados", MODE_PRIVATE);

            String json = prefs.getString("lista_anotacoes", "[]");

            JSONArray array = new JSONArray(json);

            listaAnotacoes.clear();
            listaOriginal.clear();

            for (int i = 0; i < array.length(); i++)
            {
                JSONObject obj = array.getJSONObject(i);

                String titulo = obj.getString("titulo");
                String conteudo = obj.getString("conteudo");
                String dataCriacao =
                        obj.optString("dataCriacao", "Sem data");

                String dataEdicao =
                        obj.optString("dataEdicao", "Nunca editado");

                Anotacao anotacao =
                        new Anotacao(titulo, conteudo, dataCriacao, dataEdicao);

                listaAnotacoes.add(anotacao);
                listaOriginal.add(anotacao);
            }
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
    }//

    private void salvarAnotacoes()
    {
        try
        {
            JSONArray array = new JSONArray();

            for (Anotacao anotacao : listaOriginal)
            {
                JSONObject obj = new JSONObject();

                obj.put("titulo", anotacao.getTitulo());
                obj.put("conteudo", anotacao.getConteudo());
                obj.put("dataCriacao", anotacao.getDataCriacao());
                obj.put("dataEdicao", anotacao.getDataEdicao());

                array.put(obj);
            }

            SharedPreferences prefs =
                    requireActivity()
                            .getSharedPreferences("dados", MODE_PRIVATE);

            prefs.edit()
                    .putString("lista_anotacoes", array.toString())
                    .apply();
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