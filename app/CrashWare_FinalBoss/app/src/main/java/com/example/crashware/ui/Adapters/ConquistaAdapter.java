package com.example.crashware.ui.Adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

public class ConquistaAdapter extends RecyclerView.Adapter<ConquistaAdapter.ViewHolder> {

    private List<Conquista> lista;

    public ConquistaAdapter(List<Conquista> lista) {
        this.lista = lista;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_conquista, parent, false);

        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {

        Conquista conquista = lista.get(position);

        holder.titulo.setText(conquista.getTitulo());
        holder.descricao.setText(conquista.getDescricao());
        holder.imagem.setImageResource(conquista.getImagem());
    }

    @Override
    public int getItemCount() {
        return lista.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {

        TextView titulo, descricao;
        ImageView imagem;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            titulo = itemView.findViewById(R.id.txtTitulo);
            descricao = itemView.findViewById(R.id.txtDescricao);
            imagem = itemView.findViewById(R.id.imgConquista);
        }
    }
}
