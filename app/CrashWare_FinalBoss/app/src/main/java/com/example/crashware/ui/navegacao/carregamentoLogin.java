package com.example.crashware.ui.navegacao;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.ProgressBar;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;

import com.example.crashware.R;
import com.example.crashware.ui.api.Auth;
import com.example.crashware.ui.api.Ofensiva;
import com.example.crashware.ui.api.User;
import com.example.crashware.ui.config.ThemeConfig;

public class carregamentoLogin  extends  AppCompatActivity{
    private ProgressBar barra;

    private SharedPreferences prefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {


        ThemeConfig.aplicarTema(this);

        super.onCreate(savedInstanceState);

        EdgeToEdge.enable(this);

        setContentView(R.layout.carregamento);

        prefs = getSharedPreferences("CrashWare", MODE_PRIVATE);

        barra = findViewById(R.id.carregandoTela);

        barra.setProgress(10);

        iniciarCarregamento();
    }

    private void iniciarCarregamento() {

        // 30%
        barra.setProgress(30);

        PrimeiroLogin();
    }

    private void PrimeiroLogin() {

        //Conquista do primeiro login
        //Exibo a conquista
        User.Conquista(9,prefs,this, new User.ConquistasCallback()
        {
            @Override
            public void onSuccess() {
                // Se Conquista der certo

                //Sicronizo com o banco de dados a ofensiva
                Ofensiva.SicronizarOfensiva(prefs, carregamentoLogin.this, new Ofensiva.OfensivaCallback() {
                    @Override
                    public void onSuccess() {
                        // Se Sicronizar Ofensiva der certo

                        // 40%
                        barra.setProgress(30);

                        ValidarOfensiva();
                    }

                });
            }
        });


    }//Primeiro login


    private void ValidarOfensiva()
    {
        //Valido a Ofensiva
        Ofensiva.ValidarOfensiva(prefs, carregamentoLogin.this, new Ofensiva.OfensivaCallback()
        {
            @Override
            public void onSuccess()
            {
                //Se validar ofensiva der certo
                // 60%
                barra.setProgress(60);

                //Apos validar pego os dados do usuario
                carregarPerfil();
            }

        });

    }//Validar Ofensiva


    private void carregarPerfil()
    {

        User.Perfil(
                this,
                prefs,
                new User.PerfilCallback() {

                    @Override
                    public void sucesso(User.PerfilResponse usuario) {
                        // 80%
                        barra.setProgress(80);

                        //Salvo os dados
                        salvarDados(usuario);

                    }
                }
        );
    }


    private void salvarDados(User.PerfilResponse usuario) {

        prefs.edit()

                .putString("nome", usuario.nome)
                .putString("email", usuario.email)
                .putString("foto", usuario.foto)
                .putString("banner", usuario.banner)
                .putString("telefone",usuario.telefone)
                .putString("criado_em" , usuario.criado_em)

                .putInt(
                        "moedas",
                        usuario.moedas != null ? usuario.moedas : 0
                )

                .putFloat(
                        "xp_total",
                        usuario.xp != null ? usuario.xp : 0f
                )

                .putInt(
                        "ofensiva",
                        usuario.ofensiva != null ? usuario.ofensiva : 1
                )

                .putBoolean(
                        "ativo",
                        usuario.ativo != null && usuario.ativo
                )

                .apply();

        if(usuario.ativo == true)
        {
            //Exibo a conquista
            User.Conquista(23, prefs, this, new User.ConquistasCallback() {
                @Override
                public void onSuccess() {
                    abrirHome();
                }
            });
        }


    }

    private void abrirHome() {
        // 100%
        barra.setProgress(100);

        Intent intent =
                new Intent(carregamentoLogin.this, Home.class);

        startActivity(intent);

        finish();
    }
}
