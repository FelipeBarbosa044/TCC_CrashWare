package com.example.crashware.ui.api;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;
import android.widget.ImageView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;

import org.json.JSONObject;

import java.io.InputStream;
import java.util.List;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Part;

public class User {


    // Armazena a resposta da API:
    public static class PerfilResponse {
        public String nome;
        public String email;
        public String foto;
        public String banner;
        public Integer moedas;
        public Float xp;
        public Boolean ativo;
        public String patente;
        public Integer nivel;
        public Boolean adm;
        public String criado_em;
    }

    // INTERFACE da API:
    public static interface perfil {
        @GET("/user/")
        Call<PerfilResponse> buscar(
                @Header("Authorization") String token
        );
    }

    //Faz com que retorne o objeto
    public interface PerfilCallback {
        void sucesso(PerfilResponse usuario);
    }

    public static void Perfil(Context context, SharedPreferences prefs,PerfilCallback callback) {

        //Pego o valor do token
        String token = prefs.getString("token", null);

        //Preparo ele para enviar para o header da requisição
        token = "Bearer " + token;

        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        //

        // Fazendo que a interface da API seja utilizavel:
        perfil api = retrofit.create(perfil.class);

        // Monto a chamada da API:
        Call<PerfilResponse> requisicao = api.buscar(token);

        requisicao.enqueue(new Callback<PerfilResponse>() {
            @Override
            public void onResponse(
                    Call<PerfilResponse> requisicao,
                    retrofit2.Response<PerfilResponse> resposta
            ) {
                //Caso a requisição retornou resposta
                if (resposta.isSuccessful()) {
                    //Se a requisição der certo

                    PerfilResponse usuario = resposta.body();
                    //Faço retornar para qualquer chamada de função o objeto "usuario"
                    callback.sucesso(usuario);

                } else {
                    //Retorna erro caso  a reqsição estiver errado

                    String erro = "Erro ao obter dados";

                    try {
                        String detail = resposta.errorBody().string();

                        JSONObject json = new JSONObject(detail);


                        if (detail != null) {
                            erro = json.getString("detail");

                        }
                    } catch (Exception e) {
                        // ignora, mantém mensagem padrão
                    }

                    //Aqui retorna o ERRO
                    Toast.makeText(context, erro, Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<PerfilResponse> call, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
                Toast.makeText(
                        context,
                        "Erro de conexão: " + t.getMessage(),
                        Toast.LENGTH_LONG
                ).show();
            }
        });
    }//Perfil


    //Adicionar_Foto
    public static class Adicionar_FotoResponse {
        public String mensagem;
        public String foto;
       
    }

    // INTERFACE da API:
    public static interface foto {
        @Multipart
        @POST("/user/adicionar_foto")
        Call<Adicionar_FotoResponse> adicionar(
                @Header("Authorization") String token,
                @Part MultipartBody.Part foto
        );
    }



    public static void Adicionar_Foto(Context context, SharedPreferences prefs, Uri uri, ImageView imgfotoInicio) {
        //Pego o valor do token
        String token = prefs.getString("token", null);

        //Preparo ele para enviar para o header da requisição
        token = "Bearer " + token;

        try {

            //Pego as informações da foto
            InputStream inputStream = context
                    .getContentResolver()
                    .openInputStream(uri);

            byte[] bytes = new byte[inputStream.available()];
            inputStream.read(bytes);


            //Formato da foto
            String type = context
                    .getContentResolver()
                    .getType(uri);


            //Envio o formato da foto
            RequestBody requestBody = RequestBody.create(
                    MediaType.parse(type),
                    bytes
            );


            MultipartBody.Part fotoPart = MultipartBody.Part.createFormData(
                    "foto",
                    "foto.jpg",
                    requestBody
            );

            // Criando a API
            Retrofit retrofit = new Retrofit.Builder()
                    .baseUrl("https://api-crashware.onrender.com/")
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();

            //

            // Fazendo que a interface da API seja utilizavel:
            foto api = retrofit.create(foto.class);


            // Monto a chamada da API:
            Call<Adicionar_FotoResponse> requisicao = api.adicionar(token,fotoPart);

            requisicao.enqueue(new Callback<Adicionar_FotoResponse>() {
                @Override
                public void onResponse(
                        Call<Adicionar_FotoResponse> requisicao,
                        retrofit2.Response<Adicionar_FotoResponse> resposta
                ) {
                    if (resposta.isSuccessful()) {
                        //Se a requisição der certa

                        //Pego os dados que a API enviou
                        Adicionar_FotoResponse dados = resposta.body();

                        String foto = dados.foto;

                        //Edito  a foto no Shared Preferences
                        prefs.edit()
                                .putString("foto", foto)
                                .commit();


                        String link_foto =
                                "https://yegrosiecwjebeetlwwg.supabase.co/storage/v1/object/public/FOTOS/"
                                        + foto;

                        Glide.with(context)
                                .load(link_foto)
                                .into(imgfotoInicio);

                        Toast.makeText(context, dados.mensagem, Toast.LENGTH_LONG).show();
                    } else {
                        //Retorna erro caso a reqsição dar errado

                        String erro = "Erro ao adicionar foto";

                        try {
                            String detail = resposta.errorBody().string();

                            JSONObject json = new JSONObject(detail);


                            if (detail != null) {
                                erro = json.getString("detail");

                            }
                        } catch (Exception e) {
                            // ignora, mantém mensagem padrão
                        }

                        //Aqui retorna o ERRO
                        Toast.makeText(context, erro, Toast.LENGTH_LONG).show();
                    }

                }

                @Override
                public void onFailure(Call<Adicionar_FotoResponse> call, Throwable t) {
                    // Caso deu erro na requisição
                    // erro de conexão (internet, URL, servidor fora)
                    Toast.makeText(
                            context,
                            "Erro de conexão: " + t.getMessage(),
                            Toast.LENGTH_LONG
                    ).show();
                }
            });

        } catch (Exception e) {
            //Mostra o erro no logcat
            e.printStackTrace();
        }


    }//Adicionar Foto

    //Alterar Foto
    public static class Alterar_FotoResponse {
        public String mensagem;
        public String foto;

    }

    // INTERFACE da API:
    public static interface alterar_foto {
        @Multipart
        @PUT("/user/alterar_foto")
        Call<Alterar_FotoResponse> alterar(
                @Header("Authorization") String token,
                @Part MultipartBody.Part foto
        );
    }



    public static void Alterar_Foto(Context context, SharedPreferences prefs, Uri uri, ImageView img)
    {

        //Pego o valor do token
        String token = prefs.getString("token", null);

        //Preparo ele para enviar para o header da requisição
        token = "Bearer " + token;

        try {

            //Pego as informações da foto
            InputStream inputStream = context
                    .getContentResolver()
                    .openInputStream(uri);

            byte[] bytes = new byte[inputStream.available()];
            inputStream.read(bytes);


            //Formato da foto
            String type = context
                    .getContentResolver()
                    .getType(uri);


            //Envio o formato da foto
            RequestBody requestBody = RequestBody.create(
                    MediaType.parse(type),
                    bytes
            );


            MultipartBody.Part fotoPart = MultipartBody.Part.createFormData(
                    "foto",
                    //Alterar o nome do arquivo
                    "foto.jpg",
                    requestBody
            );

            // Criando a API
            Retrofit retrofit = new Retrofit.Builder()
                    .baseUrl("https://api-crashware.onrender.com/")
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();

            //

            // Fazendo que a interface da API seja utilizavel:
            alterar_foto api = retrofit.create(alterar_foto.class);


            // Monto a chamada da API:
            Call<Alterar_FotoResponse> requisicao = api.alterar(token, fotoPart);

            requisicao.enqueue(new Callback<Alterar_FotoResponse>() {
                @Override
                public void onResponse(
                        Call<Alterar_FotoResponse> requisicao,
                        retrofit2.Response<Alterar_FotoResponse> resposta
                ) {
                    if (resposta.isSuccessful()) {
                        //Se a requisição der certa

                        //Pego os dados que a API enviou
                        Alterar_FotoResponse dados = resposta.body();

                        String foto = dados.foto;

                        //Edito  a foto no Shared Preferences
                        prefs.edit()
                                .putString("foto", foto)
                                .commit();

                        String link_foto =
                                "https://yegrosiecwjebeetlwwg.supabase.co/storage/v1/object/public/FOTOS/"
                                        + foto;
//                                        System.currentTimeMillis();

                        Glide.with(context)
                                .load(link_foto)
                                .skipMemoryCache(true)
                                .diskCacheStrategy(DiskCacheStrategy.NONE)
                                .into(img);

                        //Exibo a mensagem
                        Toast.makeText(context, dados.mensagem, Toast.LENGTH_LONG).show();
                    } else {
                        //Retorna erro caso a reqsição dar errado

                        String erro = "Erro ao alterar foto";

                        try {
                            String detail = resposta.errorBody().string();

                            JSONObject json = new JSONObject(detail);


                            if (detail != null) {
                                erro = json.getString("detail");

                            }
                        } catch (Exception e) {
                            // ignora, mantém mensagem padrão
                        }

                        //Aqui retorna o ERRO
                        Toast.makeText(context, erro, Toast.LENGTH_LONG).show();
                    }

                }

                @Override
                public void onFailure(Call<Alterar_FotoResponse> call, Throwable t) {
                    // Caso deu erro na requisição
                    // erro de conexão (internet, URL, servidor fora)
                    Toast.makeText(
                            context,
                            "Erro de conexão: " + t.getMessage(),
                            Toast.LENGTH_LONG
                    ).show();
                }
            });
        } catch (Exception e) {
            //Mostra o erro no logcat
            e.printStackTrace();
        }

    }//Alterar Foto

    //Adicionar_Banner
    public static class Adicionar_BannerResponse {
        public String mensagem;
        public String banner;

    }

    // INTERFACE da API:
    public static interface banner {
        @Multipart
        @POST("/user/adicionar_banner")
        Call<Adicionar_BannerResponse> adicionar(
                @Header("Authorization") String token,
                @Part MultipartBody.Part banner
        );
    }



    public static void Adicionar_Banner(Context context, SharedPreferences prefs, Uri uri, ImageView img) {
        //Pego o valor do token
        String token = prefs.getString("token", null);

        //Preparo ele para enviar para o header da requisição
        token = "Bearer " + token;

        try {

            //Pego as informações do banner
            InputStream inputStream = context
                    .getContentResolver()
                    .openInputStream(uri);

            byte[] bytes = new byte[inputStream.available()];
            inputStream.read(bytes);


            //Formato do banner
            String type = context
                    .getContentResolver()
                    .getType(uri);


            //Envio o formato do banner
            RequestBody requestBody = RequestBody.create(
                    MediaType.parse(type),
                    bytes
            );


            MultipartBody.Part bannerPart = MultipartBody.Part.createFormData(
                    "banner",
                    "banner.jpg",
                    requestBody
            );

            // Criando a API
            Retrofit retrofit = new Retrofit.Builder()
                    .baseUrl("https://api-crashware.onrender.com/")
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();

            //

            // Fazendo que a interface da API seja utilizavel:
            banner api = retrofit.create(banner.class);


            // Monto a chamada da API:
            Call<Adicionar_BannerResponse> requisicao = api.adicionar(token, bannerPart);

            requisicao.enqueue(new Callback<Adicionar_BannerResponse>() {
                @Override
                public void onResponse(
                        Call<Adicionar_BannerResponse> requisicao,
                        retrofit2.Response<Adicionar_BannerResponse> resposta
                ) {
                    if (resposta.isSuccessful()) {
                        //Se a requisição der certa

                        //Pego os dados que a API enviou
                        Adicionar_BannerResponse dados = resposta.body();

                        String banner = dados.banner;

                        //Altero o banner no Shared Preferences
                        prefs.edit()
                                .putString("banner", banner)
                                .commit();


                        String link_banner =
                                "https://yegrosiecwjebeetlwwg.supabase.co/storage/v1/object/public/banner/"
                                        + banner;

                        Glide.with(context)
                                .load(link_banner)
                                .into(img);

                        Toast.makeText(context, dados.mensagem, Toast.LENGTH_LONG).show();
                    } else {
                        //Retorna erro caso a reqsição dar errado

                        String erro = "Erro ao adicionar banner";

                        try {
                            String detail = resposta.errorBody().string();

                            JSONObject json = new JSONObject(detail);


                            if (detail != null) {
                                erro = json.getString("detail");

                            }
                        } catch (Exception e) {
                            // ignora, mantém mensagem padrão
                        }

                        //Aqui retorna o ERRO
                        Toast.makeText(context, erro, Toast.LENGTH_LONG).show();
                    }

                }

                @Override
                public void onFailure(Call<Adicionar_BannerResponse> call, Throwable t) {
                    // Caso deu erro na requisição
                    // erro de conexão (internet, URL, servidor fora)
                    Toast.makeText(
                            context,
                            "Erro de conexão: " + t.getMessage(),
                            Toast.LENGTH_LONG
                    ).show();
                }
            });

        } catch (Exception e) {
            //Mostra o erro no logcat
            e.printStackTrace();
        }

    }//Adicionar banner


    //Alterar Foto
    public static class Alterar_BannerResponse {
        public String mensagem;
        public String banner;

    }

    // INTERFACE da API:
    public static interface alterar_banner {
        @Multipart
        @PUT("/user/alterar_banner")
        Call<Alterar_BannerResponse> alterar(
                @Header("Authorization") String token,
                @Part MultipartBody.Part banner
        );
    }



    public static void Alterar_Banner(Context context, SharedPreferences prefs, Uri uri, ImageView img)
    {

        //Pego o valor do token
        String token = prefs.getString("token", null);

        //Preparo ele para enviar para o header da requisição
        token = "Bearer " + token;

        try {

            //Pego as informações do banner
            InputStream inputStream = context
                    .getContentResolver()
                    .openInputStream(uri);

            byte[] bytes = new byte[inputStream.available()];
            inputStream.read(bytes);


            //Formato do banner
            String type = context
                    .getContentResolver()
                    .getType(uri);


            //Envio o formato do banner
            RequestBody requestBody = RequestBody.create(
                    MediaType.parse(type),
                    bytes
            );


            MultipartBody.Part bannerPart = MultipartBody.Part.createFormData(
                    "banner",
                    //Alterar o nome do arquivo
                    "banner.jpg",
                    requestBody
            );

            // Criando a API
            Retrofit retrofit = new Retrofit.Builder()
                    .baseUrl("https://api-crashware.onrender.com/")
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();

            //

            // Fazendo que a interface da API seja utilizavel:
            alterar_banner api = retrofit.create(alterar_banner.class);


            // Monto a chamada da API:
            Call<Alterar_BannerResponse> requisicao = api.alterar(token, bannerPart);

            requisicao.enqueue(new Callback<Alterar_BannerResponse>() {
                @Override
                public void onResponse(
                        Call<Alterar_BannerResponse> requisicao,
                        retrofit2.Response<Alterar_BannerResponse> resposta
                ) {
                    if (resposta.isSuccessful()) {
                        //Se a requisição der certa

                        //Pego os dados que a API enviou
                        Alterar_BannerResponse dados = resposta.body();

                        String banner = dados.banner;

                        //Edito  o banner no Shared Preferences
                        prefs.edit()
                                .putString("banner", banner)
                                .commit();

                        String link_banner =
                                "https://yegrosiecwjebeetlwwg.supabase.co/storage/v1/object/public/banner/"
                                        + banner;
//                                        System.currentTimeMillis();

                        Glide.with(context)
                                .load(link_banner)
                                .skipMemoryCache(true)
                                .diskCacheStrategy(DiskCacheStrategy.NONE)
                                .into(img);

                        //Exibo a mensagem
                        Toast.makeText(context, dados.mensagem, Toast.LENGTH_LONG).show();
                    } else {
                        //Retorna erro caso a reqsição dar errado

                        String erro = "Erro ao alterar banner";

                        try {
                            String detail = resposta.errorBody().string();

                            JSONObject json = new JSONObject(detail);


                            if (detail != null) {
                                erro = json.getString("detail");

                            }
                        } catch (Exception e) {
                            // ignora, mantém mensagem padrão
                        }

                        //Aqui retorna o ERRO
                        Toast.makeText(context, erro, Toast.LENGTH_LONG).show();
                    }

                }

                @Override
                public void onFailure(Call<Alterar_BannerResponse> call, Throwable t) {
                    // Caso deu erro na requisição
                    // erro de conexão (internet, URL, servidor fora)
                    Toast.makeText(
                            context,
                            "Erro de conexão: " + t.getMessage(),
                            Toast.LENGTH_LONG
                    ).show();
                }
            });
        } catch (Exception e) {
            //Mostra o erro no logcat
            e.printStackTrace();
        }

    }//Alterar Banner

    //Conquista


    // Dados que vai para a API:
    static class ConquistaRequest {
        public Integer conquista_id;

        public ConquistaRequest(Integer conquista_id) {
            this.conquista_id = conquista_id;
        }
    }

    //Resposta da API
    public static class ConquistaResponse {
            public String nome_conquista;
            public String descricao;
            public String tipo_conquista;
            public Integer moeda_bonus;
            public Float xp_bonus;


        }

        // INTERFACE da API:
        public static interface conquista {

            @POST("/achievement/")
            Call<ConquistaResponse> conquistar(

                    @Header("Authorization") String token,
                    @Body ConquistaRequest request
            );
        }

        public static void Conquista(Integer conquista_id,SharedPreferences prefs,Context context)
        {

            //Pego o valor do token
            String token = prefs.getString("token", null);

            //Preparo ele para enviar para o header da requisição
            token = "Bearer " + token;

            //Objeto do login
            ConquistaRequest dados = new ConquistaRequest(conquista_id);


            // Criando a API
            Retrofit retrofit = new Retrofit.Builder()
                    .baseUrl("https://api-crashware.onrender.com/")
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();

            // Fazendo que a interface da API seja utilizavel:
            conquista api = retrofit.create(conquista.class);


            // Monto a chamada da API
            Call<ConquistaResponse> requisicao = api.conquistar(token,dados);

            // executo a requisicao:
            requisicao.enqueue(new Callback<ConquistaResponse>() {
                @Override
                public void onResponse(
                        Call<ConquistaResponse> requisicao,
                        retrofit2.Response<ConquistaResponse> resposta
                )
                {
                    if(resposta.code() == 409)
                    {
                        //Ignora
                        return;
                    }
                    if(resposta.isSuccessful())
                    {

                        //Primeiro Login se tornara Falso
                        prefs.edit()
                                .putBoolean("PrimeiroLogin",false)
                                .apply();


                        //Requisição der certo
                        ConquistaResponse dados = resposta.body();

                        String nome_conquista = dados.nome_conquista;

                        String descricao = dados.descricao;

                        String tipo_conquista = dados.tipo_conquista;

                        Integer moedas_bonus = dados.moeda_bonus;

                        Float xp_bonus = dados.xp_bonus;

                        if(moedas_bonus != 0)
                        {
                            //Adiciono moeda para o usuario
                            adicionar_moeda(moedas_bonus,prefs);
                        }

                        if(xp_bonus != 0)
                        {
                            //Adiciono xp para o usuario
                            adicionar_xp(xp_bonus,prefs);
                        }



                        //Mostrara esse popup por enquanto (AQUI AONDE VOCê VAI MOSTRAR A CONQUISTA JAO OU ADLER)
                        Toast.makeText(context, nome_conquista, Toast.LENGTH_LONG).show();

                    }
                    else
                    {
                        //Retorna erro caso a reqsição dar errado

//                        String erro = "Erro ao alterar banner";
//
//                        try {
//                            String detail = resposta.errorBody().string();
//
//                            JSONObject json = new JSONObject(detail);
//
//
//                            if (detail != null) {
//                                erro = json.getString("detail");
//
//                            }
//                        } catch (Exception e) {
//                            // ignora, mantém mensagem padrão
//                        }

                        //Aqui retorna o ERRO
//                        Toast.makeText(context, erro, Toast.LENGTH_LONG).show();
                    }


                }//oResponse

                @Override
                public void onFailure(Call<ConquistaResponse> call, Throwable t) {
                    // Caso deu erro na requisição
                    // erro de conexão (internet, URL, servidor fora)
//                    Toast.makeText(
//                            context,
//                            "Erro de conexão: " + t.getMessage(),
//                            Toast.LENGTH_LONG
//                    ).show();
                }
            });

        }//Conquista

        //adicionar_moeda

        // Dados que vai para a API:
        static class RecursosRequest {

            public Integer moedas;
            public Float xp;


            public RecursosRequest(Integer moedas, Float xp) {
                this.moedas = moedas;
                this.xp = xp;
            }
        }

        //Resposta da API
        public static class RecursosResponse {
           //Ignora

        }

        // INTERFACE da API:
        public static interface moeda {

            @POST("/user/moeda")
            Call<RecursosResponse> adicionar(

                    @Header("Authorization") String token,
                    @Body RecursosRequest request
            );
        }

        public static void adicionar_moeda(Integer moedas,SharedPreferences prefs)
        {
            //Pego o valor do token
            String token = prefs.getString("token", null);

            //Preparo ele para enviar para o header da requisição
            token = "Bearer " + token;

            //Objeto do login
            RecursosRequest dados = new RecursosRequest(moedas,null);


            // Criando a API
            Retrofit retrofit = new Retrofit.Builder()
                    .baseUrl("https://api-crashware.onrender.com/")
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();

            // Fazendo que a interface da API seja utilizavel:
            moeda api = retrofit.create(moeda.class);

            // Monto a chamada da API
            Call<RecursosResponse> requisicao = api.adicionar(token,dados);

            // executo a requisicao:
            requisicao.enqueue(new Callback<RecursosResponse>() {
                @Override
                public void onResponse(
                        Call<RecursosResponse> requisicao,
                        retrofit2.Response<RecursosResponse> resposta
                )
                {
                    if(resposta.isSuccessful())
                    {
                        //Requisição der certo

                        
                    }


                }//oResponse

                @Override
                public void onFailure(Call<RecursosResponse> call, Throwable t) {
                    // Caso deu erro na requisição
                    // erro de conexão (internet, URL, servidor fora)
//                    Toast.makeText(
//                            context,
//                            "Erro de conexão: " + t.getMessage(),
//                            Toast.LENGTH_LONG
//                    ).show();
                }
            });



        }//adicionar_xp


    //Adicionar XP

    // INTERFACE da API:
    public static interface xp {

        @POST("/user/xp")
        Call<RecursosResponse> adicionar(

                @Header("Authorization") String token,
                @Body RecursosRequest request
        );
    }

    public static void adicionar_xp(Float xp,SharedPreferences prefs)
    {
        //Pego o valor do token
        String token = prefs.getString("token", null);

        //Preparo ele para enviar para o header da requisição
        token = "Bearer " + token;

        //Objeto do login
        RecursosRequest dados = new RecursosRequest(null,xp);


        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        // Fazendo que a interface da API seja utilizavel:
        xp api = retrofit.create(xp.class);

        // Monto a chamada da API
        Call<RecursosResponse> requisicao = api.adicionar(token,dados);

        // executo a requisicao:
        requisicao.enqueue(new Callback<RecursosResponse>() {
            @Override
            public void onResponse(
                    Call<RecursosResponse> requisicao,
                    retrofit2.Response<RecursosResponse> resposta
            )
            {
                if(resposta.isSuccessful())
                {
                    //Requisição der certo

                }


            }//oResponse

            @Override
            public void onFailure(Call<RecursosResponse> call, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
//                Toast.makeText(
//                        context,
//                        "Erro de conexão: " + t.getMessage(),
//                        Toast.LENGTH_LONG
//                ).show();
            }
        });



    }//adicionar_xp

    //Exibir conquistas

    //Resposta da API
    public static class ExibirConquistaResponse {
        public List<ConquistaResponse> conquistas;


    }

    // INTERFACE da API:
    public static interface exibir_conquista {

        @GET("/achievement/buscar_conquista")
        Call<ExibirConquistaResponse> exibir(
                @Header("Authorization") String token
        );
    }

    public static void ExibirConquista(SharedPreferences prefs) {
        //Pego o valor do token
        String token = prefs.getString("token", null);

        //Preparo ele para enviar para o header da requisição
        token = "Bearer " + token;

        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        // Fazendo que a interface da API seja utilizavel:
        exibir_conquista api = retrofit.create(exibir_conquista.class);

        // Monto a chamada da API
        Call<ExibirConquistaResponse> requisicao = api.exibir(token);

        // executo a requisicao:
        requisicao.enqueue(new Callback<ExibirConquistaResponse>() {

            @Override
            public void onResponse(
                    Call<ExibirConquistaResponse> requisicao,
                    retrofit2.Response<ExibirConquistaResponse> resposta
            ) {

                if (resposta.isSuccessful()) {
                    // Requisição deu certo

                    //Pego a array que mantém as conquistas
                    List<ConquistaResponse> conquistas = resposta.body().conquistas;

                    //For que retorna todos os dados da array
                    for (ConquistaResponse conquista : conquistas) {
                        String nome = conquista.nome_conquista;
                        String descricao = conquista.descricao;

                        //Aqui só vai retornar as conquistas desbloqueadas do usuario

                        //Exibo em conquistas na tela Inicio_Fragment e Conquistas_Fragment:
                        //(BOA SORTE JOAO, TENHO OUTRAS COISAS HÁ FAZER, NÃO POSSO FICAR PARADO)


                    }


                } else {
                    // Requisição deu erro
                    String erro = "Erro Inesperado";

                    //Aqui retorna o ERRO onde fica as conquistas:
                    //Boa sorte JOAO
                }
            }

            @Override
            public void onFailure(
                    Call<ExibirConquistaResponse> call,
                    Throwable t
            )
            {

               // Caso deu erro na requisição
               // erro de conexão (internet, URL, servidor fora)

//             Toast.makeText(
    //                    context,
    //                    "Erro de conexão: " + t.getMessage(),
    //                    Toast.LENGTH_LONG
    //            ).show();
            }

        });//enqueque

    }// Exibir conquista


    }//User
