package com.example.crashware.ui.config;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.appcompat.app.AppCompatDelegate;

import com.example.crashware.R;

public class ThemeConfig {

    public static final String KEY_THEME = "theme";

    public static final String SYSTEM = "system";
    public static final String LIGHT = "light";
    public static final String DARK = "dark";
    public static final String GELO = "gelo";

    public static void aplicarTema(Context context) {

        SharedPreferences prefs =
                context.getSharedPreferences("CrashWare", Context.MODE_PRIVATE);

        String tema = prefs.getString(KEY_THEME, SYSTEM);

        switch (tema) {

            case LIGHT:
                AppCompatDelegate.setDefaultNightMode(
                        AppCompatDelegate.MODE_NIGHT_NO);
                break;

            case DARK:
                AppCompatDelegate.setDefaultNightMode(
                        AppCompatDelegate.MODE_NIGHT_YES);
                break;

            case GELO:
                AppCompatDelegate.setDefaultNightMode(
                        AppCompatDelegate.MODE_NIGHT_NO);

                if (context instanceof android.app.Activity)
                {
                    ((android.app.Activity) context)
                            .setTheme(R.style.Theme_CrashWare_Gelo);
                }
                break;

            default:
                AppCompatDelegate.setDefaultNightMode(
                        AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
                break;
        }
    }
}