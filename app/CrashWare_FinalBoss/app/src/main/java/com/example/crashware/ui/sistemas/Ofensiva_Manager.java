package com.example.crashware.ui.sistemas;

import android.content.Context;
import android.content.SharedPreferences;

import com.example.crashware.R;
import com.example.crashware.ui.BaseActivity.BaseActivity;

import java.util.Calendar;

public class Ofensiva_Manager extends BaseActivity {

    //Shared Preferences que vai salvar localmente
    private final SharedPreferences prefs;

    //Váriaveis/Chaves que vão ser usadas na Classe

    private static final String KEY_OFENSIVA       = "ofensiva";
    private static final String KEY_ULTIMO_DIA     = "ultimo_dia";
    private static final String KEY_CONGELAMENTOS  = "congelamentos";

    public Ofensiva_Manager(Context context) {

        prefs = context.getSharedPreferences(
                "CrashWare",
                Context.MODE_PRIVATE
                //Iniciando o Shared Preferences que vai ser utilizado
        );
    }



    public int verificarOfensiva() {

        //Váriavel que salva a ofensiva atual, com valor padrão de 0
        int ofensivaAtual = prefs.getInt(KEY_OFENSIVA, 0);

        //Váriavel que salva o último dia de login, com valor padrão de -1
        long ultimoDiaSalvo = prefs.getLong(KEY_ULTIMO_DIA, -1);

        //Iniciando a Biblioteca de calendário, puxando o Dia de Hoje
        Calendar hoje = Calendar.getInstance();

        // Remove horas/minutos/segundos/milissegundos
        hoje.set(Calendar.HOUR_OF_DAY, 0);
        hoje.set(Calendar.MINUTE, 0);
        hoje.set(Calendar.SECOND, 0);
        hoje.set(Calendar.MILLISECOND, 0);

        //Salva em Milissegundos para facilitar a conversão do JAVA
        long hojeMillis = hoje.getTimeInMillis();

        // Primeiro acesso
        //Ou seja, se Não possuir ultimo dia logado, inicia a ofensiva
        if (ultimoDiaSalvo == -1)
        {

            ofensivaAtual = 1;

            //altera o valor salvo localmente
            prefs.edit()
                    .putInt(KEY_OFENSIVA, ofensivaAtual)
                    .putLong(KEY_ULTIMO_DIA, hojeMillis)
                    .apply();

            return ofensivaAtual;
        }

        //A Diferença entre hoje e o Ultimo dia logado resulta na ofensiva atual
        long diferenca = hojeMillis - ultimoDiaSalvo;

        //Cria váriavel, convertendo o dia
        long UM_DIA = 24 * 60 * 60 * 1000L;

        long dias = diferenca / UM_DIA;

        // =========================
        // ENTROU NO DIA SEGUINTE
        // =========================

        //Se a Diferença de dias for 1
        if (dias == 1)
        {
            //Aumenta um dia da Ofensiva
            ofensivaAtual++;

            //Altera A ofensiva salva
            prefs.edit()
                    .putInt(KEY_OFENSIVA, ofensivaAtual)
                    .putLong(KEY_ULTIMO_DIA, hojeMillis)
                    .apply();
        }

        // =========================
        // PERDEU 1 DIA
        // (usa congelamento)
        // =========================

        //Se a diferença for 2 dias, tenta usar o Congelamento de Ofensiva
        else if (dias == 2)
        {

            //Pega a váriavel de Congelamentos
            int congelamentos = prefs.getInt(KEY_CONGELAMENTOS, 0);

            // Usa congelamento
            if (congelamentos > 0) {

                congelamentos--;

                prefs.edit()
                        .putInt(KEY_CONGELAMENTOS, congelamentos)
                        .putLong(KEY_ULTIMO_DIA, hojeMillis)
                        .apply();
            }

            //Senão tiver Congelamentos perde a ofensiva
            else
            {
                //Altera a Ofensiva atual para o inicio novamente/ 1 dia
                ofensivaAtual = 1;

                prefs.edit()
                        .putInt(KEY_OFENSIVA, ofensivaAtual)
                        .putLong(KEY_ULTIMO_DIA, hojeMillis)
                        .apply();

                int Raposatriste = R.drawable.raposasad_icon;
            }
        }

        // =========================
        // PERDEU MAIS DE 1 DIA
        // =========================

        //Se a diferença for maior que dois dias, o Congelamento não funciona, Perdendo a Ofensiva
        else if (dias > 2)
        {
            //Reinicia a ofensiva para um dia
            ofensivaAtual = 1;

            prefs.edit()
                    .putInt(KEY_OFENSIVA, ofensivaAtual)
                    .putLong(KEY_ULTIMO_DIA, hojeMillis)
                    .apply();
        }

        return ofensivaAtual;
    }

    // =========================
    // COMPRAR CONGELAMENTO
    // =========================

    //Função ativada pela Loja, para comprar um novo congelamento
    public void adicionarCongelamento()
    {
        //Cria a váriavel de congelamentos
        int congelamentos = prefs.getInt(KEY_CONGELAMENTOS, 0);

        //Adiciona +1 a sua conta
        prefs.edit()
                .putInt(KEY_CONGELAMENTOS, congelamentos + 1)
                .apply();
    }

    // =========================
    // REMOVER CONGELAMENTO
    // =========================

    public void removerCongelamento()
    {

        //puxa a váriavel de congelamentos
        int congelamentos = prefs.getInt(KEY_CONGELAMENTOS, 0);

        //Se a quantidade possuida de congelamentos for maior que 0, Remove 1
        //Necessário para quando utilizado
        if (congelamentos > 0)
        {

            prefs.edit()
                    .putInt(KEY_CONGELAMENTOS, congelamentos - 1)
                    .apply();
        }
    }

    // =========================
    // PEGAR OFENSIVA
    // =========================

    public int getOfensiva()
    {

        return prefs.getInt(KEY_OFENSIVA, 1);
    }

    // =========================
    // PEGAR CONGELAMENTOS
    // =========================

    public int getCongelamentos()
    {

        return prefs.getInt(KEY_CONGELAMENTOS, 0);
    }

    // =========================
    // RESETAR OFENSIVA
    // =========================

    public void resetarOfensiva()
    {

        prefs.edit()
                .putInt(KEY_OFENSIVA, 1)
                .apply();
    }//Funão de resetar a ofensiva
}



