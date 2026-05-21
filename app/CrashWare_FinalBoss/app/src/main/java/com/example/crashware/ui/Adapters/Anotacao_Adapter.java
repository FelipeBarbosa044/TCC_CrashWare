package com.example.crashware.ui.Adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.crashware.R;
import com.example.crashware.ui.Models.Anotacao;

import java.util.ArrayList;

public class Anotacao_Adapter extends RecyclerView.Adapter<Anotacao_Adapter.ViewHolder>
{

    //Váriaveis sobre funcionalidades presentes na classe

    //lista que salva a ordem das anotações
    private ArrayList<Anotacao> lista;

    //Função ao clicar em determinada anotação
    private OnItemClickListener listener;


    public interface OnItemClickListener
    {
        //Quando clicar, puxa a posição da anotação na lista
        void onClick(Anotacao anotacao, int position);
    }

    public Anotacao_Adapter(ArrayList<Anotacao> lista, OnItemClickListener listener)
    {
        //Adapter, que adapta os dados recebidos para funcionarem no Array
        this.lista = lista;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType)
    {
        //Retornando na tela as mudanças em tempo real
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_anotacao, parent, false);

        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position)
    {
        //Pega a posição da anotação na arraylist
        Anotacao anotacao = lista.get(position);

        //altera as informações para aparecer a respectiva anotação
        holder.txtTitulo.setText(anotacao.getTitulo());
        holder.txtConteudo.setText(anotacao.getConteudo());

        // Data exibida
        holder.txtData.setText(anotacao.getDataCriacao());

        //quando clica, seleciona a anotação correta baseada na ordem da lista
        holder.itemView.setOnClickListener(v -> {
            if (listener != null)
            {
                listener.onClick(anotacao, holder.getAdapterPosition());
            }
        });
    }

    @Override
    public int getItemCount()
    {
        //Função que conta o tamanho da lista e quantas anotações possui
        return lista.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder
    {

        TextView txtTitulo;
        TextView txtConteudo;
        TextView txtData;

        public ViewHolder(@NonNull View itemView)
        {
            super(itemView);

            //Iniciando o layout por aqui

            txtTitulo = itemView.findViewById(R.id.txtTitulo);
            txtConteudo = itemView.findViewById(R.id.txtConteudo);
            txtData = itemView.findViewById(R.id.txtData);
        }
    }
}
